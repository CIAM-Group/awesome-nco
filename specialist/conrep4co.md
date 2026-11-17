---
id: conrep4co
short_title: ConRep4CO
title: 'ConRep4CO: Contrastive Representation Learning of Combinatorial Optimization Instances across Types'
authors:
- Ziao Guo
- Yang Li
- Shiyue Wang
- Junchi Yan
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/7d2938962f0e77f701b2faa0efeb8b7a-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/7d2938962f0e77f701b2faa0efeb8b7a-Abstract-Conference.html
institutions:
- Shanghai Jiao Tong University
- Shanghai Innovation Institute
- East China Normal University
- Key Laboratory of MEA, Ministry of Education
- Shanghai Key Laboratory of Pure Mathematics and Mathematical Practice
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
- Satisfiability
problems:
- Minimum Vertex Cover
- Maximum Independent Set
- Maximum Clique
- Minimum Dominating Set
- Boolean Satisfiability
summary: Contrastive graph/SAT pretraining transfers representations through a shared SAT teacher to separate decision
  encoders and constructive optimization solvers, with task-specific alignment and fine-tuning.
code_url: https://github.com/Thinklab-SJTU/ConRep4CO
figure:
  path: paper-assets/conrep4co/framework.png
  alt: 'Original ConRep4CO Figure3: separate graph decision models align with a shared SAT encoder and output module.'
  caption: 'Figure3: original ConRep4CO contrastive graph/SAT training framework.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/file/7d2938962f0e77f701b2faa0efeb8b7a-Paper-Conference.pdf#page=4
---

# ConRep4CO: Contrastive Representation Learning of Combinatorial Optimization Instances across Types

> **TL;DR:** ConRep4CO aligns separate graph-problem encoders with a shared SAT encoder through equivalent CNF instances. This transfers representations to decision models and four optimization families. The SAT model is a training teacher; the experiments retain distinct deployed graph solvers and fine-tune newly introduced tasks.

## Motivation

Problem reductions connect combinatorial decision problems, while neural representations are usually trained separately. The paper uses SAT as a common representation space: an original graph instance and its equivalent CNF form a positive pair, allowing a reusable teacher to support problem-specific solvers. Polynomial reducibility alone does not establish inexpensive encoding, efficient SAT solution or optimal neural optimization. [pp. 1–5, 16–18]

## Contributions

- Joint supervised/contrastive pretraining of seven graph-decision encoders and one shared SAT encoder, using graph/SAT representations rather than common native input formats.
- A frozen-teacher alignment procedure that equips existing MVC, MIS, maximum-clique and minimum-dominating-set solvers with pretrained representations.
- Experiments across graph/SAT backbones, graph sizes, held-out decision domains, data budgets and downstream optimization models. [pp. 3–10, 21–22]

## Methodology

The decision tasks are k-clique, k-dominating-set, k-vertex-cover, k-coloring, k-independent-set, perfect matching and nontrivial graph automorphism. CNFGen creates corresponding SAT encodings. Each task has its own graph representation extractor and binary output module; SAT instances from all tasks share a SAT extractor and head. Positive pairs represent the same instance, while other instances in the task's minibatch supply negatives. Cosine similarities are temperature-scaled. Eq. 2 excludes the positive pair from each denominator, unlike the usual positive-included CLIP cross-entropy; the checked implementation follows this exclusion in both directions. Negative contrastive values consequently are not themselves an implementation error. [pp. 4–6, 16–20]

Training starts with decision supervision and subsequently adds contrastive alignment, weighted against the decision loss by β. Graph backbones include GCN, GraphSAGE, PGN and GraphGPS; SAT alternatives include NeuroSAT and GCN with literal–clause or variable–clause graphs. The documented default graph model has 12 message-passing layers, learned node/k features, mean pooling and a binary MLP head; NeuroSAT uses 32 recurrent iterations. These heads classify satisfiability and do not by themselves produce a satisfying assignment or a graph witness. [pp. 6–8, 18–21]

For optimization, the SAT teacher is frozen. The downstream solver's representation is aligned with the equivalent SAT instance, followed by native-domain fine-tuning. MVC uses OptGNN and GCNN; MIS, maximum clique and MDS use GFlowNet solvers. The unseen-decision experiment likewise creates a **new** graph encoder and fine-tunes it using 20,000 target instances. It establishes representation transfer with target supervision, rather than zero-shot deployment on a new task. [pp. 6–10]

**Classification:** Specialist / constructive. The common SAT teacher supports cross-problem training, but graph encoders and downstream optimization solvers remain separate. The checked experiments do not demonstrate one shared deployed optimization checkpoint across these native problems. The optimization integrations construct candidate solutions rather than learning edits of an incumbent. [pp. 4–6, 8–10]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| Decision data | Each of seven tasks: 160,000/20,000/20,000 train/validation/test instances at easy and medium difficulty; hard splits contain 20,000 test instances |
| Label balance | 50% satisfiable and 50% unsatisfiable in every decision split |
| Decision sizes | Small task-dependent graphs, roughly 4–30 nodes in Table 8; automorphism uses 4–12 nodes |
| Downstream graphs | MVC: ER, 50–100/100–200/400–500 nodes; MIS/clique: RB, 200–300/800–1,200; MDS: BA, 200–300/800–1,200 |
| Optimization | Adam learning rate 10⁻⁴, weight decay 10⁻⁸, gradient clipping 1; temperature 0.1 easy/0.5 medium; β between 0.5 and 1 |
| Hardware and time | NVIDIA H100 80 GB; approximately 40 hours of joint pretraining, then 5–6 hours per graph-model fine-tuning run |

- **Decision accuracy:** LCG–NeuroSAT/GCN easy-task mean rises from 68.5% to 71.9%; medium mean rises from 65.7% to 69.1%. Improvements are not universal: PGN medium clique is 72.0% versus 72.4%, and GraphGPS medium matching falls from 69.4% to 57.2%. On hard matching, the medium-trained GraphGPS variant scores 60.1% versus 63.9%. [pp. 6–7]
- **Downstream quality:** Reported mean relative reductions in **absolute reference gaps** are 61.27% for MVC/OptGNN, 25.74% for MVC/GCNN, 32.20% for MIS, 36.46% for maximum clique and 45.29% for MDS. For small MVC, objective 55.87 becomes 54.70 against reference 54.62: gap 1.25 becomes 0.08. The resulting 93.6% gap reduction is not a 93.6% improvement of the objective itself. [pp. 8–9]
- **Representative objectives:** Large MIS improves from 37.48 to 38.79 against reference 43.15; small clique improves from 16.24 to 17.47 against 19.05; large MDS drops from 110.28 to 108.19 against 103.80. Reference gaps are empirical comparisons rather than general optimality certificates. [pp. 8–9]
- **Transfer:** The held-out-domain decision mean is 71.6% versus 70.1% for the standalone graph baseline, after target alignment/fine-tuning. Appendix F's 7–20× larger graphs use one eighth of target training data and score 68.7% versus 67.9% for full-data standalone training. Neither protocol is zero-shot. [pp. 7, 9, 22]
- **Controls:** Matching sevenfold baseline data volume gives 69.3% versus ConRep4CO's 71.9% for the specified GCN control. More source domains do not improve every cell monotonically: six domains give small-MVC objective 54.68 versus seven domains' 54.70, and small MIS 19.57 versus 19.56. [pp. 10, 22]

## Limitations

### Reported by the Authors

- Joint pretraining needs labels and SAT conversion; label-efficient objectives and other reduction targets are proposed future directions. The reusable teacher avoids repeating all pretraining for each application, but each downstream solver still needs alignment and native fine-tuning. [pp. 6, 10]

### Curator Notes

- Appendix C calls six decision tasks NP-complete except matching, although nontrivial graph automorphism is not known to be NP-complete. This note does not repeat that blanket classification; see the explicit complexity statement in [Symmetric Blocking, Section 3](https://carlosareces.github.io/content/papers/files/tcs15.pdf#page=6).
- Table 8 prints clique edge probability C(v,k)^(−1/C(v,2)) while claiming one expected k-clique. For an unconditioned ER graph that expectation is C(v,k)p^C(k,2), requiring exponent −1/C(k,2). The released generator uses this latter expression. Subsequent connectivity rejection and SAT/UNSAT balancing also change the generated distribution; the expectation is a design heuristic, not a guarantee for the balanced final data.
- Table 7 labels MDS as RB, while Section 4.1 and Table 5 specify BA. The downstream graph family is recorded as BA, with this table-label inconsistency preserved here.
- Appendix C.2 describes four additional SAT datasets and assignment/core labels, but the reported experimental tables do not establish a separate assignment-recovery or unsatisfiable-core result. Decision accuracy is not substituted for those outcomes.
- Pretraining time excludes subsequent per-solver alignment, fine-tuning and encoding/label generation. A 40-hour claim for the entire benchmark suite would be unsupported. The study does not establish a practical general-purpose SAT solver or a universal approximation guarantee.

## Reproducibility

- **Published source:** [ICLR 2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/7d2938962f0e77f701b2faa0efeb8b7a-Abstract-Conference.html), dated 2026-04-20. All 22 formal pages, complete references, Appendices A–G, 13 tables and four figures were freshly read; the complete official poster was also visually checked.
- **Scientific materials:** The publisher's 72-member supplementary ZIP contains code, directories and macOS metadata, with no separate scientific PDF, notebook, nested archive or video. The complete 36-entry author-repository tree was inspected. Of 28 matching files, all 27 implementation/configuration files have identical Git blob hashes; only README differs. OpenReview API access failed and is not counted as inspected content.
- **Implementation:** [ConRep4CO](https://github.com/Thinklab-SJTU/ConRep4CO) provides three decision-data generators and a three-domain training example. The checked graph-model dispatcher implements GCN/SAGE/GNN/GIN; a GraphGPS class exists elsewhere, but the dispatcher and example do not reproduce all paper backbones. No complete OptGNN/GFlowNet downstream experiment drivers were found in this release.
- **Defaults:** The trainer's mean-pooling default matches the paper, despite the lower-level encoder's max-pooling default. Its contrastive-start default is epoch 0, so the decision-only warm start requires an explicit override. The joint branch computes each task loss and backpropagates their mean into the shared SAT model and separate graph optimizers. No training or benchmark rerun was performed.
- **Figure:** The framework image is original formal Figure 3, including its caption and all graph/SAT branches.
