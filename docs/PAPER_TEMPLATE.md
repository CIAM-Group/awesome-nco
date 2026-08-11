# Paper Note Template

Copy the content below into `specialist/<id>.md` or `generalist/<id>.md`.

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
scope: specialist
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
- **Main finding:** A budget-aware summary of the reported result.

## Limitations

### Reported by the Authors

- Limitations explicitly discussed by the paper.

### Curator Notes

- Evidence-based observations that are not direct author claims.

## Reproducibility

- **Official implementation:** Link or `Not publicly available`.
- **Checkpoints:** Availability.
- **Main paper references:** Relevant sections, tables, figures, or appendices.
```

If a public original framework image is available, crop only the figure body into `public/paper-assets/paper-id/framework.png`; otherwise leave the entire `figure` block commented out. Add at least one undirected thematic connection for the new paper in `data/relations.yml`.
