import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadPapers } from './content-lib.mjs'
import { loadReviews } from './review-lib.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const auditPath = path.join(root, 'docs/nco-publication-audit-2026-11-16.json')
const checklistPath = path.join(root, 'docs/NCO_PAPER_CHECKLIST_2026-11.md')
const [audit, papers, previous, reviews] = await Promise.all([
  fs.readFile(auditPath, 'utf8').then(JSON.parse),
  loadPapers(root),
  fs.readFile(checklistPath, 'utf8'),
  loadReviews(root),
])
// A draft note is not completed coverage of a publication.
const noteMap = new Map(papers.map(paper => [paper.id, paper]))
const reviewedPapers = papers.filter(paper => reviews.get(paper.id)?.status === 'verified')
const paperMap = new Map(reviewedPapers.map(paper => [paper.id, paper]))
const normalize = text => text.normalize('NFKD').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase()
const titleMap = new Map(reviewedPapers.map(paper => [normalize(paper.title), paper.id]))
const urlMap = new Map(reviewedPapers.map(paper => [paper.paper_url.replace(/\/$/, ''), paper.id]))
const importDirectory = path.join(root, 'data/imports')
const imported = new Map()
const importBatches = []
for (const filename of (await fs.readdir(importDirectory)).filter(name => name.endsWith('.json')).sort()) {
  const manifest = JSON.parse(await fs.readFile(path.join(importDirectory, filename), 'utf8'))
  const entries = (manifest.papers ?? []).filter(paper => paper.audit_id)
  if (!entries.length) continue // Deferral/evidence records are not import manifests.
  importBatches.push({ filename, entries })
  for (const paper of entries) {
    if (paper.status === 'deferred') {
      if (noteMap.has(paper.paper_id)) throw new Error(`${filename}: deferred note is still public ${paper.paper_id}`)
      continue
    }
    if (!noteMap.has(paper.paper_id)) throw new Error(`${filename}: missing note ${paper.paper_id}`)
    if (paperMap.has(paper.paper_id)) imported.set(paper.audit_id, paper.paper_id)
  }
}
for (const record of audit.records) {
  const ids = new Set((record.existing_ids ?? []).filter(id => paperMap.has(id)))
  for (const id of [imported.get(record.audit_id), titleMap.get(normalize(record.title)), urlMap.get(record.url.replace(/\/$/, ''))]) {
    if (id) ids.add(id)
  }
  record.existing_ids = [...ids].sort()
  record.in_repository = ids.size > 0
  if (ids.size === 1) {
    const paper = paperMap.get([...ids][0])
    record.initial_catalogue_metadata ??= { classification: record.classification, type: record.type, category: record.category }
    record.classification = paper.scope
    record.type = paper.paper_type
    if (['survey', 'benchmark'].includes(paper.paper_type)) record.category = 'reference'
    record.reviewed_metadata = {
      paper_id: paper.id, note_path: paper.note_path,
      scope: paper.scope, paper_type: paper.paper_type,
      ...(paper.paradigm ? { paradigm: paper.paradigm } : {}),
      problem_families: paper.problem_families, problems: paper.problems,
      venue: paper.venue, year: paper.year, inclusion: paper.inclusion,
      review_path: `data/reviews/papers/${paper.id}.json`,
    }
  }
}
const eligible = audit.records.filter(record => record.audit_status === 'eligible')
const covered = eligible.filter(record => record.in_repository)
const remaining = eligible.filter(record => !record.in_repository)
const pending = audit.records.filter(record => record.audit_status === 'pending' && !record.in_repository)
const boundary = audit.records.filter(record => record.audit_status === 'boundary')
const categoryCount = (rows, category) => rows.filter(record => record.category === category).length
audit.counts = {
  qualified_total: eligible.length, already_covered: covered.length, to_add: remaining.length,
  repository_note_count: papers.length,
  reviewed_note_count: reviewedPapers.length,
  modern_total: categoryCount(eligible, 'modern'), modern_to_add: categoryCount(remaining, 'modern'),
  reference_total: categoryCount(eligible, 'reference'), reference_to_add: categoryCount(remaining, 'reference'),
  historical_total: categoryCount(eligible, 'historical'), historical_to_add: categoryCount(remaining, 'historical'),
  pending: pending.length, boundary: boundary.length,
}
audit.coverage_updated_on = new Date().toISOString().slice(0, 10)
await fs.writeFile(auditPath, `${JSON.stringify(audit, null, 2)}\n`)

// Preserve the documented search protocol and stable checklist labels from the original audit.
const labels = new Map([...previous.matchAll(/^- \[ \] \*\*([MRH]\d+)\*\* \[.*?\]\((.*?)\)/gm)].map(match => [match[2], match[1]]))
const rules = previous.slice(previous.indexOf('## 纳入、排除与去重规则'), previous.indexOf('## 使用方式'))
  .replace(/对照全部 \d+ 篇现有题名及发表链接/, `对照全部 ${papers.length} 篇现有题名及发表链接`)
const searchAudit = previous.slice(previous.indexOf('<a name="search-audit"></a>'), previous.indexOf('### 正式论文的发表年份分布'))
if (!rules || !searchAudit) throw new Error('Checklist search-protocol sections are missing')
const ordered = rows => [...rows].sort((a, b) => b.year - a.year || a.venue.localeCompare(b.venue) || a.title.localeCompare(b.title))
const linkTitle = record => record.title.replaceAll('[', '\\[').replaceAll(']', '\\]')
function item(record, prefix, index, checkbox = true) {
  const label = labels.get(record.url) ?? `${prefix}${String(index).padStart(4, '0')}`
  return `- ${checkbox ? '[ ] ' : ''}**${label}** [${linkTitle(record)}](${record.url}) — ${record.venue} ${record.year}${record.publication_status === 'early-access' ? '（Early Access）' : ''}`
}
const c = audit.counts
const lines = [
  '# Neural Combinatorial Optimization：已发表论文核验与待添加清单', '',
  `> 截止日期：**${audit.cutoff}**。当前仓库：**${papers.length} 篇笔记**。论文详情见各篇笔记，本文件记录发表核验与录入进度。`, '',
  '[统计结果](#audit-summary) · [现代方法](#modern-methods) · [综述与评测](#research-references) · [历史研究](#historical-papers) · [待核验](#pending-papers) · [已有覆盖](#existing-coverage) · [检索审计](#search-audit)', '',
  '<a name="audit-summary"></a>', '', '## 统计结果', '',
  `在下述发表、场合与主题口径内，共 **${c.qualified_total} 篇**去重正式论文；**${c.already_covered} 篇**已对应仓库笔记，**${c.to_add} 篇**待添加。`, '',
  '| 类别 | 符合口径的总数 | 仓库已覆盖 | 待添加 |', '| --- | ---: | ---: | ---: |',
]
for (const [category, label] of [['modern', '现代方法、训练机制与理论（2015 年起）'], ['reference', '综述、评测与研究资源'], ['historical', '早期神经优化及神经动力学方法']]) {
  lines.push(`| ${label} | ${categoryCount(eligible, category)} | ${categoryCount(covered, category)} | ${categoryCount(remaining, category)} |`)
}
lines.push(`| **合计** | **${eligible.length}** | **${covered.length}** | **${remaining.length}** |`, '',
  `另有 **${pending.length} 篇待核验**与 **${boundary.length} 篇范围边界参考项**，均未计入正式总数。`, '',
  ...importBatches.flatMap(({ filename, entries }) => {
    const deferred = entries.filter(entry => entry.status === 'deferred').length
    const complete = entries.filter(entry => entry.status !== 'deferred' && paperMap.has(entry.paper_id)).length
    const active = entries.length - deferred
    return [`[${filename.replace(/\.json$/, '')} 批次](../data/imports/${filename})：原定 ${entries.length} 篇，活动 ${active} 篇，已完成全文复核 ${complete} 篇，用户指定待补 ${deferred} 篇。`, '']
  }),
  '覆盖统计仅计已完成全文复核的笔记；待复核草稿和用户指定待补项仍保留在待添加清单。待补材料及保全证据见[待补清单](conference-163-deferred-2026-11-17.md)。', '',
  '此前“至少 310 篇”是初轮粗筛下界；当前数字按逐条记录、出版证据和仓库对应关系重算。总数仅适用于明确列出的场合、主题和检索协议，覆盖限制见文末。', '', rules.trim(), '',
  '## 使用方式', '',
  '- 待添加部分列尚未完成全文复核的论文；完成复核后运行 `npm run audit:sync`，条目会移入已有覆盖并重新计算数量。',
  '- 机器可读 JSON 中的 `audit_id` 是稳定标识；`data/imports/` 将其对应到笔记 ID、路径和来源。',
  '- 题名链接正式论文，已有覆盖部分直接链接仓库笔记。不要仅根据文章题名判断 Generalist/Specialist。', '',
)
const groups = ['路由与旅行商问题', '调度、任务分配与芯片布局', '装箱、背包与空间排列', '图上的组合优化', '图匹配、图编辑与二次指派', '整数规划与混合整数优化', 'SAT、CSP 与离散约束推理', '神经搜索、路径规划与组合谜题', '通用框架、训练方法与跨问题迁移']
for (const [category, label, anchor, prefix] of [
  ['modern', '现代方法、训练与理论', 'modern-methods', 'M'],
  ['reference', '综述、评测与研究资源', 'research-references', 'R'],
  ['historical', '早期神经优化与神经动力学方法', 'historical-papers', 'H'],
]) {
  const rows = remaining.filter(record => record.category === category)
  lines.push(`<a name="${anchor}"></a>`, '', `## 待添加：${label}`, '', `共 **${rows.length} 篇**。`, '')
  let index = 0
  if (category === 'modern') {
    for (const group of [...groups, ...new Set(rows.map(row => row.problem_group).filter(group => !groups.includes(group)))]) {
      const subset = ordered(rows.filter(record => record.problem_group === group))
      if (!subset.length) continue
      lines.push(`### ${group}（${subset.length} 篇）`, '', ...subset.map(row => item(row, prefix, ++index)), '')
    }
  } else lines.push(...ordered(rows).map(row => item(row, prefix, ++index)), '')
}
lines.push('<a name="pending-papers"></a>', '', '## 待核验：不计入正式总数', '', `共 **${pending.length} 篇**。正式录入前需补足发表日期或直接神经求解的证据。`, '')
for (const [index, row] of ordered(pending).entries()) {
  lines.push(item(row, 'U', index + 1, false))
  const reason = row.relevance_status || row.scope_status || row.verification_status || row.publication_status || '待确认'
  lines.push(`  - 待核验原因：\`${reason}\`。`)
}
lines.push('', '<a name="existing-coverage"></a>', '', '## 仓库已有覆盖：不重复新增', '', `共 **${covered.length} 篇**，均已移出上方待添加部分。`, '')
for (const row of ordered(covered)) {
  const paper = paperMap.get(row.existing_ids[0])
  lines.push(`- [${linkTitle(row)}](../${paper.note_path}) — ${row.venue} ${row.year} · [正式论文](${row.url})`)
}
const coveredIds = new Set(covered.flatMap(row => row.existing_ids))
const outside = reviewedPapers.filter(paper => !coveredIds.has(paper.id))
lines.push('', '### 现有笔记中未计入本次口径的条目', '', `共 **${outside.length} 篇**。这些笔记保留在仓库中，但不能从本次正式总数中重复扣除。`, '')
for (const paper of outside) {
  const reason = paper.inclusion_reason || (paper.venue === 'arXiv' ? '当前笔记为 arXiv 预印本' : /workshop/i.test(paper.venue) ? 'workshop，不按顶会主会计数' : '本次会议/期刊白名单外')
  lines.push(`- [${paper.title}](../${paper.note_path}) — ${paper.venue} ${paper.year}；${reason}。`)
}
lines.push('', '## 范围边界参考：不计入正式总数', '', `共 **${boundary.length} 篇**。`, '', '<details>', '<summary>展开边界参考清单</summary>', '', ...ordered(boundary).map((row, i) => item(row, 'X', i + 1, false)), '', '</details>', '', searchAudit.trim(), '',
  '### 正式论文的发表年份分布', '', '| 年份 | 符合口径 | 仓库已覆盖 | 待添加 |', '| --- | ---: | ---: | ---: |')
for (const year of [...new Set(eligible.map(row => row.year))].sort((a, b) => b - a)) {
  const rows = eligible.filter(row => row.year === year)
  const done = rows.filter(row => row.in_repository).length
  lines.push(`| ${year} | ${rows.length} | ${done} | ${rows.length - done} |`)
}
lines.push('', '---', '', '本文只登记元信息、发表证据和录入状态。方法细节请阅读对应论文笔记。', '')
await fs.writeFile(checklistPath, lines.join('\n'))
console.log(`Audit coverage: ${covered.length}/${eligible.length}; ${remaining.length} remaining; ${papers.length} repository notes.`)
