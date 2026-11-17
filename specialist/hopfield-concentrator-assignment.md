---
id: hopfield-concentrator-assignment
short_title: Concentrator Assignment NN
title: A Neural-Network Solution to the Concentrator Assignment Problem
authors:
- Gene A. Tagliarini
- Edward W. Page
year: 1987
date: '1987'
publication:
  date: '1987'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1987/hash/77cdf4ffbd2afd02541e02533ec56820-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/1987/hash/77cdf4ffbd2afd02541e02533ec56820-Abstract.html
institutions:
- Clemson University
scope: specialist
paper_type: solver
paradigm: neurodynamic
problem_families:
- Assignment
- Resource Allocation
problems:
- Concentrator Assignment
summary: A hand-parameterized Hopfield network uses site-assignment and capacity-slack neurons; 100 simulations
  of one small instance reject costly assignments but never reach its global optimum.
figure:
  path: paper-assets/hopfield-concentrator-assignment/framework.png
  alt: Original concentrator-assignment neuron array with site rows and capacity slack rows.
  caption: 'Figure 4: Site-assignment neurons and per-concentrator slack neurons.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1987/file/77cdf4ffbd2afd02541e02533ec56820-Paper.pdf#page=4
---

# A Neural-Network Solution to the Concentrator Assignment Problem

> **TL;DR:** A Hopfield-style analog network encodes a capacitated site-to-concentrator assignment. Its hand-designed dynamics produce good solution ranks on one small example, without finding the optimum or learning a policy from a training dataset.

## Motivation

Sites need access to a communications backbone through concentrators with limited capacity. Each site must choose exactly one concentrator, and total connection cost should be small. The paper explores representing this discrete assignment as the stable state of an analog neural circuit, drawing on earlier Hopfield optimization networks (PDF pp. 1-3).

## Contributions

- Gives one neuron per possible site/concentrator assignment and additional slack neurons for unused capacity.
- Designs recurrent connections and external currents from assignment, capacity and near-binary-output requirements, then biases connections toward lower-cost assignments.
- Compares 100 network simulations on one small instance with an exhaustive enumeration of that instance's assignment costs.

## Methodology

**Representation.** The upper array has n site rows and m concentrator columns. An active neuron indicates assigning that site to that concentrator. Column j additionally has `k_j` slack neurons, allowing the assignment-plus-slack column sum to equal capacity while real site assignments remain at most that capacity. The formulation allows different capacities, but the reported example uses equal capacities and sufficient total capacity (PDF pp. 3-4).

**Energy and connection design.** Equation 3 contains a squared one-assignment-per-site term, a squared assignment-plus-slack column-capacity term and a `V*(1-V)` term favoring outputs near zero or one. It initially expresses constraint preferences, without assignment cost. Cost is subsequently introduced through a symmetric pairwise coupling adjustment proportional to `D/(cost[i,j]+cost[k,l])` for different site rows in the same concentrator column. This is not simply the original linear assignment objective added verbatim to Equation 3. External currents differ for site and slack neurons (PDF pp. 5-6).

The network uses sigmoid analog outputs, symmetric connections and no self-connections, following the cited Hopfield local-energy interpretation. Parameters are constructed from the instance rather than learned across a distribution. The example reports inhibitory constants `A=B=C=-2`, cost-bias constant `D=0.1`, site currents 6 and slack currents 5. These are printed connection-setting conventions; the same letters also occur in the preceding energy display, so reproductions should resolve the energy/coupling sign convention rather than substitute the negative values blindly into positive squared penalties (PDF pp. 2, 5-7).

## Experiments

The study uses one randomly generated unit-square map with 12 sites, five concentrators and capacity three per concentrator. Figure 5 gives its assignment cost matrix and a representative assignment, which leaves concentrator 2 unused. This is an observation about that solution, not an optimized facility-opening-cost model (PDF pp. 6-7).

An exhaustive backtracking search supplies the distribution of assignment costs. In 100 consecutive network simulation runs, no global optimum is found. Ninety-two returned assignments fall among the best 0.01% of the enumerated solutions; the remaining eight fall among the best 0.3%. These percentages describe ranks within the solution distribution, not relative objective gaps of 0.01% or 0.3% to the optimum. Figures 6-7 compare the exhaustive and neural cost histograms (PDF pp. 7-8).

No multi-instance benchmark, training/test split, runtime comparison, hardware speedup, statistical error bar or proof of global optimization is reported. The results support rejection of many poor assignments on this particular instance.

## Limitations

The authors explicitly state that the network finds good but not necessarily optimal assignments, and acknowledge that the example never reaches the global minimum. The paper does not establish a general approximation factor, feasibility rate over diverse instances or scaling result.

**Curator interpretation.** The displayed problem has fixed concentrator locations, unit-count capacities and a linear assignment cost, without fixed opening costs or unequal per-site resource consumption. That formulation is a capacitated bipartite assignment/min-cost-flow problem; its exponentially many possible assignments do not establish NP-hardness. It should not be conflated with a general NP-hard facility-location model. The historical warehouse-location terminology is retained as context while the problem-family label identifies the actual assignment formulation.

The method is specialist and neurodynamic: solving an instance changes network states under hand-designed couplings. There is no trained cross-instance policy or shared multi-task checkpoint. Numerical integration, initialization and stopping tolerances are not specified sufficiently for a modern exact reproduction from the article alone.

## Reproducibility

- **Complete reading:** all eight official scanned PDF pages, printed pages 775-782, including all seven references. The neuron array, energy/coupling equations, example cost matrix and both histograms were visually checked to avoid relying on OCR errors.
- **Publication provenance:** the official proceedings landing and BibTeX identify volume 0, NIPS 1987 and the American Institute of Physics. The scanned first page prints a 1988 copyright. Metadata follows the official proceedings' 1987 year and discloses this distinction; no unsupported acceptance day or exact publication day is inferred.
- **Supplement check:** the official landing offers the paper, bibliography and metadata only; the scanned paper has no separate appendix or scientific attachment reference. No additional scientific supplement was identified.
- **Code/data:** the article provides a cost matrix and simulation constants but no software repository, downloadable checkpoint or complete simulator specification. This review did not implement the dynamics or rerun the 100 simulations.
- **Relations:** all references were checked. None identify another paper in the frozen 364-entry collection; an empty outgoing citation list is retained.
