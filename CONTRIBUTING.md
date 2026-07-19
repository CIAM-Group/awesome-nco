# Contributing to Awesome NCO

Thank you for helping maintain a useful research index for neural combinatorial optimization. Contributions should be neutral, source-driven, and consistent with the repository taxonomy.

## Add a Paper

No website code changes are required.

1. Decide whether the paper is a [specialist](specialist/README.md) or [generalist](generalist/README.md) solver.
2. Copy [docs/PAPER_TEMPLATE.md](docs/PAPER_TEMPLATE.md) into the corresponding directory and rename it to `<id>.md`.
3. Set the Front Matter `id` to the same lowercase, hyphenated value as the filename.
4. Complete every required research-note section.
5. Open a pull request. Automated checks validate the paper and rebuild the website.

The generated paper-index blocks in the category READMEs and `src/generated/` must not be edited manually.

## Front Matter

Required fields:

- **`id`:** Stable lowercase identifier using letters, numbers, and hyphens; it must match the filename.
- **`short_title`:** Common acronym or concise display title.
- **`title`:** Full paper title.
- **`authors`:** One author per YAML list item, in paper order.
- **`year`:** Conference or journal year.
- **`date`:** First public release date in `YYYY-MM-DD` format, normally the arXiv v1 date.
- **`venue`:** Conference, journal, or `arXiv`.
- **`paper_url`:** Original paper page or public PDF.
- **`institutions`:** Human-readable institution names.
- **`scope`:** `specialist` or `generalist`.
- **`paradigm`:** `constructive`, `improvement`, or `constructive-improvement`.
- **`problem_families`:** Broad families such as Routing, Scheduling, Packing, or Graph Optimization.
- **`problems`:** Full optimization-problem names.
- **`summary`:** One neutral sentence describing the method.

Optional fields:

- **`arxiv_url`:** arXiv abstract page when available.
- **`code_url`:** Official implementation when available.

## Scope and Paradigm

A specialist solver is trained for one optimization problem. Reusing an architecture with a separate checkpoint for every problem remains specialist. Size or distribution generalization within one problem is also specialist generalization.

A generalist solver uses a shared model or checkpoint across multiple distinct optimization problems. Lightweight task-specific adapters are allowed when the core solver is shared.

- **Constructive:** Builds a complete solution from an empty or partial solution.
- **Improvement:** Starts from a complete solution and repeatedly modifies it.
- **Constructive + Improvement:** Both stages are substantive parts of the proposed method; optional conventional post-processing alone does not qualify.

## Research Note Standard

Every note must contain these second-level headings:

- `Motivation`
- `Contributions`
- `Methodology`
- `Experiments`
- `Limitations`
- `Reproducibility`

Separate author-reported limitations from curator observations. Report evaluation budgets when they materially affect comparisons, and link to original sources rather than secondary summaries.

## Local Checks

Requires Node.js 20.19 or newer.

```bash
npm install
npm run validate
npm test
npm run build
```

To regenerate the category indexes locally:

```bash
npm run indexes
```
