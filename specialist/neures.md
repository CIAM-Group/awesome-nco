---
id: neures
short_title: NeuRes
title: Learning Better Representations From Less Data For Propositional Satisfiability
authors:
- Mohamed Ghanem
- Frederik Schmitt
- Julian Siber
- Bernd Finkbeiner
year: 2024
date: '2024-02-13'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/56a225639da77e8f7c0409f6d5ba996b-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/56a225639da77e8f7c0409f6d5ba996b-Abstract-Conference.html
institutions:
- CISPA Helmholtz Center for Information Security
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Satisfiability
problems:
- Boolean Satisfiability
summary: NeuRes constructs resolution refutations and satisfying assignments from a shared dynamic clause-literal
  graph, using certificate supervision and offline proof-shortening expert iteration.
code_url: https://github.com/Oschart/NeuRes
arxiv_url: https://arxiv.org/abs/2402.08365
figure:
  path: paper-assets/neures/framework.png
  alt: A dynamic message-passing formula representation feeds a resolution clause-pair selector and a parallel assignment
    decoder.
  caption: 'Figure 1: NeuRes jointly constructs a resolution proof or a satisfying assignment.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=3
---
# Learning Better Representations From Less Data For Propositional Satisfiability

> **TL;DR:** NeuRes learns to construct checkable SAT/UNSAT certificates from a shared, dynamically updated formula graph. Offline expert iteration replaces teacher proofs with shorter valid ones. It improves over NeuroSAT on synthetic formulas with fewer training examples, while its overall runtime remains slower than the classical teacher.

## Motivation

A satisfiable verdict can be checked against a truth assignment, but an unsupported unsatisfiable prediction cannot establish that no assignment exists. NeuRes trains on resolution proofs and assignments, aiming for richer supervision and sound certified outputs. A timeout is unresolved, not a valid SAT or UNSAT verdict. [Sections 1-3.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=1)

## Contributions

- Combines a clause-literal graph encoder with an attention-based resolution selector and a parallel assignment decoder.
- Compares cascaded, full and variable-anchored attention for selecting resolvable clause pairs from an expanding pool.
- Uses certificate-supervised teacher forcing and **offline expert iteration** to replace longer teacher proofs with shorter model proofs.
- Studies representation/data efficiency, proof shortening, inference fan-out and transfer to formulas with more variables. [Sections 4-9.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=4)

## Methodology

### Dynamic certificate construction

A CNF graph has clause nodes linked to their literals, with positive/negative literals connected as complements. A NeuroSAT-style LSTM message-passing network embeds this graph. At each resolution step, the model selects two compatible clauses; symbolic resolution derives a new clause and appends it to the formula. **Dynamic embeddings** perform one further message-passing round over the enlarged graph, updating old clause/literal representations. The static alternative only exchanges messages around the new clause, leaving existing clause embeddings unchanged. [Sections 3-4.2 and Appendix A.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=3)

The three clause selectors trade computation for joint decisions. Cascaded attention chooses one clause then conditions the second query on it. Full attention scores the entire quadratic clause-pair grid and masks invalid resolution pairs. Anchored attention first chooses a variable, then scores clauses containing its positive literal against those containing its negative literal. Appendix B's connectivity lemma concerns exchanged graph information for those anchored clauses; it is not a neural-search completeness guarantee. [Sections 4.3 and Appendix B.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=5)

A sigmoid MLP simultaneously predicts candidate truth assignments from literal embeddings. Only the positive-literal assignment is directly supervised in training; both positive- and negative-literal views are decoded and checked during testing. The process ends when it derives the empty clause, finds an assignment satisfying every original clause, or reaches its episode cap. Correctness comes from valid symbolic derivations and certificate checks, rather than the network's confidence. [Sections 4.1/4.4.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=6)

### Supervision and expert iteration

BooleForce supplies resolution proofs for UNSAT and assignments for SAT. UNSAT training teacher-forces clause pairs and minimizes discounted negative log likelihood. SAT training uses discounted assignment binary cross entropy. The discount **gamma=.99** weights later steps more heavily. Before a bootstrapped supervised pass, the model rolls out a proof; if it is valid and shorter, it replaces the corresponding teacher trace. This changes the **offline training target**, not network weights or a complete-solution incumbent during deployment. [Sections 5-6.2.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=6)

Higher inference fan-out performs the top-k valid resolution steps per neural query. After deriving falsum, the final proof retains only its resolution ancestors, pruning unrelated derivations. Appending clauses still constructs a certificate from a partial proof. Thus the repository classification remains **specialist, constructive**, despite proof shortening during offline training. One Boolean-SAT model covers satisfiable and unsatisfiable cases of the same decision problem; this is not cross-problem generalism. [Section 8.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=9)

## Experiments

### Data, model and budgets

Training uses synthetic **SR(U(10,40))** formulas, with 10-40 Boolean variables sampled uniformly. Resolution-only experiments train on **8000 UNSAT formulas** and test on **10000 unseen formulas** from that distribution. The full solver trains on **8000 SAT plus 8000 UNSAT** examples. This is fewer formulas than the millions used for the compared NeuroSAT model, but each UNSAT example includes a multi-step proof; sample counts do not equal supervision volume or compute. [Sections 5-7.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=7)

Embedding dimension is 128, with 32 initial message-passing rounds in the attention ablation. Adam uses batch size 1, 50 epochs, linear learning-rate decay from 5e-5 to zero and global-norm clipping .5; the reported training takes about **six days on one A100**. The encoder has 429824 parameters, and the reported totals are **479104 for NeuRes versus 478976 for NeuroSAT**. Similar model size supports attributing differences to the certificate/task design, rather than a much larger encoder. [Section 5.3 and Appendix E.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=16)

UNSAT episodes stop at **four times the teacher-proof length**; SAT episodes allow **2*|V|** trials. The normalized proof length p-Len is computed **only on solved formulas**. Teacher-derived caps are an evaluation protocol, not a freely available budget for a genuinely unknown test formula. [Sections 6-7.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=7)

### Attention, bootstrapping and certificates

Dynamic Full-Attn proves **95.2%** of resolution-only test cases with mean p-Len **1.67**, compared with static Full-Attn's **25.38%/1.61**. Dynamic Casc-Attn reaches 37.33% and Anch-Attn 60.5%. The shorter static mean is conditioned on a much smaller solved subset and should not be treated as globally better proof quality. [Table 1.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=7)

Bootstrapping reaches **100% success and p-Len 1.15** on the reported resolution-only test distribution. In the training corpus, 90.08% of proofs are shortened; mean reduction over shortened proofs is 33.51%, while the **total number of proof steps falls 31.85%**. The often-quoted “about 32%” refers to aggregate proof steps, not fewer formulas or faster end-to-end solving. These proofs need not be shortest possible; they improve on a non-optimal teacher trace. Without bootstrapping, aggregate reductions are 3.07% on training and 3.15% on test data. [Table 2 and Appendix C/Table 5.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=8)

On full-solver **SR(40)** tests, NeuRes certifies **96.8% SAT, 99.6% UNSAT, 98.2% total**. Its separately trained classification head gives 91.65% total predicted accuracy; that is a different measurement from certified success. The cited NeuroSAT achieves 70% SAT certificates and 85% total classification accuracy, with no UNSAT certificates. These comparisons concern the stated synthetic distribution. [Table 3.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=9)

Fan-out top-1/3/5 raises total certified success from **98.2/99.9/100%**, with normalized final proof lengths **1.15/.57/.52** and model calls **1.15/.49/.43** relative to teacher proof length. Extra symbolic branches grow the clause pool and quadratic attention grid, so fewer neural calls do not imply constant resource use. [Table 4.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=9)

### Runtime and larger formulas

The Python Full-Attn prototype's top-1 average SAT/UNSAT times are **2.3/88 ms**; top-3 gives **3/54.4 ms**. Its total average is **28.7 ms** at top-3 versus **4.5 ms** for the C BooleForce teacher. This is not overall classical-solver superiority, even though SAT-only cases are fast. Different implementations further limit inference from the comparison. [Appendix D/Table 6.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=16)

Larger-formula tests use **SR(40/80/120/160/200)** and up to **1000 iterations**. Figure 5 shows success increasing with iterations and degrading with size; SR200 reaches only approximately half solved at 1000. The qualitative comparison favors NeuRes over NeuroSAT's early/final success on most tested scales, but is not an industrial-benchmark or completeness claim. [Section 9 and Figure 5.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=10)

## Limitations

### Reported by the Authors

- The model cannot independently outperform highly engineered industrial SAT solvers; the authors present hybrid integration as future potential.
- Full attention is quadratic in the growing clause pool. Higher fan-out has diminishing returns and enlarges that pool.
- Statistical error bars are omitted due to computational budget. The teacher proofs and generated shorter proofs are not guaranteed size-optimal. [Sections 6/8/10 and checklist.](https://proceedings.neurips.cc/paper_files/paper/2024/file/56a225639da77e8f7c0409f6d5ba996b-Paper-Conference.pdf#page=20)

### Curator Notes

- Certificate soundness does not imply a bounded neural rollout will decide every input. A failed search or timeout is unresolved.
- The data-efficiency claim compares formula counts with different supervision richness and should be read alongside six-day training and proof-length budgets.
- Mean proof lengths exclude timeouts. Aggregate proof-step savings, prediction accuracy, certified success, neural calls and elapsed time are distinct outcomes.
- Offline expert iteration and final proof pruning do not turn the deployment solver into a neural incumbent-improvement policy.

## Reproducibility

- **Formal publication/full text:** [NeurIPS 2024](https://proceedings.neurips.cc/paper_files/paper/2024/hash/56a225639da77e8f7c0409f6d5ba996b-Abstract-Conference.html); all **24 publisher-PDF pages**, including Appendices A-E, proof example and full checklist, reread. The publisher page has the integrated paper and no separate scientific attachment; the official code tree has no PDF/ZIP supplement.
- **Date/provenance:** [arXiv:2402.08365](https://arxiv.org/abs/2402.08365) history identifies v1 **13 February 2024**, v2 29 May and v3 10 November 2024. The actual read source is the formal publisher PDF. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2024/hash/56a225639da77e8f7c0409f6d5ba996b-Abstract-Conference.html) explicitly records `citation_publication_date` as **2024-12-16**, independently of any paper-specific acceptance date.
- **Official implementation:** [Oschart/NeuRes](https://github.com/Oschart/NeuRes), exact title/authors and full current README checked. It documents training, bootstrapping, data formats and evaluation; dependencies are unpinned. Its current tree contains no data directory, and the README says original splits must be supplied/generated or requested from authors, despite the historical paper checklist's public-data claim.
- **Figure:** original Figure 1, PDF page 3, showing shared embeddings, clause derivation and assignment heads. Figure 7's 20-to-10-step example and all quantitative tables were visually checked.
