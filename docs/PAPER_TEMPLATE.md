# Paper Note Template

Copy the content below into `specialist/<id>.md`, `generalist/<id>.md`, or `studies/<id>.md`.

```markdown
---
id: paper-id
short_title: Short Title
title: 'Full Paper Title'
authors:
  - First Author
  - Second Author
year: 2025
date: 2024-01-01
publication:
  # Use only the precision supported by the linked official source: YYYY, YYYY-MM, or YYYY-MM-DD.
  date: '2025'
  source_url: https://example-publisher.org/official-paper-record
venue: Conference or Journal
paper_url: https://example.com/paper.pdf
# arxiv_url: https://arxiv.org/abs/0000.00000
# code_url: https://github.com/organization/repository
# figure:
#   path: paper-assets/paper-id/framework.png
#   alt: Concise description of the framework diagram.
#   caption: 'Figure 1: Neutral description matching the original paper.'
#   source_url: https://example.com/paper.pdf
institutions:
  - Example University
# inclusion: reference
# inclusion_reason: Workshop track outside the main inclusion criteria.
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
  - Routing
problems:
  - Traveling Salesman Problem
summary: One neutral sentence describing the paper's central method and purpose.
---

# Full Paper Title

> **TL;DR:** A concise one-sentence explanation for readers scanning the note.

## Motivation

Explain the research problem, prior limitation, and why the proposed direction matters.

## Contributions

- State the paper's main contributions without promotional language.

## Methodology

1. Describe the solver pipeline in implementation order.

## Experiments

- **Problems:** Problems and instance families used in evaluation.
- **Baselines:** Main learned, heuristic, or exact comparisons.
- **Metrics:** Solution quality, gap, runtime, or other reported metrics.
- **References and units:** State whether gaps use certified optima or heuristic references, and whether timings are per instance or for a full dataset.
- **Budgets:** Training labels, adaptation steps, sample counts, search/postprocessing and hardware needed to interpret the comparison.
- **Main finding:** A budget-aware summary of the reported result.

## Limitations

### Reported by the Authors

- Limitations explicitly discussed by the paper.

### Curator Notes

- Evidence-based observations that are not direct author claims.

## Reproducibility

- **Official implementation:** Verified author link, or state that no official implementation was identified in the reviewed sources.
- **Checkpoints:** Verified availability; access is not execution or reproduction.
- **Reviewed version:** Published/accepted version and all scientific supplements, with their source URLs and page coverage in the review record.
- **Main paper references:** Relevant sections, tables, figures, or appendices.
```

For an arXiv-only paper, set `venue: arXiv`, `inclusion: reference`, document `inclusion_reason`, and remove both `acceptance` and `publication`. When `arxiv_url` is present, `date` must be the exact arXiv v1 date. Without an arXiv link, public dates may have year or month precision. Workshops and venues outside the approved criteria also belong in the reference collection.

The example uses an evidenced publication year. Add an `acceptance` block only when an individual decision is documented. A general notification schedule does not establish the paper's actual acceptance date. Do not invent day precision.

Keep the three timelines separate: `year` identifies the conference or journal-volume edition; `publication.date` uses the publisher's explicit electronic publication record; `date` is the verified arXiv v1 date when `arxiv_url` is present, otherwise the supported public-record date. A NeurIPS 2025 proceedings record can therefore have a 2026 electronic publication date. Never display a formal publication date as an arXiv date. Check the actual submission history rather than inferring a date from the arXiv identifier or conference schedule.

For a research study, set `scope: study`, choose `paper_type: theory`, `benchmark`, `analysis`, or `survey`, and omit `paradigm`. For a historical energy-dynamics solver, use `paradigm: neurodynamic`.

If a public original framework image is available, crop the complete figure body, including panel labels, into `public/paper-assets/paper-id/framework.png`; otherwise omit `figure`. Record directed citations with source-page evidence in the paper's review JSON. `npm run review:sync` generates the graph from verified citing-paper records. A paper without verified internal citations remains valid and visible. Follow [the review workflow](../CONTRIBUTING.md#full-text-review-records) before marking a note verified.
