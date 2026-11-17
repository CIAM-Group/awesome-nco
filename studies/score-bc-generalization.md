---
id: score-bc-generalization
short_title: Score-B&C Generalization
title: Generalization Guarantees for Learning Score-Based Branch-and-Cut Policies in Integer Programming
authors:
- Hongyu Cheng
- Amitabh Basu
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/ac04e54e0a2d1927d60709019e4e7870-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/ac04e54e0a2d1927d60709019e4e7870-Abstract-Conference.html
institutions:
- Johns Hopkins University
scope: study
paper_type: theory
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: Structured score functions yield sample-complexity bounds for deterministic, finite-horizon branch-and-cut
  policies, with a fixed-policy packing experiment.
code_url: https://github.com/Hongyu-Cheng/MLP4ScoreBnC
---

# Generalization Guarantees for Learning Score-Based Branch-and-Cut Policies in Integer Programming

> **TL;DR:** Piecewise-polynomial node, cut and branching scores induce a piecewise-constant downstream cost over policy parameters. This enables generalization bounds for a capped, deterministic decision process; a small experiment studies sampling gaps for one fixed cut policy.

## Motivation

The quality of a branching, cut or node-selection score is ultimately measured through its effect on the search, rather than prediction loss alone. Earlier learning-theoretic analysis largely treated linear scoring rules, while modern policies often use neural networks. The paper asks how the complexity of nonlinear score functions controls generalization of the resulting search cost (PDF pp. 1–5).

## Contributions

A general finite-horizon sequential-decision model covers several action types with separate score parameters, fixed feature extractors, deterministic transitions and consistent tie breaking. Theorem 3.3 shows that structured piecewise-polynomial scores imply piecewise-constant total cost over parameter regions. This yields pseudo-dimension bounds for linear and suitable neural scoring functions, and a data-dependent Rademacher bound (pp. 6–8).

The B&C applications distinguish learning root cut selection from simultaneously learning node, cut and branching policies. The main contribution is statistical theory; the empirical policy illustrates sampling-gap behavior and is not presented as a new state-of-the-art MILP solver.

## Methodology

Algorithm 2 runs at most M rounds with d action types and at most rho_k available actions of each type. Scores are functions of a state–action pair and parameters; actions maximize the score with lexicographic tie breaking. Parameter values influence the deterministic state trajectory through selected actions. The accumulated penalty must be bounded in [0, H] for the statistical guarantees (pp. 4, 6–7).

The structural assumption controls a **collection** of score functions evaluated at different state–action pairs: N such functions admit at most Gamma × N^gamma parameter regions on which each is polynomial of degree at most beta. The proof partitions scores, then pairwise action comparisons, so that a fixed region yields the same trajectory and total cost. It must count all relevant reachable states across policies, rather than only one realized trajectory (pp. 6–8, 14–21).

For linear scores, the reported pseudo-dimension order is O(WM sum_k log rho_k), removing an additive W log W term from the cited earlier bound. For ReLU MLPs, it is O((sum_k L_k W_k) × (M sum_k log rho_k + log(sum_k U_k))), where L_k, W_k and U_k describe the respective networks. A bounded-cost uniform-convergence guarantee then scales as H times the square root of [pseudo-dimension + log(1/delta)]/N (pp. 4, 7–8).

The Rademacher analysis can replace a worst-case branching envelope with instance-specific counts Q_M,k of reachable state–action pairs. Those counts still range over possible policy executions. Appendix C also derives an expected-complexity version; the paper does not provide an efficient procedure for computing the exact policy-wide envelope from a single solver log (pp. 8, 16–24).

Proposition 4.1 treats R root cut rounds selecting at most kappa cuts from a finite pool bounded by r, with fixed node/branching rules. Proposition 4.2 covers three learned ReLU scorers under finite action bounds. These formal settings are broader than the root-only empirical demonstration, and they do not include unrestricted infinite action families or stochastic transitions (pp. 9–10).

## Experiments

Section 5 trains an MLP to imitate normalized LP objective improvement, then holds its parameters fixed for evaluation. Its two inputs are cut efficacy and objective parallelism; it has two hidden layers of ten ReLU units and a clipped-ReLU scalar output. It selects the ten highest-scoring cuts at the root of packing instances with 10 constraints/20 variables or 15 constraints/30 variables (p. 9).

For N from 1 to 100, the experiment measures the **absolute difference** between mean tree sizes on two N-instance sets and averages over 30 trials. The fitted curve a/sqrt(N) + b has R² values 0.951 and 0.959, with displayed 95% confidence intervals. This is evidence consistent with sampling-gap decay for that fixed policy and these distributions; it does not empirically measure a supremum over policies or establish the numerical constants in the uniform bound (pp. 9–10).

The current author implementation adds a reproduction qualification: `test.py` repeatedly shuffles the existing training and test file pools and evaluates prefixes, rather than regenerating independent population samples on every trial. When N includes an entire fixed pool, its mean is unchanged by reordering. Those code-level sampling intervals should therefore be distinguished from uncertainty under newly generated datasets or repeated policy training.

## Limitations

### Discussed in the Paper

The framework assumes a finite round cap, uniformly bounded finite action sets, bounded costs, suitable score structure, and independent evaluation instances from the learning distribution. Policy expressivity, quality of expert labels, approximation to truly optimal strategies, structured infinite action spaces and stochastic transitions remain future work (pp. 6–10).

### Curator Notes

A uniform generalization bound does not guarantee efficient empirical optimization, expert optimality or a small worst-case MILP tree. A bound depending on an imposed horizon or cost cap also does not cover unlimited solver runtime automatically. Tree size and wall-clock runtime are different quantities, as the paper itself notes (p. 9).

The fixed-policy experiment and its fitted decay rate cannot by themselves validate the complexity of every policy in the class, the tightness of a worst-case sample bound, or a universal solver speedup. The small MLP, selected packing distributions and shared fixed checkpoint define the empirical scope; they do not constitute cross-task generalist solving.

## Reproducibility

The [NeurIPS 2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/ac04e54e0a2d1927d60709019e4e7870-Abstract-Conference.html) verify the title, two authors and publication year. All 31 pages of the [publisher PDF](https://proceedings.neurips.cc/paper_files/paper/2025/file/ac04e54e0a2d1927d60709019e4e7870-Paper-Conference.pdf) were read, including the bibliography, complete Appendices A–C and checklist. The publisher page lists no separate scientific supplement. Key structural definitions, proofs, absolute-value notation and the empirical figure were inspected visually.

The [author repository](https://github.com/Hongyu-Cheng/MLP4ScoreBnC), linked on p. 9, documents dataset/label generation, MLP training and evaluation commands. Its quickstart uses one root iteration, ten cuts and 30 runs, explicitly overriding differing script defaults. The current requirements pin PyTorch 2.9.0+cu126, NumPy 2.3.4 and PySCIPOpt 5.4.1 among other packages. The evaluation source confirms the absolute mean-gap calculation, fixed-pool shuffling, curve fitting and Student-t confidence intervals. The paper reports an Intel i7-12700F CPU and 32 GB RAM. Code and documentation were read without rerunning the experiment.
