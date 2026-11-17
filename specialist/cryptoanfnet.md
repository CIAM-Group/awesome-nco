---
id: cryptoanfnet
short_title: CryptoANFNet
title: Learning Plaintext-Ciphertext Cryptographic Problems via ANF-based SAT Instance
  Representation
authors:
- Xinhao Zheng
- Yang Li
- Cunxin Fan
- Huaijin Wu
- Xinhao Song
- Junchi Yan
year: 2024
date: '2024-12-16'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/494f876fad056843f310ad647274dd99-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/494f876fad056843f310ad647274dd99-Abstract-Conference.html
institutions:
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Satisfiability
problems:
- Cryptographic SAT
- Key Bit Prediction
summary: CryptoANFNet predicts satisfiability of XOR-rich cryptographic MQ instances
  using an ANF graph; paired predictions and training improve single key-bit inference,
  without certifying full keys.
---

# Learning Plaintext-Ciphertext Cryptographic Problems via ANF-based SAT Instance Representation

> **TL;DR:** CryptoANFNet represents Boolean multivariate-quadratic systems directly in algebraic normal form and learns satisfiability scores through graph message passing. A paired-instance extension predicts one selected key bit. Reported classification accuracy and inference speed are distinct from certified SAT solving or complete key recovery.

## Motivation

XOR-heavy encryption operations can become large or structurally obscured when encoded for CNF-based neural SAT models. Direct parity clauses can expand exponentially without auxiliary variables; introducing auxiliary variables avoids that literal expansion but changes the representation. The paper investigates an ANF graph that preserves XOR equations and quadratic products (Sections 1-3).

## Contributions

The work introduces a tripartite ANF graph, a classifier that derives quadratic-term embeddings from underlying variable embeddings, and a paired training/inference method for key-bit prediction. An alternative expanded graph appears in Appendix B. The experiments cover random MQ systems and synthetic instances derived from Scipher and reduced-round SPECK.

This is a specialist SAT-prediction/key-bit framework. The demonstrated outputs are scalar satisfiability scores and one queried bit, not a verified assignment satisfying every equation. Models are trained for the listed datasets and the key-bit extension is trained on paired instances; the paper does not demonstrate one shared checkpoint across all cryptographic tasks or full-key reconstruction.

## Methodology

An MQ system consists of Boolean equations over GF(2), where addition is XOR and multiplication is AND. The main graph connects vanilla variables, second-order terms and complementary equation nodes distinguished by their constant term. Only variable and clause embeddings persist; a quadratic term's embedding is formed by concatenating its variable embeddings. MLP messages and layer-normalized LSTMs update the states. Separate positive/negative clause MLPs produce summed votes, a sigmoid and binary cross entropy (Equations 1-5).

For a selected key bit, the method builds two otherwise corresponding instances, fixing that bit to zero or one, and chooses the higher satisfiability score. Paired training adds a softmax comparison loss to individual BCE, with lambda 0.1 in the experiments. This uses the intended assumption that the pair contains the correct unique bit assignment. An arbitrary plaintext/ciphertext pair need not identify a unique key without further conditions, and learned scores do not certify that assumption (Section 4.4; Equations 6-7).

## Experiments

SR(n) instances are random MQ systems with matched SAT/UNSAT pairs differing in one constant term, labeled using WDSat. The cipher datasets vary rounds/key/plaintext lengths: three/six rounds, eight/sixteen-bit keys and sixteen/thirty-two-bit plaintexts. Scipher's specific name is withheld; Appendix C gives a symbolic round function rather than a complete parameterized implementation. These are small synthetic cryptographic instances, not reported attacks on full-round production ciphers.

Table 2 reports CryptoANFNet versus NeuroSAT accuracy of 96% versus 91% on **SR(5)**, 72% versus 57% on **SR(25)**, and 72% versus 55% on **Speck-3-8-16**. The abstract's description of the 96%/91% pair as real-cipher data should not override the table. On Scipher-3-8-16 and Speck-3-8-16, paired key-bit prediction raises 76.5% to 82% and 72% to 75%, respectively. These are the selected-bit experiment's accuracies, not percentages of fully recovered keys (Tables 2-3; Section 5.3).

Tables 4-5 give mean milliseconds per SAT/UNSAT instance for neural models and conventional solvers on a Threadripper 3970X/RTX 3090 system. CryptoANFNet takes 5/5 ms on SR(25), versus WDSat 2,470/5,662 ms, but conventional solvers are faster on several cipher datasets: e.g. Kissat 3/3 ms versus CryptoANFNet 11/11 ms on Speck-3-8-16. The paper summarizes a 50-times average speedup, without specifying an aggregation that turns this into uniform dominance. More fundamentally, an imperfect classifier's forward pass does not provide the same answer guarantee as a complete SAT solver. No correctness-adjusted full-solving speedup follows from these tables alone.

## Limitations

The model may misclassify either SAT or UNSAT and does not emit certificates. The key procedure compares paired scores, so error can propagate if it is used for multiple bits; the paper supplies no full-key success experiment or theorem. The tests do not establish generalization to arbitrary key lengths, new ciphers or higher round counts. Appendix D acknowledges the narrow plaintext/ciphertext focus, and the checklist reports no statistical error bars and no theoretical results.

### Curator Notes

The final paragraph of Section 5.2 reverses which model receives CNF versus ANF relative to the architecture and surrounding explanation; this remains a printed reporting inconsistency, not evidence of what unpublished code executed. Equation 1 also prints the positive-clause output label twice where the two distinct update modules are described. The citation numbered 41 is literally attached to the layer-normalized LSTM sentence but its bibliography entry is Bello et al.'s neural CO paper; the citation edge records that printed reference, without asserting it is the proper source of layer normalization. Training/test counts, several architecture/training hyperparameters, Scipher constants and the speedup aggregation are insufficiently specified to recreate every reported result from the article alone.

## Reproducibility

- All 21 pages of the [formal NeurIPS 2024 paper](https://proceedings.neurips.cc/paper_files/paper/2024/file/494f876fad056843f310ad647274dd99-Paper-Conference.pdf), including all references, Appendices A-E and checklist, were read. Eight key architecture/result/appendix pages were visually checked. Publisher metadata confirms six authors, Shanghai Jiao Tong University, DOI 10.52202/079017-1317 and December 16, 2024.
- The [official conference page](https://neurips.cc/virtual/2024/poster/95937) supplies a nine-page slide PDF and a poster image. All nine slides were read and visually inspected, as was the complete poster; their scientific content repeats the graph, key-bit pipeline and result tables. The publisher has no separate supplement link. OpenReview API v1/v2 requests for `FzwAQJK4CG` returned 403; all named paper appendices are integrated in the read proceedings PDF.
- The paper's checklist says code/toolkit will be released on acceptance. No author implementation URL was verified in the full article, publisher, conference links or checked lab page, so no code link is inferred. No training, timing or cryptanalysis experiment was rerun. 8 exact citations to existing catalog papers are registered with body/reference evidence.
