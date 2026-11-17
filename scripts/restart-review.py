"""Start an explicitly requested fresh review round after a complete workspace snapshot.

Prior evidence is archived, not discarded. Cached sources are retained but not
marked read for this round. Refuses to reset an already-started restart round.
"""
import argparse
import hashlib
import json
from datetime import datetime, timezone, timedelta
from pathlib import Path

root = Path(__file__).resolve().parents[1]
directory = root / 'data/reviews'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--snapshot', required=True)
args = parser.parse_args()
snapshot = Path(args.snapshot).resolve()
if not (snapshot / 'data/reviews/papers').is_dir() or not (snapshot / 'specialist').is_dir():
    parser.error('Snapshot does not contain the source workspace and review records.')
round_path = directory / 'current-round.json'
if round_path.exists():
    parser.error('A restart round already exists; resume its checkpoints rather than resetting again.')

def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(path)

baseline = json.loads((directory / 'baseline.json').read_text(encoding='utf-8'))
records = {paper_id: json.loads((directory / 'papers' / f'{paper_id}.json').read_text(encoding='utf-8')) for paper_id in baseline['paper_ids']}
now = datetime.now(timezone(timedelta(hours=8))).isoformat(timespec='seconds')
round_id = 'restart-2026-11-16'
save(directory / 'archive/pre-restart-2026-11-16.json', {
    'archived_at': now, 'snapshot_path': str(snapshot), 'reviews': records,
    'relations_yaml': (root / 'data/relations.yml').read_text(encoding='utf-8'),
    'progress_markdown': (root / 'docs/FULL_TEXT_REVIEW.md').read_text(encoding='utf-8'),
})
batches = [
    {'id': 'routing-001', 'owner': 'full_review_routing', 'paper_ids': ['pointer-networks', 'attention-model', 'pomo', 'neurolkh', 'rl-vrp', 'multi-decoder-attention-model', 'matrix-encoding-networks', 'learning-collaborative-policies']},
    {'id': 'graphs-001', 'owner': 'full_review_graphs', 'paper_ids': ['difusco', 'dimes', 'erdos-goes-neural', 'gcn-guided-tree-search', 'learning-what-to-defer', 'mis-tree-search-audit', 'hybrid-scattering-clique', 'ppo-bihyb']},
    {'id': 'studies-001', 'owner': 'full_review_studies', 'paper_ids': ['softdist', 'beyond-heatmap-mcts', 'gumbel-sinkhorn', 'birkhoff-extension', 'comboptnet', 'neural-set-function-extensions', 'gnn-approximation-ratios', 'policy-gradient-landscape-co']},
    {'id': 'root-001', 'owner': 'root', 'paper_ids': ['neural-combinatorial-optimization', 'learning-co-over-graphs']},
]
owners = {paper_id: batch['owner'] for batch in batches for paper_id in batch['paper_ids']}
if len(owners) != sum(len(batch['paper_ids']) for batch in batches):
    raise ValueError('Duplicate paper ownership')
save(directory / 'current-round.json', {
    'id': round_id, 'started_at': now, 'cutoff': baseline['cutoff'], 'paper_count': len(records),
    'snapshot_path': str(snapshot),
    'reading_policy': 'Read the complete identified published or arXiv copy and all scientific appendices/supplements. An explicitly identified arXiv version is acceptable when formal full text is unavailable; exact byte correspondence is not required. Publication eligibility is checked independently.',
    'source_cutoff': 'Use versions available no later than 2026-11-16.',
})
for paper_id, previous in records.items():
    record = dict(previous)
    record.update(round_id=round_id, reviewer=owners.get(paper_id, 'unassigned'), status='pending', reading_log=[], claims=[], metadata_evidence=[], citations=[], citation_scan_complete=False, supplements_checked=False, figures_checked=False, note_crosscheck_complete=False, corrections=[])
    record.pop('reviewed_note_sha256', None)
    record['issues'] = [issue for issue in previous['issues'] if issue.get('category') == 'source_acquisition']
    note = root / record['note_path']
    record['baseline_note_sha256'] = hashlib.sha256(note.read_text(encoding='utf-8').encode('utf-8')).hexdigest()
    record['sources'] = [dict(source, identity_checked=False, version_checked=False) for source in previous['sources']]
    for source in record['sources']:
        if source['url'].lower().endswith('.zip') and 'archive PDF member:' in source['version']:
            source['archive_member'] = source['version'].split('archive PDF member:', 1)[1].strip()
    save(directory / 'papers' / f'{paper_id}.json', record)
save(directory / 'assignments.json', {'round_id': round_id, 'batches': batches, 'unassigned': [paper_id for paper_id in baseline['paper_ids'] if paper_id not in owners]})
print(f'Archived prior evidence and initialized {round_id}: {len(records)} papers; no prior reading counted in this round.')
