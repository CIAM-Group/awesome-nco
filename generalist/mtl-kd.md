---
id: mtl-kd
short_title: "MTL-KD"
title: "MTL-KD: Multi-Task Learning Via Knowledge Distillation for Generalizable Neural Vehicle Routing Solver"
authors:
  - "Yuepeng Zheng"
  - "Fu Luo"
  - "Zhenkun Wang"
  - "Yaoxin Wu"
  - "Yu Zhou"
year: 2025
date: 2025-06-03
acceptance:
  date: "2025-09-18"
  source_url: "https://neurips.cc/Conferences/2025/CallForPapers"
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2025/hash/899c6a43b9976e1077522fe5a39cafa3-Abstract-Conference.html"
code_url: "https://github.com/CIAM-Group/MTLKD"
arxiv_url: "https://arxiv.org/abs/2506.02935"
institutions:
  - "Southern University of Science and Technology"
scope: generalist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
  - "Open Vehicle Routing Problem"
  - "Pickup and Delivery Vehicle Routing Problem"
summary: "MTL-KD distills several specialist routing teachers into one multi-task student to preserve task expertise while sharing parameters."
---

# MTL-KD: Multi-Task Learning Via Knowledge Distillation for Generalizable Neural Vehicle Routing Solver

> **TL;DR:** MTL-KD distills several specialist routing teachers into one multi-task student to preserve task expertise while sharing parameters.

## Motivation

Joint reinforcement learning can suffer negative transfer and provides no direct target for recovering strong specialist behavior.

## Contributions

- Introduces **MTL-KD** as a concrete neural routing method for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Pickup and Delivery Vehicle Routing Problem.
- Problem-specific teachers generate logits or trajectories and a shared student combines distillation with multi-task routing objectives.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Pickup and Delivery Vehicle Routing Problem.
2. Problem-specific teachers generate logits or trajectories and a shared student combines distillation with multi-task routing objectives.
3. The student uses one checkpoint across tasks; greedy and augmented results differ by the number of decoded trajectories.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Pickup and Delivery Vehicle Routing Problem.
- **Scale and budget:** Experiments cover multiple VRP variants, standard scales, and held-out combinations or distributions.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Distillation narrows the gap between one shared solver and separately trained specialists.

## Limitations

### Reported by the Authors

- Training requires strong teacher models and the student inherits their blind spots and predefined task coverage.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2025/hash/899c6a43b9976e1077522fe5a39cafa3-Abstract-Conference.html)
- **Preprint:** [arXiv:2506.02935](https://arxiv.org/abs/2506.02935)
- **Official implementation:** [repository](https://github.com/CIAM-Group/MTLKD)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
