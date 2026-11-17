---
id: adversarial-nco-generalization
short_title: Adversarial NCO
title: Generalization of Neural Combinatorial Solvers Through the Lens of Adversarial Robustness
authors:
- Simon Geisler
- Johanna Sommer
- Jan Schuchardt
- Aleksandar Bojchevski
- Stephan Günnemann
year: 2022
date: '2021-10-21'
publication:
  date: '2022'
  source_url: https://iclr.cc/virtual/2022/poster/7081
venue: ICLR
paper_url: https://openreview.net/forum?id=vJZ7dPIjip3
institutions:
- Technical University of Munich
- CISPA Helmholtz Center for Information Security
scope: study
paper_type: analysis
arxiv_url: https://arxiv.org/abs/2110.10942
problem_families:
- Routing
- Satisfiability
problems:
- Traveling Salesman Problem
- Boolean Satisfiability
summary: Witness-preserving SAT edits and conditionally optimal TSP node insertions expose model-specific weaknesses in neural predictors, with modest adversarial fine-tuning gains and explicit distribution limits.
code_url: https://github.com/johannaSommer/generalization-neural-co-solvers
---

# Generalization of Neural Combinatorial Solvers Through the Lens of Adversarial Robustness

> **TL;DR:** Starting from a labelled instance, construct adversarial SAT/TSP variants whose labels or optimal tours can be updated without solving each new instance. The tested NeuroSAT, decision-TSP and route-prediction networks are vulnerable within these sound perturbation families. The work evaluates generalization and fine-tuning; it does not prove every neural solver fragile or remove the need to obtain the original labels.

## Motivation

Training and testing with the same small-instance generator can reward superficial cues or leave large parts of the problem space untested. Fully labelling arbitrary hard instances is expensive, so this coverage problem cannot be solved by collecting unlimited exact supervision. The paper proposes local adversarial evaluation: use the model's gradients to find difficult nearby instances while exploiting problem structure to know their updated answers.

## Contributions

- Defines a sound perturbation model together with a map updating the original solution or decision label.
- Constructs SAT edits preserving a known satisfying witness or unsatisfiability, and TSP insertions whose optimal route follows from a sufficient insertion-cost condition.
- Implements gradient-guided attacks on NeuroSAT, a neural decision-TSP model and a convolutional route predictor, comparing optimized with random valid perturbations.
- Examines limited adversarial fine-tuning, attack budgets, cross-size/external SAT tests and conventional-solver behavior. This is an analysis of separately trained models, not one unified SAT/TSP solver checkpoint.

## Methodology

For an original instance `x` and known solution `Y`, the attack maximizes model loss over allowed instances `x_tilde`, using the updated target `h(x_tilde,x,Y)`. “Sound” means that target remains correct under the specified conditions. It does not mean the attack finds the globally most damaging perturbation, and it does not provide the original label for free. The no-accuracy/robustness-tradeoff discussion assumes deterministic correct targets and a sufficiently expressive realizable predictor; it is an existence argument, not an efficient learning guarantee for the tested networks.

For SAT, satisfiable instances retain at least one literal true under a known witness in every clause while other literal occurrences may change. On unsatisfiable instances, deleting literals strengthens nonempty clauses; adding clauses while retaining the original unsatisfiable formula also preserves UNSAT. The broader statement allows changes provided an unsatisfiable subset remains. The implemented ADC attack uses the simpler append-only construction, rather than assuming an arbitrary unknown UNSAT core can be edited safely.

SAT attacks relax literal-clause incidence edits from binary values into `[0,1]`, apply projected gradient optimization under budgets and witness/nonempty-clause constraints, and then sample discrete valid edits. The reported default uses 500 steps with early stopping, 19 Bernoulli samples plus a top-entry sample, and the sample with the largest loss. These attacks require differentiable access to the assessed model; derivative-free extensions are discussed rather than evaluated here.

For TSP, start with a known **optimal** tour and neighboring vertices `P,Q`. For a new point `Z`, compare insertion increments `d(A,Z)+d(B,Z)-d(A,B)` across eligible vertex pairs. The paper's sufficient condition rules out another pair with an increment no greater than that of `P,Q`; inserting `Z` between `P,Q` then retains an optimal tour. The negated-existence sign in Proposition 2 matters and was checked visually. Repeated insertions must satisfy the condition relative to previously added points. The convex-hull shortcut uses planar Euclidean noncrossing geometry and should not be generalized to arbitrary distance spaces.

The attack optimizes only the inserted coordinates, uses up to three corrective gradient steps when a constraint is violated, and excludes still-invalid points when evaluating the model. Five is therefore a maximum insertion budget, not a promise that five valid points always survive. Decision-query costs and route targets are updated accordingly. For the route predictor, attack optimization uses edge cross-entropy because decoding is difficult to differentiate; evaluation then reports the decoded tour's optimality gap.

## Experiments

Experiments use at least five random seeds and compare clean, random-perturbed and optimized-perturbed inputs. NeuroSAT is trained on 50,000 generated 10–40-variable instances for 60 epochs, with held-out data from the same generation strategy; larger and external instances use more message-passing steps. Default literal-edit budgets are 5% for satisfiable edits and UNSAT deletion, while ADC adds 25% more clauses with a controlled average size.

NeuroSAT is much more vulnerable on satisfiable than unsatisfiable instances. Appendix I reports that one gradient attack step reduces satisfiable-instance accuracy from 79% to 26%, compared with 74% under the single-sample random baseline. The main budget study reports a drop below 50% with only 0.2% of literal occurrences edited. These are model/distribution-specific results, not a lower bound for every SAT network or every formula.

Adversarial fine-tuning adds ten epochs, perturbs 5% of training instances and reduces the satisfiable-edit budget to 1%. In Table 1, attack accuracy on 50–100-variable instances rises from `39.4±3.15%` to `44.4±1.19%`, and clean accuracy from `81.1±0.64%` to `82.7±0.50%`. Gains are modest and incomplete. SATLIB is an explicit exception: its reported accuracy decreases from `66.1±3.07%` to `63.7±1.88%`. A baseline using a 10% larger ordinary training set is also included.

TSP models use uniformly sampled planar coordinates, conventionally labelled with Concorde, and decision thresholds 2% above/below the reference optimum. Five-node insertion attacks degrade the decision network and push the ConvTSP route predictor's gap beyond 2% in the reported 20-node test. ConvTSP uses greedy decoding in these experiments. The paper calls the Concorde reference “near-optimal” in its experimental description, while the proposition assumes an optimal original tour; the theoretical soundness statement must retain that assumption rather than silently certify every experimental reference.

Appendix G times Glucose and MiniSAT on clean/perturbed SAT instances. UNSAT deletion/addition examples often become easier for those conventional solvers, supporting the **model-specific** nature of the difficulty. The attack-step, qualitative SAT and inserted-tour appendices provide further examples; they do not establish generally harder benchmark instances for all solvers.

## Limitations

### Curator Notes

The attacks cover defined perturbation families and specific model implementations. Their gradient search is heuristic, so failure to find an attack is not a robustness certificate. Sound TSP updates depend on the original optimal route and on every accepted insertion satisfying the condition; constrained families do not cover all distribution shifts.

The results do not isolate a unique cause of fragility: spurious features, incomplete training, architecture limits and optimization may all contribute. The existence of a perfectly accurate robust predictor does not imply that a bounded network can learn it efficiently. Adversarial fine-tuning remains vulnerable, and its generalization improvements are not uniform across datasets. The SAT construction keeps clauses nonempty; Appendix B's unusual empty-clause convention should not be imported as the standard semantics of CNF SAT.

## Reproducibility

- Publication record: [official ICLR 2022 listing](https://iclr.cc/virtual/2022/poster/7081), linked to [OpenReview](https://openreview.net/forum?id=vJZ7dPIjip3).
- Scientific source: [complete 21-page arXiv v2, March 21, 2022](https://arxiv.org/pdf/2110.10942v2), including the full bibliography and Appendices A-K. The header and primary arXiv history identify this version; v1 was submitted October 21, 2021.
- Verified [official implementation repository](https://github.com/johannaSommer/generalization-neural-co-solvers), including SAT/TSP training, attack and data-generation instructions. The article's older project URL currently redirects to the group's general homepage. The repository specifies PyTorch 1.10/CUDA 11.4 and PyConcorde for TSP data generation. Its subsequently added CircuitSAT implementation is not an additional result of this article.
- The repository's one-page scientific conference poster was also downloaded, registered, read and visually inspected. Precise numerical claims here follow the complete paper rather than abbreviated poster text.
- OpenReview's attachment APIs returned 403 during the audit, while the scientific appendices explicitly referenced by the article are all integrated in the reviewed arXiv version. No identified separate scientific supplement remains missing. Proposition signs/proofs, main results and appendix algorithms/tables/qualitative figures were checked visually. Experiments were not rerun.
