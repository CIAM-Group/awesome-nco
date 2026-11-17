# Contributing to Awesome NCO

Thank you for helping maintain a useful research index for neural combinatorial optimization. Contributions should be neutral, source-driven, and consistent with the repository taxonomy.

## Add a Paper

No website code changes are required.

1. Classify the paper as a [generalist](README.md#generalist-solvers), [specialist](README.md#specialist-solvers), or [research study](README.md#research-studies). Studies go in `studies/`.
2. Copy [docs/PAPER_TEMPLATE.md](docs/PAPER_TEMPLATE.md) into the corresponding directory and rename it to `<id>.md`.
3. Set the Front Matter `id` to the same lowercase, hyphenated value as the filename.
4. Obtain the formal published text and scientific supplements, check the version, and read them in full before claiming verification. Complete every required research-note section with source locators.
5. Record only explicit internal citations in the paper's review record; `npm run review:sync` generates [`data/relations.yml`](data/relations.yml). An isolated paper is valid.
6. Optionally add a framework image from the original paper under `public/paper-assets/<id>/framework.png` and complete the `figure` block.
7. Open a pull request. Automated checks validate the paper and rebuild the website.

The generated navigation and paper-index blocks in the main README and `src/generated/` must not be edited manually.

## Front Matter

Required fields:

- **`id`:** Stable lowercase identifier using letters, numbers, and hyphens; it must match the filename.
- **`short_title`:** Common acronym or concise display title.
- **`title`:** Full paper title.
- **`authors`:** One author per YAML list item, in paper order.
- **`year`:** Conference or journal year.
- **`date`:** First documented public date, using only verified `YYYY`, `YYYY-MM`, or `YYYY-MM-DD` precision. When `arxiv_url` is present, use the exact arXiv v1 date.
- **`venue`:** Conference, journal, or `arXiv`.
- **`paper_url`:** Original paper page or public PDF.
- **`institutions`:** Affiliations printed in the reviewed paper, not the authors' current affiliations. Use an empty list when not established.
- **`scope`:** `specialist`, `generalist`, or `study` (directory `studies/`).
- **`paper_type`:** `solver` (the backward-compatible default), `theory`, `benchmark`, `analysis`, or `survey`. Use a non-solver type for studies.
- **`paradigm`:** Required for solvers: `constructive`, `improvement`, `constructive-improvement`, or `neurodynamic`. Omit it for studies.
- **`problem_families`:** Broad families such as Routing, Scheduling, Packing, or Graph Optimization.
- **`problems`:** Full optimization-problem names.
- **`summary`:** One neutral sentence describing the method.

Optional fields:

- **`inclusion`:** `main` (default) or `reference`. Preprints, workshop papers and publications outside the approved venue criteria belong in the reference collection. Reference entries require an `inclusion_reason`; retain stable IDs and paths.
- **`arxiv_url`:** arXiv abstract page when available.
- **`code_url`:** Official implementation when available.
- **`figure`:** Framework-image metadata. When present, all four nested fields are required:
  - **`path`:** Repository path below `public/`, which must stay inside `paper-assets/<id>/`.
  - **`alt`:** Concise description of the visual content for screen-reader users.
  - **`caption`:** Original figure number and a neutral description.
  - **`source_url`:** Public URL for the original paper or PDF containing the figure.

Framework images must be cropped from a publicly available original paper, not generated or redrawn. Crop the figure body without the printed caption, keep labels legible, and use a PNG around 1600–2000 px wide. If no reliable original image is publicly available, omit `figure` entirely.

Formal papers must declare sourced **`acceptance`** or **`publication`** evidence (both may be provided). Each block has `date` and `source_url`. A general conference notification schedule does not establish the individual paper's acceptance date. Prefer the actual decision or publisher/proceedings record, at its documented precision; a publication year is sufficient. Never infer acceptance from publication. Papers whose venue is `arXiv` must omit both blocks.

```yaml
publication:
  date: '2025'
  source_url: https://example-publisher.org/official-paper-record
```

## Paper Relations

Relations are directed citations, generated from verified records in `data/reviews/papers/`. The arrow points from `citing` to `cited`. Record an explicit text citation and the matching bibliography entry with one-based PDF page numbers. A common architecture, shared task or a bibliography title substring alone does not establish a citation. Identify the cited edition when it is a preprint, and do not merge differently titled conference/journal articles without establishing their correspondence. Citations are not claims of derivation or causal influence.

One directed pair appears at most once; multiple supporting locators belong in its `evidence` array. A reverse pair is a different assertion and needs its own evidence. There is no minimum degree. Unsupported connections are excluded rather than invented to connect the graph.

```yaml
citing: paper-id
cited: referenced-paper-id
reference_label: '[12] Author et al. (2020)'
description: The paper explicitly compares this method in its evaluation.
evidence:
  - source_id: paper
    pdf_pages: [4, 10]
    locator: Section 3 discussion and bibliography entry 12
```

## Scope and Paradigm

A specialist solver is trained for one optimization problem. Reusing an architecture with a separate checkpoint for every problem remains specialist. Size or distribution generalization within one problem is also specialist generalization.

A generalist solver uses a shared model or checkpoint across multiple distinct optimization problems. Lightweight task-specific adapters are allowed when the core solver is shared.

Reported zero-shot reuse through a fixed reduction, such as encoding several graph decision problems as SAT, also qualifies. Name the original tasks and encoding, and distinguish decision success from optimization quality or optimality certification. A paper containing both task-specific models and a demonstrated generalist model must identify which results use the shared model; merely proposing an NP-complete intermediate representation is insufficient.

Research Studies contains theory, benchmarks, empirical analyses, position papers and surveys. A reusable modeling layer or training framework may still be a specialist method; showing separate per-task experiments does not establish a shared solving checkpoint.

- **Constructive:** Builds a complete solution from an empty or partial solution.
- **Improvement:** Starts from a complete solution and repeatedly modifies it.
- **Constructive + Improvement:** Both stages are substantive parts of the proposed method; optional conventional post-processing alone does not qualify.
- **Neurodynamic:** Optimization through recurrent neural energy dynamics or annealing, including historical analog and mean-field methods.

## Research Note Standard

Every note must contain these second-level headings:

- `Motivation`
- `Contributions`
- `Methodology`
- `Experiments`
- `Limitations`
- `Reproducibility`

Separate author-reported limitations from curator observations. Report objective/gap units, reference quality, timing units, hardware, training labels, adaptation and downstream search budgets when they affect comparisons. A heuristic reference is not a certified optimum; code availability is not successful reproduction. State theorem assumptions and distinguish conditional results from optimization guarantees.

## Full-Text Review Records

The frozen 364-paper roster and previous thematic graph are retained in `data/reviews/baseline.json`. The active records are in `data/reviews/papers/<id>.json`, and [the generated ledger](docs/FULL_TEXT_REVIEW.md) shows actual progress. `pending`, `reading` and `blocked` records are not completed reviews.

Each verified record requires version-checked sources with SHA-256 digests, complete page coverage for the main text and registered supplements, claim-to-page evidence, metadata evidence, a bibliography/citation scan, figure and note cross-checks, no unresolved issues, and the reviewed note's normalized-text SHA-256. Editing a verified note requires reopening and checking its record. Cached PDFs and rendered inspection sheets stay in ignored `research/`; tracked records preserve their provenance.

An identified arXiv version available by the cutoff is an acceptable reading copy when formal full text is unavailable. Record the version and any known differences; byte identity with a publisher PDF is not required. Formal publication eligibility is checked separately against `data/inclusion-policy.json`. Read scientific PDFs inside supplementary ZIP files and identify their `archive_member`; inspect code/data attachment descriptions for additional scientific material. Set `supplements_checked` only after this manual check and preserve its basis in metadata evidence. An unavailable attachment inventory is not proof that no attachment exists.

`data/reviews/current-round.json` identifies the active round; earlier records are archived for comparison and do not count as fresh reading. Checkpoint only pages actually read, including all text and relevant tables. Truncated tool output must be reread before checkpointing.

```bash
python scripts/review-papers.py status
python scripts/review-papers.py fetch paper-id
python scripts/review-papers.py read paper-id --start 1 --end 3
python scripts/review-papers.py checkpoint paper-id --start 1 --end 3 --notes "What was actually read and checked"
python scripts/render-review.py paper-id paper:3 supplement:2
python scripts/reference-candidates.py paper-id
npm run review:sync
```

The Python helpers require PyMuPDF, requests, BeautifulSoup, PyYAML and Pillow. Downloading, extracting, rendering and exact-title matching never mark a paper read or create citations. Inspect complete scientific supplements, including separately linked PDFs, before recording reading coverage. `review:complete` fails until all frozen entries are verified and must not be used to hide incomplete work.

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

After adding papers from the publication audit, run `npm run audit:sync` to reconcile coverage and regenerate its Markdown checklist. Batch provenance is recorded in `data/imports/`; paper notes remain the source of truth for website content.
