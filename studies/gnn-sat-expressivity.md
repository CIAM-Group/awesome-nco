---
id: gnn-sat-expressivity
short_title: SAT Expressivity
title: On the Expressive Power of GNNs for Boolean Satisfiability
authors:
- Saku Peltonen
- Roger Wattenhofer
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/cd52ac59cd8ba77478d69304da1149e5-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/cd52ac59cd8ba77478d69304da1149e5-Abstract-Conference.html
institutions:
- ETH Zurich
scope: study
paper_type: theory
problem_families:
- Satisfiability
problems:
- Boolean Satisfiability
summary: WL indistinguishability gives worst-case SAT expressivity barriers, while experiments test a necessary
  condition for color-consistent satisfying assignments.
code_url: https://github.com/sakupeltonen/sat-expressivity
---

# On the Expressive Power of GNNs for Boolean Satisfiability

> **TL;DR:** For every fixed WL order there are satisfiable and unsatisfiable formulas that it cannot distinguish. The paper also studies regular, planar and specific random formula families, and tests whether WL color classes admit a satisfying assignment. Passing that test is necessary, rather than sufficient, for a WL-bounded neural predictor to succeed.

## Motivation

SAT formulas have natural graph encodings, making GNNs attractive for learned solving heuristics. But two distinct questions arise: whether the representation retains the logical information, and whether a particular GNN can distinguish the structures needed for SAT decisions or assignments. The paper separates these structural questions from computational hardness and from the ability to learn a useful solver (PDF pp. 1–5).

## Contributions

The lossless literal–clause graph with negation connections, LCN, preserves a formula up to the paper's literal-renaming/sign-flip isomorphism. In contrast, omitting negation connections can give isomorphic graphs for formulas of different satisfiability (pp. 4, 13–14).

Theorem 5.3 adapts a Cai–Fürer–Immerman construction to obtain, for a growing WL order k, 3-SAT pairs of O(k) size with opposite satisfiability and k-WL-indistinguishable LCNs. Thus no **fixed order** of the hierarchy suffices on all formulas. This does not mean one finite pair stays indistinguishable at every arbitrarily large order (pp. 6, 14–18).

Additional results establish NP-completeness of 3-regular SAT, indistinguishability of equal-size regular instances by ordinary WL, a planar 4-WL identification result under the paper's convention, and a high-probability identification result for formulas extracted from uniformly random literal-incidence graphs. None of these identification statements by itself supplies an efficient trained SAT decision rule (pp. 6–7, 19–21).

## Methodology

The LCN has literal and clause nodes, incidence edges, and separately typed edges joining each literal to its negation. Ordinary message passing is bounded by color refinement on this attributed graph. The paper explicitly notes that its k-WL naming convention is shifted relative to some graph-theory references; its planar result is stated as 4-WL (pp. 2–4).

The worst-case construction encodes parity of orientations on low-degree expander graphs. A twisted edge changes satisfiability while the associated CFI graph construction preserves indistinguishability at the chosen WL order. The partial-assignment lemma shows that, for k-WL-indistinguishable formulas and at most floor(k/2) − 1 assigned variables, an assignment on one has a corresponding assignment on the other that remains ordinary-WL indistinguishable. Here assignments are represented by truth labels on the original LCN; this is not an analysis of unrestricted clause learning, unit propagation or arbitrary solver state augmentation (pp. 6–7, 14–18).

For the empirical diagnostic, run ordinary WL for r rounds, then require all literals in each color class to have the same truth value by adding a cycle of implication clauses. An exact SAT solver checks the augmented formula. If a satisfying assignment exists, the symmetry obstruction at that round has been removed; it does not follow that a GNN learns or computes such an assignment. If the constraints remain inconsistent **after genuine WL stabilization**, an invariant, color-consistent node predictor cannot output a satisfying assignment (p. 8).

The random positive theorem concerns the particular construction from a uniformly random literal-incidence graph via a clique edge cover, with claimed probability at least 1 − n^(-1/7) for sufficiently large n. It is not a theorem for all common random k-SAT generators or all near-threshold formulas. Planar distinguishability likewise does not remove the NP-completeness of PlanarSAT (pp. 7, 20–21).

## Experiments

All evaluated source formulas are **satisfiable**. G4SATBench families include 3-SAT and encodings of clique, dominating set, vertex cover and related problems. Ordinary random 3-SAT usually passes the equality diagnostic after about three rounds; WL often stabilizes after four. A small number of clique and vertex-cover cases fail the diagnostic. The PS family is omitted because of generator problems. For very large 3-SAT instances, Appendix G changes the clause-generation multiplier from 4.258 to 4.158 to make generation feasible (pp. 8–9, 21, 24).

The competition analysis uses selected SAT Competition instances from **2020–2025**, limited to files no larger than 10 MB. The article reports that 234 of 448 evaluated instances pass the diagnostic, and 38 of 69 families contain failures; it separately reports 72 additional one-hour evaluation timeouts. These are expressivity-diagnostic counts, not neural SAT solving accuracy. “unsat” in the tables refers to the added equal-color constraints being inconsistent, not the original formula being unsatisfiable (pp. 8–9, 21–24).

For example, the evaluated circuit-multiplier group has 11 diagnostic failures, while 19 cryptography cases pass after a mean 15.74 rounds and 23 fail. These examples illustrate stronger symmetry obstructions or larger refinement depths in selected industrial/crafted instances. They are not a distribution-free comparison of solver difficulty or a trained GNN benchmark (Table 2, p. 9).

## Limitations

### Curator Notes

The bounds concern WL-bounded architectures with the specified graph features and invariant readouts. Node identifiers, randomness, additional positional features, higher-order methods whose order grows with size, or an exact solver performing extra reasoning change the setting. Worst-case indistinguishability does not exclude useful learned guidance on a restricted distribution.

The assignment experiment tests only a necessary structural condition, rather than satisfiability classification, generalizable learning or complete solving. Its selected SAT-only datasets, 10 MB competition filter, modified large-instance generator and timeouts limit the scope of empirical counts. Structural distinguishability is separate from computational tractability (pp. 8–10, 21).

A reproduction qualification concerns iteration limits. The supplied `WL_test.py` records a separate `converged` flag but can return `sat=False` when the chosen iteration cap is reached without stabilization. Such a capped unresolved case must be separated from an impossibility established at a stable partition. Several printed table entries have refinement counts of 59, but those numbers alone do not establish whether the corresponding runs actually stabilized; no missing per-instance convergence status is inferred from them.

## Reproducibility

The [ICLR 2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/cd52ac59cd8ba77478d69304da1149e5-Abstract-Conference.html) verify the title, two authors and formal year. The [24-page proceedings PDF](https://proceedings.iclr.cc/paper_files/paper/2026/file/cd52ac59cd8ba77478d69304da1149e5-Paper-Conference.pdf) was read completely, including all references, full Appendices A–G and every row of the extended results. Key graph gadgets, proof conditions, definitions and numerical tables were inspected visually. The [publisher metadata](https://proceedings.iclr.cc/paper_files/paper/2026/hash/cd52ac59cd8ba77478d69304da1149e5-Abstract-Conference.html) explicitly records `citation_publication_date` as **2026-04-20**, independently of any paper-specific acceptance date.

The publisher's [40-member supplementary ZIP](https://proceedings.iclr.cc/paper_files/paper/2026/file/cd52ac59cd8ba77478d69304da1149e5-Supplemental-Conference.zip) contains code and example CNFs without a separate scientific PDF. Its README, requirements, main driver, WL diagnostic and formula augmentation code were read. The [author repository](https://github.com/sakupeltonen/sat-expressivity), linked on p. 10, also documents the experiment and benchmark download instructions. It recommends Python 3.9 and lists NetworkX, pandas and python-sat, with python-sat pinned to 0.1.7.dev26 in the archive. Defaults are an eight-round cap and 1 MB file limit, so reproducing the larger competition experiment requires explicit settings and retaining the convergence flag. No full benchmark rerun was performed.
