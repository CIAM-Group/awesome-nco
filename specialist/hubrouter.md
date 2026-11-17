---
id: hubrouter
short_title: HubRouter
title: 'HubRouter: Learning Global Routing via Hub Generation and Pin-hub Connection'
authors:
- Xingbo Du
- Chonghua Wang
- Ruizhe Zhong
- Junchi Yan
year: 2023
date: '2023-12-15'
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/f7f98663c516fceb582354ee2d9d274d-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/f7f98663c516fceb582354ee2d9d274d-Abstract-Conference.html
institutions:
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Global Routing
- Rectilinear Steiner Minimum Tree
summary: Conditional hub/stripe generation followed by new pin–hub tree construction achieves connected global routes,
  with variant-specific quality/runtime and rerouting limits.
code_url: https://github.com/Thinklab-SJTU/EDA-AI/tree/main/HubRouter
---

# HubRouter: Learning Global Routing via Hub Generation and Pin-hub Connection

> **TL;DR:** A conditional generator predicts sparse route hubs, then a separate connectivity constructor joins hubs and original pins. Route/stripe-mask auxiliary outputs suppress harmful noise. Connectedness comes from the second stage; quality/runtime vary substantially between GAN,VAEand diffusion, and complete global routing is distinct from detailed routing or zero-overflow certification.

## Motivation

One-shot route images often miss a few pixels and disconnect pins. HubRouterchanges the intermediate representation to endpoints, turns and branching/crossing points, allowing a separate tree constructor to enforce connectivity without exhaustively repairing pixel paths (Sections1–3).

## Contributions

- A hub definition captures key pixels of rectilinear routes.
- Joint hub/route/stripe-mask generation supports three separate GAN,VAEand diffusion embodiments.
- A pin–hub connection stage, benchmark comparisons, component ablations and additional RSMT/replanning studies evaluate the two-phase scheme (Sections3–4/AppendicesA–E).

## Methodology

**Task/representation.** Global routing connects already placed pins on a planar capacity grid, trading wirelength against overflow. Each64×64condition image has pin locations and horizontal/vertical capacity. A hub is a routed endpoint, right-angle turn, Tjunction or crossing; a routed straight degree-two pixel is omitted. The generator outputs hubs plus an auxiliary route and stripe mask. Averaged row/column stripe scores remove isolated hub noise; the auxiliary route is not itself the final routing (Sections2–3.1).

**Connection.** Generated hubs are united with **original pins** before connection. Following REST, an attention actor sequentially creates a valid rectilinear edge sequence(RES), with a critic predicting tree length for a policy-gradient baseline. Eight geometric transformations yield candidates and the shortest is retained. This constructs a connected rectilinear tree over the supplied points; it does not guarantee congestion feasibility or minimum length. Incorrect extra hubs can force detours even when connectivity holds (Section3.2/Algorithm3).

**Training and theoretical scope.** The image generator is trained on expert routes; the actor/critic train separately on random point sets. GANadversarial, VAEreconstruction/KLand diffusion noise-prediction objectives are distinct models, not one ensemble checkpoint. TheO(nlogn)reconstruction remark assumes **the complete correct hubs of an RSMT**are already supplied, allowing a rectilinear spanning-tree reconstruction. It is not the runtime or approximation guarantee for arbitrary predicted hubs, the entire image pipeline or the original congestion-constrained optimization problem (Section3/AppendicesB–C).

**Classification.** Specialist / constructive: the pipeline generates hubs and constructs new connections. The interactive replanning figure adds user-specified points and reconstructs a tree; it is not evidence of a trained incumbent-edit policy. Extra RSMTexperiments do not establish one unchanged cross-native neural model: the released RSMTgenerator uses a separate one-channel configuration/checkpoint from the three-channel routing model. The displayed capabilities remain explicit without inferring generalist weights (Section4.4/inference/configuration code).

## Experiments

**Data and budget.** Nearly240kexamples are generated with NCTU-GRfrom fourISPD07training circuits. Four held-out groups distinguish at-most/fewer-than-or-equal-four pins andHPWL≤/>16, with10kexamples per group. Full-circuit tests include sixIBMISPD98circuits and10random cases each on8×8/16×16grids. Images are cropped/padded; less than.1%oversizedISPD98nets are split. Three seeds run on ani9-10920X/RTX3090/128GBmachine. Validation searches architecture/rate/DDIMsettings; the chosen DPMuses50DDIMsteps, maximum500and guidance1.5 (Section4.1/AppendicesD–E).

**Connectivity and quality exceptions.** Table2reports1.000connectedness for all HubRoutervariants/groups, versusPRNet.806/.334/.196/.040. These are fractions despite a percent label. PRNetWLRcounts only connected cases, and its difficult-group WLRis omitted. GANHubRouterWLR1.011/1.002/1.005/1.001is strong; VAEand diffusion can be much worse, e.g.DPM1.242onlarge routes. Table2times are **generation-only**, excluding the subsequent connection stage (Tables2/4).

**Full routing trade-offs.** GANhas lowest displayed IBMwirelength means on five of sixcircuits, butibm05BoxRouter410614beatsGAN411857. Diffusion has the shortestGRLwirelength but costs37/53.90seconds, whereas classical methods take under1second. VAEis the fastest learned model inTable3but its IBMwirelengths are worse thanPRNetand classicalBoxRouter. GAN41.02–88.02seconds is slower than classical comparators across theIBMtable. Diffusion takes1796–4965seconds and is much slower thanPRNet. Thus generative variants offer different speed/quality compromises, rather than every variant dominating every baseline (Table3).

**Overflow, RSMTand ablations.** The reported OFcomparison concerns **initialized overflow**; further reduction requires rerouting, explicitly listed as a limitation. Adding auxiliary route and stripe outputs reduces ablation WLR1.031→1.022→1.005. Eight transformations beat one transformation(1.005versus1.087). On separate pureRSMTtests, HubRoutererrors fall from.24%atdegree5to.06%at50, outperformingRESTatdegrees30–50but losing toFLUTE/RESTon smaller degrees. RESTis faster throughout; GeoSteineris both exact and faster atdegrees5–15. Interactive replanning is illustrated visually without an independent quantitative navigation benchmark (Sections4.3–4.4/Tables4–5).

## Limitations

### Discussed in the Paper

Discretization prevents joint differentiable training of both stages. Supervised hub generation needs many expert examples; bad hubs hurt routing. Large models/diffusion consume substantial compute, and final overflow reduction still needs rerouting (Section5).

### Curator Notes

- Tree connectivity is conditional on retaining original pins and a valid connection construction. It is distinct from exact capacity compliance, layer/via design rules, downstream detailed routing and a minimum-wirelength certificate. The correct-hub theoretical case does not prove neural hub prediction is correct.
- Hubs do not uniquely specify routes: Table7shows exact reconstruction correspondence only48.75%forlarge routes, despite low imageMSE. Pixel error is not by itself an optimization-quality certificate.
- Printed actorEq2/Algorithm2use a baseline-minus-length/probability expression. The inspected implementation instead minimizes **(length−baseline)·logprob**, the usual cost-minimizing score-function loss. Printed VAEequations also mix posterior/prior and minimize an expression described as an ELBO; the release minimizes positive reconstruction/focal losses plus positiveKL. These are precise formal/release distinctions, not a result rerun.
- AppendixTable8relative errors do not consistently matchTable3's rawWL/printed lower bounds. For example, GANibm02gives(167545−165863)/165863≈.0101, whileTable8prints.028. The latter table is therefore not used to assert exact gaps. Table9phase-time sums also differ fromTable3totals; no artificial exact decomposition is inferred.
- Current publicIBM/ISPDbranches call **GeoSteiner**to connect generated points; theREST-specific branch loads the actor and performs8transforms. Its separateGAN-RESTconfiguration/checkpoint also precludes assuming a zero-shot unchanged global-routing generator for the pureRSMTtable. Formal actor-based descriptions and this code snapshot must be distinguished.

## Reproducibility

The [formal NeurIPS2023 record](https://proceedings.neurips.cc/paper_files/paper/2023/hash/f7f98663c516fceb582354ee2d9d274d-Abstract-Conference.html) givesvolume36,pp78558–78579,DOI10.52202/075280-3435,issued2023-12-15. All22formal pages and10official slides were read, including complete references, every algorithm/proof/table and supplemental examples. The officialposter70927was visually read; key equations, negative-result tables and slide figures were rendered. OpenReviewf0Jj3C3PnpAPIreturned403; the publisher exposes no additional scientific supplement.

The [author implementation](https://github.com/Thinklab-SJTU/EDA-AI/tree/main/HubRouter) was inspected from the complete2727-entry EDA-AItree/ZIPatSHAfd9d3a3df1cf53b6828528bab8925d35abdfa7c8. README, inference/checkpoint paths, routing-vs-RSMTconfigs, actor/criticloss, VAEand RESdecoding were examined. The subtree has no additional scientificPDF/notebook; its TeXmanual belongs to bundled third-partyGeoSteiner. Expert-data preprocessing and external compiled evaluation tools are prerequisites. No model training or routing benchmark was rerun.

**Internal citations.** Explicit text and full references verify [PRNet](prnet-chip-design.md)[6] (main PDFpp1–10/14/18; bibliography p11), [DeepPlace/DeepPR](deepplace-deeppr.md)[7] (main PDFpp1/11), [MaskPlace](maskplace.md)[28] (main PDFpp2/12), and [T2T](t2t.md)[29] (main PDFpp14/12). The T2Tbibliography omits its short prefix but matches all four authors, full remaining title and2023NeurIPSidentity.
