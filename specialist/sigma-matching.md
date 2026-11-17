---
id: sigma-matching
short_title: SIGMA
title: Stochastic Iterative Graph Matching
authors:
- Linfeng Liu
- Michael C. Hughes
- Soha Hassoun
- Li-Ping Liu
year: 2021
date: '2021-07-01'
publication:
  date: '2021-07-01'
  source_url: https://proceedings.mlr.press/v139/liu21i.html
venue: ICML
paper_url: https://proceedings.mlr.press/v139/liu21i.html
institutions:
- Tufts University
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Graph Matching
problems:
- Graph Matching
- Partial Graph Matching
summary: Stochastic partial-matching distributions with dummy nodes and sampled iterative refinement improve several
  graph-correspondence tasks under separate training protocols.
code_url: https://github.com/tufts-ml/sigma
---

# Stochastic Iterative Graph Matching

> **TL;DR:** SIGMA learns stochastic partial-matching scores with dummy nodes and sampled iterative refinement; separate graph, molecule and image models improve several correspondence metrics, with meaningful exceptions and approximate optimization.

## Motivation

A one-shot graph neural network can make matching errors, and some nodes have no valid counterpart. SIGMA learns a distribution of partial correspondences, allowing exploration and revision while dummy nodes accommodate unmatched entities. This addresses learned graph matching, rather than establishing exact optimization for every underlying QAP (Sections 1-3).

## Contributions

- Parameterize a distribution of partial matchings through a larger permutation problem and Gumbel-Sinkhorn relaxation.
- Reuse a graph encoder to propose successive matching-score distributions, reweighting node features by estimated probabilities of having a real counterpart.
- Evaluate stochasticity, iterative refinement and dummy handling on noisy graph alignment, reaction-pattern matching and visual keypoint correspondence.

## Methodology

**Partial assignment and objective.** Real-node correspondences form a binary subpermutation; unmatched nodes map to an aggregate dummy. GNN node embeddings define a source-target score matrix by inner products. Scores occupy the real-real block of a larger (source size + target size) square matrix, whose other blocks have zero scores. The training objective combines a task-specific quadratic/structural reward with available supervised correspondence terms; ground-truth terms are excluded from test-time refinement (Sections 3-4/Equations 1-9/15).

**Stochastic training.** Add independent Gumbel noise to scores and apply finite-temperature Sinkhorn normalization. The resulting continuous approximate permutation samples support low-variance but biased reparameterized gradients; they are not exact samples of the discrete Gibbs distribution merely because temperature is finite or normalization is iterated. Collapsing dummy rows/columns leaves real-real probabilities for feature reweighting and reward computation (Sections 4.1-4.2).

**Refinement.** Average samples to estimate each node's probability of matching a real node, multiply node features by these weights, and run the shared encoder again. Candidate distributions are retained when their estimated expected reward improves. Gradients do not propagate through the previous iteration's retained parameters. The main setting uses one initial prediction plus four refinements and ten samples. Exact expectation comparisons would preserve the chosen expected objective, but finite Monte Carlo comparisons do not guarantee improvement of its true expectation, the decoded solution, correspondence accuracy or global QAP value (Algorithm 1/Equations 10-14).

**Decoding boundary.** The published decoder maximizes linear score with Hungarian on the enlarged problem, then discards dummy assignments. This exact linear-assignment substep is not a global quadratic optimum. Moreover, the defined matching distribution sums over all dummy-label permutations: different partial matchings have different multiplicities, so maximizing one permutation's score need not compute the mode of the collapsed matching distribution. The paper's MAP terminology should therefore be interpreted cautiously rather than promoted to an exact marginal-MAP result (Equations 6-8/16-17).

## Experiments

**Common graph alignment.** BA graphs have 500/1,000/2,000 nodes, and yeast PPI has 1,004 nodes/4,920 edges; targets receive 5% additional noisy edges, with clean cases also tested. Degree features and a five-layer GIN with hidden width 256 are optimized for 100 epochs; the official PPI demo trains on the particular pair it then evaluates. This differs from a held-out amortized solver benchmark. With noise, SIGMA node correctness is 93.8/97.3/99.0% on BA and 84.7% on PPI versus S-GWL 32.0/22.9/16.2/81.1%. Clean BA/PPI reach 99.2%, below MCSPLIT's 100% (Section 5.1/Tables 1-2).

**Runtime is not uniformly best.** Table 1 lists seconds in parentheses: noisy BA500 SIGMA/S-GWL is 11/3, BA1000 33/14, BA2000 179/129 and PPI 67/50. SIGMA is slower than S-GWL in those settings, though much faster than the 1,000-second MCSPLIT limit on noisy instances. Experiments use a 32-core server with an A100 40GB GPU. The table does not clearly separate training from inference/preprocessing costs, so the note does not reinterpret those numbers as a certified deployment-time speedup.

**Biochemistry.** KEGG RPAIR supplies 10,366 reactant pairs split 8:1:1, averaging 23 nodes/48 edges. A separate three-layer RGCN uses atom/bond types and fifty Laplacian-eigenvector positional features, trained for thirty epochs. Hard match requires the full RDM pattern; soft match measures its matched fraction; node correctness is different again. SIGMA scores 58.0/78.2/78.3% versus DGMC 37.3/66.0/66.9. Unsupervised SIGMAU scores 39.5/63.1/66.2, below DGMC in soft match and node correctness. Ground-truth supervision, rather than architecture alone, contributes to the gain (Section 5.2/Table 3).

**Visual correspondence.** The main Pascal protocol filters to 6,953 training/1,671 test images, removes difficult/occluded/truncated objects, and uses ImageNet-pretrained VGG16 keypoint features plus a separate two-layer SplineCNN. Mean Hits@1 is 76.2% versus DGMC/DGMC* 73.0 and CIE 68.9: 3.2 and 7.3 percentage-point improvements, not equivalent relative percentages. Negative categories include bird 57.8 versus CIE 70.1, table 90.4 versus DGMC* 92.4, and plant 96.7 versus DGMC 98.0. Removing dummies gives a higher mean 76.5, and no refinement gives 76.0, so all three components are not uniformly beneficial in every task (Section 5.3/Table 4).

**Distinct BBGM protocol.** A separate experiment fine-tunes VGG16 and uses its global features for weighted affinity, following BBGM. Here SIGMA reaches 81.2 versus 80.1% on Pascal and 79.8 versus 78.9% on SPair-71k. These values must not be merged with the frozen-feature 76.2% table as if they shared one protocol. Table 1-3/5 uncertainty is reported as printed, without inventing an unspecified seed-count interpretation (Table 5).

## Limitations

### Discussed in the Paper

GNNs may fail to distinguish symmetric nodes, explaining imperfect clean-graph correspondence. Stochasticity and refinement contribute little in some common-graph/visual settings. Unsupervised performance depends on whether the chosen QAP reward captures the desired correspondence. Higher-order matching and matching outside graphs are proposed directions, not demonstrated shared-model capabilities (Sections 5-6).

### Curator Notes

The noisy best-distribution selection is not a guarantee that the final discrete match is never worse. The enlarged soft matrix uses quadratic storage in the sum of graph sizes, while exact Hungarian decoding adds a non-neural optimization step; benchmarks stop at the reported graph scales. Separate GIN/RGCN/SplineCNN architectures and task training establish specialist graph matching, not one unchanged network across unrelated native optimization tasks.

There is a dummy-cell notation inconsistency: Equation 1 fixes the bottom-right aggregate entry to zero, whereas the block collapse M=BSC generally puts dummy-to-dummy mass there. The real-real block and unmatched real-node margins still have the intended interpretation; the unused bottom-right cell needs an explicit convention.

**Code versus printed procedure.** The current public models accumulate gradients only for accepted record-improving steps, whereas the text sums all proposal-step objectives. The image implementation returns a noise-free soft Sinkhorn matrix and computes row-wise argmax Hits@1, rather than running the general Hungarian decoder for that table; this metric alone does not enforce a one-to-one final match. Its default dropout is zero versus the paper's 0.5. The common demo also adds an optional mismatch penalty and scales cosine scores by fifty. These differences should be tracked when attempting exact numerical reproduction, without assuming the present code is the historical run configuration.

## Reproducibility

- **Publication:** [PMLR ICML 2021 record](https://proceedings.mlr.press/v139/liu21i.html), pp. 6815-6825. The PDF spells the last author's name Li-Ping Liu and includes Michael C. Hughes's punctuation, retained here; publisher metadata flattens the former to Liping. Tufts CS and Chemical/Biological Engineering affiliations match. The [publisher source](https://raw.githubusercontent.com/mlresearch/v139/gh-pages/_posts/2021-07-01-liu21i.md) explicitly gives issued date 2021-07-01.
- **Reading/supplements:** all eleven publisher pages, including the complete bibliography, all result tables, objective/refinement formulas and diagrams. Manual publisher Related Material/source extras inspection shows only the main PDF; no separate scientific attachment appears in the author repository's recursive inventory or coauthor listing.
- **Code/data:** [official Tufts SIGMA repository](https://github.com/tufts-ml/sigma), linked as software by the [coauthor](https://www.cs.tufts.edu/~soha/), provides three experiment implementations and a PPI example. README specifies PyTorch 1.7.1/PyG 1.6.3/SciPy 1.5.4. The purchased KEGG RPAIR dataset is not publicly redistributed, which limits exact reproduction. Core samplers, reward/selection, training and decoding were inspected; training was not rerun.
- **Citation graph:** explicit CIE-H, DGMC and Gumbel-Sinkhorn citations match their existing catalogue IDs. Similar graph matching/Sinkhorn titles do not imply additional edges without exact catalogue identity.
