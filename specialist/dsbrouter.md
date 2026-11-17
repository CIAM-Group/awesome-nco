---
id: dsbrouter
short_title: DSBRouter
title: 'DSBRouter: End-to-end Global Routing via Diffusion Schrödinger Bridge'
authors:
- Liangliang Shi
- Shenhui Zhang
- Xingbo Du
- Nianzu Yang
- Junchi Yan
year: 2025
date: '2025-10-06'
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/shi25k.html
venue: ICML
paper_url: https://proceedings.mlr.press/v267/shi25k.html
institutions:
- Shanghai Institute for Mathematics and Interdisciplinary Sciences
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Global Routing
summary: A pin-to-route diffusion bridge uses in-loop greedy Steiner reconstruction and feedback, improving tested
  overflow/connectivity with substantial wirelength and inference-time trade-offs.
code_url: https://github.com/Thinklab-SJTU/EDA-AI
---

# DSBRouter: End-to-end Global Routing via Diffusion Schrödinger Bridge

> **TL;DR:** Two image models learn a bridge between pin/congestion maps and routed examples. Sampling incorporates greedy Steiner-route reconstruction and evaluation-oriented feedback. Tested connectivity/overflow improve substantially, at the cost of long inference and sometimes much longer wirelength; the printed guidance derivation is not a general feasibility or optimality proof.

## Motivation

Generated routing images can be disconnected, so earlier methods add a connection stage. DSBRouter moves route reconstruction and objective feedback **inside** bridge sampling to align predicted images with usable global routes. End-to-end here refers to the overall inference pipeline without an additional final repair stage, not the absence of classical connection algorithms (Sections1–3).

## Contributions

- A diffusion Schrödinger bridge learns forward/backward mappings between initial pin/congestion images and routed examples.
- Evaluation-oriented guidance incorporates an in-loop Steiner map and greedy connected-route construction.
- Connectivity, overflow, wirelength, runtime and component/step-count studies evaluate the trade-off on ISPDcases (Sections3–4/AppendicesA–B).

## Methodology

**Task.** A planar grid represents global routing resources. Demand crossing an edge consumes capacity; negative residual capacity contributes overflow(OF). The network sees three64×64channels: pins, horizontal capacity and vertical capacity. Two UViT-bmodels, with4×4patches,512-dimensional embeddings and13Transformer layers, approximate terminal-reparameterized forward/backward processes. Alternating squared-error training uses nthu-router-generated route targets (Section3.2/AppendicesA.2–A.3).

**Bridge and guidance.** The ideal Schrödinger bridge minimizes path-spaceKLsubject to prescribed marginals. Finite neural training approximates that generative construction; it does not solve the discrete routing optimum. At each inference step the method extracts predicted hubs, includes original pins, expands Hanan-style coordinate intersections, then applies a greedy disjoint-set RSTconstructor. The connected candidate supplies overflow/wirelength-oriented feedback before another noisy bridge step. The sampling objective is a heuristic surrogate involving differences from the reconstructed route, not an oracle for the unknown optimal routing score (Sections3.2–3.3/Algorithms1–5).

**Classification.** Specialist / constructive: images and classical in-loop reconstruction produce routing candidates from input pins. Intermediate predictions can be disconnected. There is no demonstrated neural edit policy operating on a complete feasible routing incumbent; repeated continuous sampling alone does not establish improvement-paradigm membership. Generalization across circuits remains one native global-routing task.

## Experiments

**Data, budgets and reference quality.** Approximately300k64×64training samples come from fiveISPD07circuits(bigblue4,newblue4/5/6/7), with capacity maps updated from expert sequential routes. A10kheld-out patch suite usesnewblue1/2andbigblue1/2. Full-circuit tests coveribm01–05andadaptec3/4; the latter have hundreds of thousands of nets and pin spans far larger than training patches. Training uses eightH800GPUs; evaluation is reported on eightRTX4090GPUs with aXeon8480+. Default results use192training epochs and24inference steps; the step ablation uses64training epochs (Section4/AppendicesA.2–A.3/Tables4/7).

**Connectivity.** Table2reports1.000correctness on all four held-out groups, compared with HubRoutergenerators **without their RLconnection stage**. This supports connectivity of the tested complete DSBRouterpipeline, rather than superiority over fully connected HubRouteron this particular measure. Large-group WLRis1.450, worse than HubRouter's displayed1.001–1.244, and route generation takes2571–2687GPUseconds versus about6–12forVAE/GANor739–742forDPM. Ground-truth route length is the WLRdenominator, not a certificate of minimum feasible routing (Table2).

**Overflow versus wirelength.** Table3reports OF1430/0/4/10/0onibm01–05and0on bothadaptec3/4, lower than the listed baselines. Some baseline figures, including NeuralSteinerand classical quality values, are imported from NeuralSteinerbecause its full preprocessing/code were unavailable. Onibm01/04DSBRouterwirelength is lower than NeuralSteiner, but otherIBMcases lose;ibm03is152862versus148036. The large cases have **29.48million/24.28million**wirelength versusNeuralSteiner9.46million/9.00million, approximately3.12×/2.70×. Lower overflow therefore has a substantial detour cost (Section4.3/Table3).

**Time and ablations.** Table6DSBRoutertimes4491–11313seconds onIBMare slower than all displayed comparators. Adaptec3/4take115438/125589seconds, approximately32.1/34.9hours. Onibm01removing guidance and adding GeoSteinerrepair gives shorter WL61003but worse OF3561; removing the network gives WL75975/OF5971versus61435/1430. Increasing10→50sampling steps at64training epochs improves OF924→421while increasing WL64237→70172and time2774→10881seconds. These are multi-objective compute/quality trade-offs, not monotonic universal improvements (Tables4–6).

## Limitations

### Discussed in the Paper

Meaningful endpoint marginals and the non-monotone noise schedule complicate direct use of standard accelerated diffusion samplers. Per-step objective computation is expensive; distillation is proposed for future acceleration. Large out-of-distribution circuits produce longer wires (Sections4.3/5).

### Curator Notes

- In-loop greedy Hanan/RSTconstruction is an essential source of connectivity. Calling its output “OF-minimum RSMT”does not establish minimum wirelength or global congestion optimality. Global connectivity on a finite planar benchmark is also distinct from detailed routing under full layer/via/design-rule constraints.
- Proposition3.1is a conditional Bayesfactorization. Replacing`p(g*|xk,x{k+1})`by`p(g*|xk)`additionally requires the relevant conditional independence, not merely a denominator constant inxk. Even an exact factorization would not make finite neural sampling globally optimal or always connected (AppendixA.5).
- The rendered Eq11defines energyE=expectedOF−OF; Eq12usesexp(−E)/Z, but Eq13prints **+E−logZ**. Eq14also drops the gradient of the generally state-dependent normalizer. These printed steps do not establish the claimed exact guidance gradient; they do not by themselves invalidate reported empirical outcomes.
- Table8defines relative error(WL−LB)/LB, but theadaptec3/4entries3.15/2.73are approximatelyWL/LBrather than that error. From Table3's raw values the defined errors are approximately2.159and1.738. GeoSteiner's unconstrained wirelength lower bound is not a certified optimum for the congestion-constrained task.
- Current release guidance runs under`torch.no_grad()`and blends a reconstructed route mask toward the prediction by`t/num_timesteps`; it does not literally differentiate the printed OFenergy. Its full-circuit branch crops64×64windows, silently ignores out-of-window pins through`try/except`, and can skip a route with at least3000extracted vertices. These are concrete current-code coverage/replication risks; no blanket claim that the published experiments used every such behavior is made.

## Reproducibility

The [formal ICML2025 record](https://proceedings.mlr.press/v267/shi25k.html) givesPMLR267,pp55065–55081,issued2025-10-06. All17pages were read, including complete references, SDEconnection, guidance proof, all five algorithms and additional tables/examples. Critical equations/algorithms and negative-result tables were rendered. Publisher/event45255provide no additional scientificPDF/slides/poster file; OpenReviewRxa6fWKcesAPIreturned403.

The [author repository](https://github.com/Thinklab-SJTU/EDA-AI/tree/main/DSBRouter) was inspected from the complete2727-entry untruncated EDA-AItree/ZIPatSHAfd9d3a3df1cf53b6828528bab8925d35abdfa7c8. DSBRouter'sREADMEand inference/model/RST-reconstruction/capacity-accounting paths were read. Its only TeXdocument is a bundled third-party GeoSteinermanual, not an additional DSBRouterscientific appendix. The READMEdepends on nthu-router/HubRouterpreprocessing and external simplified-DSBtraining code; its examplelr1e−5,batch128,repeats256,50steps differs from the formal fixedlr.001,batch256,repeats4/default24inference steps. Explicit matching configuration/checkpoints are needed. No training/router benchmark was rerun.

**Internal citations.** In-text references and bibliography verify [HubRouter](hubrouter.md)(pp1–3/6–8and9), [PRNet](prnet-chip-design.md)(1–3/6–7and9), [NeuralSteiner](neuralsteiner.md)(3/5/7–8and10), and [CombOptNet](../studies/comboptnet.md)(1and10). The latter is cited for an NP-completeness discussion and is not itself a new routing result.
