---
id: struct-ckn
short_title: Struct-CKN
title: Structured Convolutional Kernel Networks for Airline Crew Scheduling
authors:
- Yassine Yaakoubi
- François Soumis
- Simon Lacoste-Julien
year: 2021
date: '2021-07-01'
publication:
  date: '2021-07-01'
  source_url: https://proceedings.mlr.press/v139/yaakoubi21a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v139/yaakoubi21a.html
institutions:
- GERAD
- Polytechnique Montréal
- Mila
- Université de Montréal
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Airline Crew Pairing
summary: A convolutional kernel network with constrained structured prediction supplies flight connections and pairing
  warm starts to a commercial crew-pairing optimizer.
code_url: https://github.com/Yaakoubi/Struct-CKN
---

# Structured Convolutional Kernel Networks for Airline Crew Scheduling

> **TL;DR:** A convolutional kernel network and constrained structured predictor propose flight connections for a commercial crew-pairing solver; substantial final cost reductions require repair, rolling-horizon optimization and, for the headline result, a second optimization pass.

## Motivation

Large monthly crew-pairing problems contain approximately 50,000 flights and airline-specific operating rules, costs and workload constraints. Independently predicted successor flights can produce conflicting connections and illegal pairings. Struct-CKN adds local structured constraints to improve the initial clusters and partial solution supplied to an operations-research solver. The paper explicitly does not claim that the neural predictor directly solves the full CPP (Sections 1/6.2).

## Contributions

- Combine a convolutional kernel feature map with a CRF structured predictor trained using a variant of stochastic dual coordinate ascent; also examine a structured-SVM/BCFW alternative.
- Predict flight connections jointly while imposing at-most-one predecessor constraints, improving the legality of constructed pairing fragments.
- Evaluate OCR as a separate structured-prediction sanity check and integrate crew-pairing predictions with GENCOL/Commercial-GENCOL-DCA on a monthly airline benchmark.

## Methodology

**Kernel network.** Normalize local patches, initialize filters with spherical k-means and approximate a positive-definite kernel feature map using Nyström projections. Pool and compose such maps, then jointly update filters and structured-predictor weights. The RKHS/representer results concern positive-definite kernels and the specified monotone norm regularizer; they do not certify global optimization of the learned nonconvex feature network or a downstream crew-pairing optimum (Section 3; Appendix A).

**Structured learning and approximation.** A CRF scores structured output labels using learned features. SDCA updates the predictor and backpropagation updates CKN filters. Exact marginal-based entropy/duality calculations require their graphical-model assumptions. For large flight graphs, AD3 supplies approximate MAP labels; Appendix B.1 explicitly replaces unavailable CRF marginals by unit mass at that approximate MAP solution. This is a heuristic expected to work for sharply peaked distributions near a good MAP solution, not exact CRF likelihood training or inherited exact SDCA convergence. OCR chain inference is a separate, simpler case (Sections 4-5; Appendices B-C).

**Flight input and constraints.** Six training months each contain roughly 50,000 flights. For an incoming flight, up to twenty feasible departures in the next 48 hours are ordered by departure time; features encode city, aircraft type, duration and times. The label is the successor's rank. A graph CRF imposes at-most-one predecessor through hard factors. These local constraints do not encode all duty limits, return-to-base rules, workload balance or the true commercial objective (Sections 6.2.1-6.2.2; Appendix D.1-D.2).

**Full solver pipeline.** Construct pairing chains, truncate illegal portions and preserve legal fragments. Generate repositioning/deadhead options and use GENCOL to cover open flights with two-day windows/one-day overlap, then Commercial-GENCOL-DCA with week-long windows/two-day overlap. The predictor supplies both initial clusters and an initial solution. The plus variant reruns the optimizer using the first optimized solution as its new starting point; it is an additional solver pass, not simply another neural forward pass (Figure 3; Appendix D.3-D.4).

## Experiments

**OCR and tuning.** The OCR task classifies pre-segmented handwritten characters under a chain model, with separate training from the airline task. Test error is 3.40% for Struct-CKN-SDCA versus 3.42% BCFW, 3.6% NLStruct and 4.5% CNN-CRF. The authors also acknowledge other structured approaches reaching 1-3%, so this is not an unrestricted best-known OCR claim. Appendix C uses a non-exhaustive grid search (one layer, 200 filters, 5-by-5 patches) and compares SDCA update counts; the method does have tuning. Primal-suboptimality curves concern the structured-prediction objective, not the airline CPP's optimality gap (Section 6.1; Appendix C).

**Connection prediction and feasibility.** Test error is 0.28% with 15,200 parameters versus CNN 0.32%/459,542 and CNN-CRF 0.38%/547,542. This is 0.04 percentage points better than CNN, with about 96.7% fewer parameters. Nevertheless, 11.07% of initial Struct-CKN pairings are illegal versus CNN 21.05% and standard initialization 50.56%. After removal, the named feasible object is a set of legal fragments that still leaves flights uncovered: supplementary Table 7 lists 11,148 undercovered flights. It is not already a complete feasible monthly schedule (Tables 2-3; Appendix D.5/Tables 6-7).

**Correct cost denominator.** Final monthly baseline cost is $20.640 million. Single-pass Struct-CKN reaches $18.678 million, a 9.51% reduction relative to that baseline; its global-constraint penalty falls 80.25%. The CNN cost is $18.882 million, so the single-pass improvement relative to CNN is approximately 1.08%, not 9.51%. The extra-pass Struct-CKN+ reaches $17.146 million and penalty $58,797: the headline 16.93% cost and 97.24% penalty reductions are relative to the original baseline. Deadheads decrease from 992 to 583. These are feasible incumbent comparisons under the reported process, not certified gaps to a known global optimum (main Table 4; supplementary Table 9).

**Time budget and negative cases.** Single-pass times are baseline 45.92 hours, CNN 95.72 and Struct-CKN 64.48. Thus Struct-CKN is about 33% faster than CNN but slower than the standard baseline. Table 4 reports 41.44 hours for the plus pass; supplementary Table 8's six plus-window times sum to that value. Because that pass requires the first-pass solution, charging both reported optimization passes gives approximately **105.92 hours**, before any separately unreported learning/preprocessing costs. The 41.44-hour row alone is not an end-to-end time from the initial neural prediction. Window 6 also has worse LP/integer cost for single-pass Struct-CKN than CNN; fewer parameters do not imply universal optimization dominance (Tables 4/8).

**Scope of evidence.** The airline test is a particular monthly commercial benchmark with six historical training months. Training uses a 40-core/384GB machine and K80 12GB GPUs; a standardized end-to-end training/inference cost breakdown is not supplied. The paper omits solver-run variances because that solver is deterministic, which does not quantify neural-training variability or transfer to another airline's rules (Section 6).

## Limitations

### Discussed in the Paper

The predictor omits complex airline-specific global costs/constraints. Outputs require legality repair and conventional optimization; rolling windows can freeze earlier decisions and leave cross-window inconsistencies. Large structured inference uses approximate MAP/pseudomarginals, while entropy-based line search can require substantial memory. Distributed graph methods and a full-month optimization window remain future work (Sections 5-7; Appendices B/D).

### Curator Notes

This is a specialist learned warm start for crew pairing. A separately trained OCR demonstration establishes architectural breadth, not the same weights solving both native tasks. Kernel/convex structured-learning facts, local hard constraints and a strong commercial optimizer do not establish full neural feasibility or global CPP optimality.

Preserve all three distinctions: low connection error versus complete schedule feasibility; inflated under/overcoverage penalties in initial-fragment costs versus final operating cost; single-pass versus extra-pass budget. The source's assertion that modern graph neural networks necessarily require parameter counts growing with the number of graph nodes is not a general property of parameter-sharing GNNs; its resource rationale should be read as motivation for this implementation, not an architectural impossibility theorem.

## Reproducibility

- **Publication:** [PMLR ICML 2021 record](https://proceedings.mlr.press/v139/yaakoubi21a.html), pp. 11626-11636. Three authors and GERAD/Polytechnique Montréal, Mila and Université de Montréal affiliations match; François Soumis's accent is retained from the PDF. The [publisher source metadata](https://raw.githubusercontent.com/mlresearch/v139/gh-pages/_posts/2021-07-01-yaakoubi21a.md) explicitly records issued date 2021-07-01.
- **Reading/supplements:** all eleven main pages and all twenty-two pages of the separately linked supplementary PDF, which repeats the eleven-page paper before Appendices A-D.5. All kernel/structured-learning derivations, references, figures and detailed Tables 5-9 were read. Manual publisher extras and official-repository inventory identified no further scientific PDF/ZIP attachment.
- **Code/data:** [official Struct-CKN repository](https://github.com/Yaakoubi/Struct-CKN) provides CKN/SDCA/BCFW code, OCR training/evaluation and pretrained parameters. README warns of older Python/PyStruct requirements. Main/CRF/inference code was inspected; the released demonstration does not reproduce the full private airline/GENCOL pipeline. Public embedded flight features omit the connection arcs necessary for this paper, and raw commercial schedules/solver inputs are not redistributed. Appendix D.2 says those arcs must be obtained from authors. Training and commercial optimization were not rerun.
- **Citation graph:** exact explicit body citations to learning combinatorial optimization over graphs and GCNN branching match existing IDs. OCR/CRF/kernel background is not assigned invented relations to unrelated neural routing papers.
