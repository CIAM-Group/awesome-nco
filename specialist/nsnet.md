---
id: nsnet
short_title: NSNet
title: 'NSNet: A General Neural Probabilistic Framework for Satisfiability Problems'
authors:
- Zhaoyu Li
- Xujie Si
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/a40462acc6959034c6aa6dfb8e696415-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/a40462acc6959034c6aa6dfb8e696415-Abstract-Conference.html
institutions:
- McGill University
- Mila
- CIFAR
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Satisfiability
problems:
- Boolean Satisfiability
- Model Counting
summary: BP-inspired edge inference learns SAT marginals for local-search initialization and separately learns approximate
  log model counts.
code_url: https://github.com/zhaoyu-li/NSNet
---

# NSNet: A General Neural Probabilistic Framework for Satisfiability Problems

> **TL;DR:** NSNet learns BP-inspired edge messages for either satisfying-assignment marginals or approximate log model counts. SAT uses rounded marginals followed by Sparrow local search; #SAT uses a separately trained Bethe-style readout without a PAC counting guarantee.

## Motivation

Supervising one arbitrarily chosen satisfying assignment ignores alternative valid solutions. NSNet instead learns each variable's marginal under the uniform distribution over satisfying assignments, and reuses its inference architecture for approximate counting. This probability distribution requires a satisfiable formula: UNSAT certification is explicitly outside the paper's scope (Sections1-3/6).

## Contributions

- A CNF graph has two assignment nodes per variable, clause nodes, and satisfying/dissatisfying edge types; latent states live on directed edges.
- Sum and log-sum-exp message aggregation mirrors belief propagation, with learned transformations and paired-assignment normalization modules.
- Exact-enumeration marginal supervision supports one-shot local-search initialization, while exact-count supervision trains a separate approximate model counter.
- Experiments compare initialization quality, bounded-flip local search and log-count accuracy/runtime, including informative negative counting results.

## Methodology

**Architecture and theory.** Messages from a variable assignment to a clause sum incoming messages from other clauses and combine the result with that variable's opposite-assignment message. Clause-to-assignment updates enumerate compatible local assignments, sum their incoming messages and use log-sum-exp. All edges share learned initial vectors/modules. Proposition1 recovers BP at dimension one when the abstract modules are set to identity and exact log normalization; this is a special-case operator statement, not convergence or accuracy of the trained finite ReLU MLP implementation. Proposition2 establishes equivariance under variable/clause reindexing and global polarity reversal of a variable through shared modules and symmetric aggregation, not correctness on every CNF (Section3.2; supplementA.1).

**SAT.** Read out two probabilities per variable and train KL divergence against true marginals, computed by enumerating all solutions with bdd_minisat_all. Independent rounding can violate clauses even with perfect marginals, so a single model call initializes Sparrow, which performs stochastic flips. A found satisfying assignment can be checked, but failure within the budget does not prove UNSAT. The decimation alternative in supplementA.2 would need accurate conditional marginals after each simplification and repeated model calls; it is not the benchmarked one-call hybrid (Section3.3).

**Counting.** Train MSE against exact log counts from DSharp. Variable/factor readouts enter a Bethe-entropy expression to estimate log Z. Equation9 writes a log-normalized factor belief while Equation10 uses probability notation; the release correctly forms entropy as exp(log_b)*log_b. Learned local beliefs need not provide an exact globally consistent joint distribution, and this readout is not an exact count, lower/upper bound or PAC estimator (Section3.4).

**Resources and training.** Feature dimension64, ten message-passing rounds, three-hidden-layer64-unit ReLU MLPs, Adam1e-4, weight decay1e-10, gradient clipping0.65 and batch128 are specified. Synthetic SAT training uses200 epochs; BIRD/SATLIB counting uses1,000. Models/checkpoints differ by task/dataset; a common architecture is not an unchanged SAT/#SAT checkpoint. Experiments use one A100 GPU and eight CPU cores. Local clause assignment enumeration also scales exponentially with clause width; synthetic SR explicitly caps width at four, so large variable counts alone do not establish scalability to arbitrarily wide clauses (Section4; supplementB.1-B.2; inspected preprocessing).

## Experiments

**SAT data and metrics.** SR, random3-SAT and Community Attachment each supply50,000 satisfiable formulas with10-40 variables, split60/20/20. Another10,000 per distribution have40-200 variables. UNSAT examples are discarded, and complete solution enumeration supplies labels. At ten rounds, marginal NSNet's rounded assignments solve60.99% of same-size and9.76% of larger instances, versus BP45.84%/6.58% and retrained marginal NeuroSAT49.11%/3.59%. These are feasible-assignment success rates, not SAT/UNSAT classification accuracy or the original NeuroSAT training protocol (Section4.1/Table1).

At more rounds, the aggregate marginal NSNet success grows35.38% to42.97% from ten to500 rounds; assignment-supervised NSNet instead falls26.59% to21.78%. More message passing is thus not universally helpful across objectives. With100 allowed Sparrow flips, NSNet initialization solves51.01±0.11% of larger instances versus random24.83±0.08%, BP49.32±0.11% and NeuroSAT44.90±0.18%, over ten runs. Mean flips15.53 versus57.55 for random are measured **only among each method's solved instances**, so those averages have different instance subsets (Tables2-3; supplementTable5).

**Counting datasets/reference filtering.** BIRD has eight application categories, split70/30, with257 test instances overall and some formulas above10,000 variables/clauses. SATLIB has46,200 satisfiable100-600-variable formulas from five distributions, split60/20/20. Instances for which exact DSharp labeling exceeds5,000 seconds are excluded. This conditions the benchmarks on exact-label availability (Section4.2).

**Accuracy/time tradeoff.** BIRD NSNet log-count RMSE is0.94, better than the shown BPNN/F2 totals but far worse than ApproxMC3's0.03. NSNet processes all257 test formulas as a GPU batch in4.83s, about0.02s amortized per formula, whereas ApproxMC3 averages123.33s over224 completed instances and times out on33 at5,000s. The advertised thousand-fold speed comparison preserves GPU-batched versus CPU sequential execution, substantially different accuracy and omitted offline training/labeling (Figure3).

SATLIB RMSE/time are NSNet1.71/<0.01s, F2 2.36/27.79s and ApproxMC3 0.05/13.05s. NSNet is worse than F2 on BMS,2.45 versus2.42, despite better aggregate error. SupplementTable6's caption says BIRD but its five category columns/data are SATLIB. The supplementary less-than2% relative error concerns **log counts**, not relative error of raw counts: an absolute log error d corresponds to multiplicative count error exp(d). Relaxing ApproxMC3's PAC parameters still leaves it much more accurate, RMSE0.23 at the loosest shown setting, while taking22.45s on its completed subset (Table4; supplementB.3/Tables6-7).

ApproxMC3/F2 timings use the minimum of runs with and without independent-support preprocessing, including preprocessing in the former. This best-of-two timing rule and5,000s timeouts should accompany comparisons. The neural method gives a number for every formula but does not thereby certify a valid model count or match ApproxMC3's statistical guarantees.

## Limitations

### Discussed in the Paper

The probabilistic formulation does not apply to UNSAT instances. Exact marginal/count labels can be expensive. The authors explicitly leave guarantees on estimated marginals/counts to future work. Repeated neural calls for decimation/backtracking would cost more than the chosen one-call local-search initialization (Section6; supplementA.2).

### Curator Notes

Architecture symmetries and a BP special case are not optimization or approximation guarantees. Independent marginals cannot encode all solution correlations; local search remains essential for many instances. Counting quality depends on distribution, clause width and label filtering, and log-RMSE cannot be interpreted as a raw-count tolerance. Although benchmarks contain CNF encodings of graph coloring, the experiments learn SAT marginals or formula counts with separate objectives/models; they do not demonstrate a shared optimization model across distinct native tasks. The repository therefore keeps this entry specialist.

The release confirms edge-message/LSE preprocessing, normalized belief entropy, marginal/counting task switches, ten-run100-flip scripts and separate checkpoint locations. External solver submodules/data generation are required. No training, solver compilation or benchmark rerun was performed.

## Reproducibility

- **Publication:** [NeurIPS2022 proceedings](https://proceedings.neurips.cc/paper_files/paper/2022/hash/a40462acc6959034c6aa6dfb8e696415-Abstract-Conference.html). Official HTML publication metadata gives December6,2022. Two authors, McGill/Mila affiliations and Si's CIFAR AI Research Chair are checked against the PDF.
- **Scientific coverage:** all thirteen [main PDF](https://proceedings.neurips.cc/paper_files/paper/2022/file/a40462acc6959034c6aa6dfb8e696415-Paper-Conference.pdf) pages including the complete references/checklist, and all four [publisher supplement](https://proceedings.neurips.cc/paper_files/paper/2022/file/a40462acc6959034c6aa6dfb8e696415-Supplemental-Conference.pdf) pages (printed pages14-17), proofs, training details and additional counting tables/plots. Publisher links manually checked; no extra scientific PDF was identified in the complete author archive inventory.
- **Implementation:** [official NSNet](https://github.com/zhaoyu-li/NSNet). README, model/Bethe readout, preprocessing, train/test interfaces and SAT/counting shell scripts inspected; external solvers/submodules are documented prerequisites.
- **Relations:** four current-catalogue works have exact explicit body/reference matches: Circuit-SAT[2], NeuroSAT[35], Graph-Q-SAT[25] and learned SAT local search[45]. Other named neural SAT/counting references are distinct works absent from the current catalogue.
