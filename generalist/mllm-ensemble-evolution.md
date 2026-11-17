---
id: mllm-ensemble-evolution
short_title: MLLM Ensemble Evolution
title: Structure-Aware Cooperative Ensemble Evolutionary Optimization on Combinatorial Problems with Multimodal
  Large Language Models
authors:
- Jie Zhao
- Kang Hao Cheong
year: 2025
date: '2025-10-24'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/0cda0892c74edef6bc73e46a4480511f-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/0cda0892c74edef6bc73e46a4480511f-Abstract-Conference.html
institutions:
- Nanyang Technological University
scope: generalist
paper_type: solver
paradigm: improvement
problem_families:
- Graph Optimization
- Routing
problems:
- Influence Maximization
- Network Immunization
- Network Dismantling
- TSP
summary: A frozen multimodal model proposes evolutionary operators from sparsified graph images; cooperative
  domains and layout voting improve selected objectives, with separate toy-task demonstrations and substantial
  API/implementation qualifications.
arxiv_url: https://arxiv.org/abs/2510.21906
code_url: https://osf.io/hymgp/overview?view_only=f37dfac5aed44ba8a00d2f9213a0e7d6
figure:
  path: paper-assets/mllm-ensemble-evolution/framework.png
  alt: Graph images encode two parent seed sets for crossover and a current seed set for removal/addition mutation.
  caption: 'Figure 3: image-based evolutionary operators for influence maximization.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/0cda0892c74edef6bc73e46a4480511f-Paper-Conference.pdf#page=6
---

# Structure-Aware Cooperative Ensemble Evolutionary Optimization on Combinatorial Problems with Multimodal Large Language Models

> **TL;DR:** A frozen GPT-4o model proposes evolutionary crossover/mutation from graph images. Degree/community sparsification, cross-domain elite transfer and voting across three graph layouts support influence maximization; small network immunization, dismantling and TSP examples reuse the model. **Generalist/improvement** describes this evidence: the paper also proposes and separately studies neural initialization, but a jointly evaluated neural-initialization-plus-improvement pipeline is not established by the main comparisons.

## Motivation

Textual graph encodings grow with network size and can obscure structure for language-model operators. Images expose connectivity, while different layouts emphasize different patterns. The proposed framework investigates whether a multimodal model can use these views to produce useful search moves. The authors explicitly present an illustrative optimization framework rather than claiming state-of-the-art influence maximization. Image token count at a fixed resolution does not establish preserved structural information or constant end-to-end computation. [Sections1–3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/0cda0892c74edef6bc73e46a4480511f-Paper-Conference.pdf#page=1)

## Contributions

- Two sparsification domains retain degree-important or community-representative nodes; candidates are evaluated after mapping back to the original network.
- A shared elite pool exchanges candidates between domains, with cardinality repair when some selected nodes are absent in the receiving domain.
- The same multimodal model processes multiple layouts, and a consensus mechanism combines the proposed node selections.
- The paper specifies initialization, crossover and removal/addition mutation prompts, evaluates layout-sensitive initialization separately, and adds three small problem demonstrations. These modules and demonstrations have different experimental protocols.

## Methodology

### Objective and restricted search domains

The main task selects k influence seeds. Fitness is the **expected diffusion value, a one-hop proxy**: `k + sum_{b in N(S) outside S} [1-(1-p)^delta(b)]`, where delta counts selected neighbors and p=.1 in the release. This is not Monte Carlo estimation of the complete independent-cascade process and does not certify maximum eventual spread. [Section3.1.](https://proceedings.neurips.cc/paper_files/paper/2025/file/0cda0892c74edef6bc73e46a4480511f-Paper-Conference.pdf#page=3)

Degree sparsification retains high-degree nodes. Community sparsification uses Fast Greedy communities and allocates retained nodes proportionally, favoring betweenness within communities. The induced graph is capped by randomly removing excess edges; isolates are removed and the largest connected component is retained. Consequently,50 nodes/100 edges are **target visualization budgets**, not a guarantee that every final domain has exactly that size. Candidates are restricted to retained nodes, but their mapped fitness is evaluated on the original full graph. This differs from optimizing only the small induced graph, while still excluding potentially useful original nodes from the candidate domain. [Sections3.2–3.3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/0cda0892c74edef6bc73e46a4480511f-Paper-Conference.pdf#page=4)

Each domain evolves a population. A timestamped master pool retains strong candidates, removes old entries and periodically injects elite solutions into another domain. Projection intersects selected original node IDs with the receiving domain and fills missing positions; default filling favors high betweenness. Re-evaluated candidates replace weaker residents. This is a heuristic transfer/repair mechanism, not a quality-preserving projection theorem. The distributed release uses two populations of10,10 generations, injection every2 generations, elite age5 and pool cap3; the paper also compares transfer intervals2/5. [Section3.3/AppendixA.3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/0cda0892c74edef6bc73e46a4480511f-Paper-Conference.pdf#page=5)

### Images, model and operators

Kamada–Kawai, Fruchterman–Reingold and GraphOpt render different views of the same graph. Crossover shows two parent selections; mutation shows selected versus unselected nodes and asks first for a removal, then an addition. The model is **gpt-4o-2024-11-20**, reused without task-specific weight training. Layout voting combines calls to the same model, rather than ensembling independently trained neural checkpoints. The current voting implementation first retains unanimous selections, then uses candidate frequency and uncovered-neighbor coverage to fill the required size. Thus classical heuristics contribute to the final node set. [Section3.4/Figures2–3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/0cda0892c74edef6bc73e46a4480511f-Paper-Conference.pdf#page=6)

The initialization module directly requests a complete seed set, and Figure6 studies its fitness under layouts/sparsification. It is a real proposed neural constructor. However, the main operator comparisons use matched starting populations, and the released entry points initialize from random populations. Evidence for separately good initialization is not evidence for a jointly benchmarked complete two-stage pipeline. The catalogue therefore retains **improvement** for the principal evolutionary solver, while recording initialization explicitly.

### Four problem branches

The frozen backbone also handles network immunization, network dismantling and TSP, supporting **generalist** scope at the pretrained-model level. This is not one learned task-conditioned policy trained jointly on four problems. Immunization selects k nodes to maximize the number of cut edges between selected and remaining nodes; it does not evaluate epidemic trajectories. Dismantling greedily removes nodes to reduce the largest connected component and uses layout consensus **without evolutionary optimization**. TSP uses city coordinates, an image and a textual visit order; it requires a complete permutation and does not use multi-layout ensembling or node sparsification. [Section4.4/AppendixD.](https://proceedings.neurips.cc/paper_files/paper/2025/file/0cda0892c74edef6bc73e46a4480511f-Paper-Conference.pdf#page=10)

## Experiments

### Influence maximization

Eight original graphs range from USAir332 nodes/2,126 edges to Texas8436,365 nodes/1,590,651 edges. Graphs are sparsified for visual search but scored on their original topology. Defaults include population20, k=10, crossover probability.2 and mutation probability.1, usually10 independent runs; transfer/filling studies use30. The cooperative comparison divides the population into two halves to match the total population, which does not by itself match multimodal API queries. [Tables1–3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/0cda0892c74edef6bc73e46a4480511f-Paper-Conference.pdf#page=7)

CoMLLM with KK obtains average rank1.38 in Table2 but is not best on every graph: USAir45.3 is below CoeCo48.9, and Polblogs207.4 is below CoeCo223.5. The community-domain layout ensemble has average rank1.13 in Table4; on Netscience, FR15.0 exceeds ensemble14.9, with the reported difference not significant. Wilcoxon symbols use a95% significance level relative to the designated comparison; table dispersions are standard deviations, whereas shaded learning curves show standard errors of the mean. They are not interchangeable confidence intervals. [Tables2/4 and Figures4–5.](https://proceedings.neurips.cc/paper_files/paper/2025/file/0cda0892c74edef6bc73e46a4480511f-Paper-Conference.pdf#page=9)

Frequent elite exchange generally helps, but not every mean changes. Betweenness filling slightly exceeds random filling across the eight reported means. These are component-level empirical results, not guarantees that any image ensemble or domain transfer improves any instance.

### Additional tasks and costs

Dismantling uses Dolphins62 and Lesmis77 without sparsification and removes up to25% of nodes. Ensemble LCC-curve AUCs are712.1/488.8, compared with the best single-view714.6/494.6; lower is better. Immunization curves on the same small networks favor the ensemble under the cut-edge objective. TSP demonstrations contain only15/20 cities and compare evolutionary fitness curves, without a large-instance benchmark or reported optimality-gap table. [Figures7–8/14.](https://proceedings.neurips.cc/paper_files/paper/2025/file/0cda0892c74edef6bc73e46a4480511f-Paper-Conference.pdf#page=20)

AppendixB reports GPT-4o crossover latency around3.4–3.6 seconds and mutation latency2.3–2.4 seconds **per API call**. Mutation requires removal and addition calls, and each layout adds calls. These numbers are not whole-run times, dollar budgets or matched-compute rankings. Initialization latency grows with graph/seed-set size. Fixed-resolution token-count plots concern400×400/768×768 images; the described plotting setup uses1200×1200 canvases,35-pixel nodes and22-pixel labels. Token constancy should not be read as size-independent perceptual accuracy. [AppendixB/D.](https://proceedings.neurips.cc/paper_files/paper/2025/file/0cda0892c74edef6bc73e46a4480511f-Paper-Conference.pdf#page=15)

## Limitations

Visual clutter beyond roughly200 displayed nodes, large selected sets, layout sensitivity, API variability and restricted candidate pools limit scaling. TSP cannot discard cities; a proposed divide-and-conquer remedy is future work. Full-network scoring does not remove the search restriction imposed by sparsification.

Output feasibility requires validation/repair. Despite prose claiming100% valid-node/cardinality accuracy, Tables7–8 contain99.9% and99.5% entries. The low-degree-node check is a heuristic preference, not a feasibility or optimality certificate. Mutation can propose duplicates, and the total retry/repair overhead is not fully budgeted. [AppendicesA–C.](https://proceedings.neurips.cc/paper_files/paper/2025/file/0cda0892c74edef6bc73e46a4480511f-Paper-Conference.pdf#page=17)

The current official release has an independently checked **shared mutable list issue**: each layout mutation modifies the same input candidate in place, so stored layout outputs can all alias the final list. A deterministic no-network execution of the actual functions yields three identical object references, rather than independent layout proposals. The no-crossover branch can return a parent list directly, allowing subsequent mutation to alter a parent/retained elite without immediately recomputing its cached fitness. This is a reproducibility concern in the retrieved release, not proof that all published experiments used that behavior or that their reported conclusions are false.

## Reproducibility

- Formal source: NeurIPS2025 proceedings,29 pages including AppendicesA–E/checklist, read completely. The publisher records electronic publication on2026-04-23; arXiv2510.21906v1 was posted2025-10-24. These dates describe different events.
- [Official public OSF project](https://osf.io/hymgp/overview?view_only=f37dfac5aed44ba8a00d2f9213a0e7d6) is linked by the authors. Its public storage contains one `code.zip`; SHA256 `10179f1f127f5941b5df9a6987e64146e51974381d3f44072508902c0feca6b2` matches the published file hash. All29 members were inventoried, all scientific documentation and four example images inspected, and the six Python files checked. No extra scientific PDF was present. The publisher lists the paper only; the OpenReview API returned403, which is recorded without claiming to inspect unavailable attachments.
- `Readme.docx` describes normal/MLLM/ensemble modes and matched initial populations. `EVC.py` defaults to classical mode and loads random populations; `Distributed.py` implements classical cooperative evolution. The archive supplies Facebook data/precomputed artifacts, not a complete executable configuration for every eight-graph/multitask table. An initialization API function exists, but is not called by these main entry points.
- The implementation uses network-accessible model calls and structured node lists; no model API was invoked during this review. Only the isolated list-alias behavior was reproduced. No complete optimization benchmark was rerun, and quoted costs/results remain the paper's measurements.
- Full in-text references and all49 bibliography entries were checked against the frozen catalogue; no matching internal paper identity was established. Related visual/LLM algorithm-design papers are distinct works and are not forced onto this record.
