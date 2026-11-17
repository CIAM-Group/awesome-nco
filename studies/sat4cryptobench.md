---
id: sat4cryptobench
short_title: SAT4CryptoBench
title: 'Bridging Crypto with ML-based Solvers: the SAT Formulation and Benchmarks'
authors:
- Xinhao Zheng
- Xinhao Song
- Bolin Qiu
- Yang Li
- Zhongteng Gui
- Junchi Yan
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/69d97a6493fbf016fff0a751f253ad18-Abstract-Datasets_and_Benchmarks_Track.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/69d97a6493fbf016fff0a751f253ad18-Abstract-Datasets_and_Benchmarks_Track.html
institutions:
- Shanghai Jiao Tong University
- Shanghai Innovation Institute
scope: study
paper_type: benchmark
problem_families:
- Satisfiability
problems:
- Cryptographic SAT
summary: Cryptographic SAT benchmarks compare classification, learned solver heuristics and parameter tuning across
  CNF, ANF and a neural-initialized bitwise search pipeline.
code_url: https://github.com/void-zxh/SAT4CryptoBench
---

# Bridging Crypto with ML-based Solvers: the SAT Formulation and Benchmarks

> **TL;DR:** SAT4CryptoBench separates SAT/UNSAT classification from actual solver acceleration and parameter tuning on cryptographic instances. ANF-based classifiers outperform tested CNF networks; solver gains depend on the instance and baseline. Its BASIN pipeline combines ANF-network initialization with specialized bitwise key search.

## Motivation

Cryptographic constraints contain algebraic dependencies and repeated bit operations that differ from common synthetic SAT benchmarks. Inconsistent encodings, datasets and levels of ML integration make previous results difficult to compare. The study evaluates these choices within one cryptographic benchmark (Sections 1-4).

## Contributions

The benchmark includes reduced-round Simon, MD4, SHA-1, SHA-256 and a confidential anonymized block cipher called Cipher. It compares three roles for learning: standalone satisfiability distinguishers, heuristic assistance inside or alongside classical solvers, and black-box optimization of solver parameters. These roles are not interchangeable: classifying a formula does not return a satisfying key or an UNSAT certificate.

The paper also introduces BASIN, a specialized key-recovery pipeline. Its central contribution remains a benchmark study; it does not demonstrate one neural checkpoint generalizing across all algorithms and representations. Results concern the specified reduced-round/configured instances, rather than a demonstrated break of full deployed cryptographic standards.

## Methodology

CNF graphs use variable-clause or literal-clause representations; ANF represents equations over GF(2), retaining variables, monomials and equation structure. The distinguisher experiment compares eight architecture/graph configurations on six paired Simon datasets: three- and six-round settings with the paper's 8/16/32-bit labels. ANF/CNF pairs originate from the same plaintext-ciphertext data. Appendix B defines its Simon construction using a 2n-bit block and n-bit seed key; the main text's block/key terminology is inconsistent, so dataset labels should be checked against their generator rather than silently equated with standard Simon variants.

The heuristic experiments distinguish online internal learning, such as Bayesian moment-matching branching, from external neural modules. They measure mean solving time on satisfiable instances. Appendix A specifies 1,000/200/200 training/validation/test pairs and a 5,000-second timeout recorded at the cap. The parameter-tuning experiment instead uses 10 training and 200 held-out test instances per family, optimizing three parameters of Kissat, CryptoMiniSat or MapleSAT with HEBO or EasyNAS.

BASIN derives ANF input for an improved CryptoANFNet and predicts a 32-bit initialization, then passes that initialization and a plaintext-ciphertext file to a specialized `simon_anf` search executable. Thus its neural stage still uses ANF; the experiment changes search machinery and neural guidance along with the solver-facing input. It is not a controlled test changing only serialization. The paper reports Ascend 910B neural computation and CPU solving on a 192-core aarch64 server, allocating a device and NUMA node per task (Appendix A.1).

## Experiments

Table 1 gives CryptoANFNet 100%/99.5%/99.5% classification accuracy for the three-round settings and 70.0%/69.0%/67.3% for six rounds. Tested CNF configurations range roughly from chance to 59.0%. This supports the observed representation/architecture comparison, without proving that every CNF model must fail or that classification accuracy guarantees key recovery.

Heuristic gains are mixed. MapleLCMDist-BMM takes 368.26 seconds versus 382.92 for its base on Cipher-12, while MapleSat-BMM takes 460.57 versus 440.02 on Simon-12-32-64. NeuroBack takes 433.77 versus Kissat's 11.28 seconds on Simon-10-32-64. These results include the tested solver implementations and model distributions, rather than isolating learning as the only difference (Table 2).

All listed tuned configurations improve their corresponding baseline means in Table 3. For example, Kissat-H reduces Cipher-12 time from 974.35 to 521.42 seconds, about 46.5%; MapleSAT-E reduces MD4 time from 1.435 to 0.276 seconds, about 80.8%. These table-derived percentages replace the unreconciled prose claims of 62.5% and 88.0%. Tuning cost is separate from the displayed test solving times.

Table 4 compares the best listed solver per representation. BASIN takes 19.94/37.30/29.67 seconds on Simon's 10/11/12-round datasets. WDSat or WDSat+MVC takes 0.08/23.60/364.96, and the best listed CNF methods take 11.28/41.57/371.78. BASIN leads on the 12-round case, while ANF is faster at 10 and 11 rounds. These are reported pipeline times; their nonmonotonicity and distinct algorithms should not be recast as a general complexity scaling law.

## Limitations

Cross-family and size generalization remain limited, and neural overhead can exceed its benefit. The confidential Cipher algorithm prevents independent regeneration from its full specification. The article does not specify all training, tuning-budget or confidence-interval construction details; Tables 2-3 label their intervals as 95% CIs despite the checklist's negative statistical-significance answer. The empirical scope is finite, with no general solver-completeness or learning-convergence theorem.

### Curator Notes

The timing protocol is not fully reconciled: Appendix A caps runtimes at 5,000 seconds, yet Table 2 contains a 5,764.04-second mean. The main text describes external pretrained models while Appendix A.4 describes training them on the benchmark. BASIN's README and printed timing label say prediction is excluded, but the inspected `compute_time.py` actually adds the entire initialization phase to accumulated solve times before averaging successful files. Consequently, the table's exact timing boundary should be confirmed from the authors' experiment logs; this review does not assume either interpretation.

Appendix B's printed modular-addition equation contains an incomplete carry term and indexing, and its CNF-addition bullet has no formula. Appendix C's text and figure also disagree on the direct parity clause count. The familiar distinction between exponential direct parity encoding and linear-size auxiliary-variable encoding is the intended discussion; these printed expressions should not be copied as a validated complete encoder. Appendix D's statement that no new solver architecture is introduced also conflicts with the main BASIN proposal. The note retains the actual described pipeline and qualifies its evidence.

## Reproducibility

- Publication and scientific source: [NeurIPS 2025 Datasets and Benchmarks record](https://proceedings.neurips.cc/paper_files/paper/2025/hash/69d97a6493fbf016fff0a751f253ad18-Abstract-Datasets_and_Benchmarks_Track.html) and its complete 28-page proceedings PDF, including 47 references and Appendices A-E.
- [Official repository](https://github.com/void-zxh/SAT4CryptoBench), inspected at `e0ed8e34dcb4b7e230cfc3fe39b8500796a8b519`, provides model/evaluation scripts, solver archives, a BASIN checkpoint/executable and links to data. The root README identifies reduced-round MD4-20, SHA1-21 and SHA256-18 datasets. BASIN's current scripts use a CUDA-capable model path, distinct from the article's Ascend environment; exact binary/platform and timing reproduction need configuration.
- All eight bundled solver ZIPs were downloaded and recursively inventoried: 5,040 entries, with no separate scientific PDF or video. The publisher lists no additional supplementary file. Both OpenReview API versions for `BmwbEWRkyE` returned 403; no explicitly referenced missing scientific document was identified.
- Full text, formulas, key result tables, source identities and bibliography/body matches were checked. Selected pipeline code was read; solver binaries and the full experiments were not executed. 8 exact existing-paper citations are registered in the review record.
