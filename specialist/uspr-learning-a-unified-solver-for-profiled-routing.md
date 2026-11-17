---
id: uspr-learning-a-unified-solver-for-profiled-routing
short_title: USPR
title: 'USPR: Learning a Unified Solver for Profiled Routing'
authors:
- Chuanbo Hua
- Federico Berto
- Zhikai Zhao
- Jiwoo Son
- Changhyun Kwon
- Jinkyoo Park
year: 2026
date: '2025-05-08'
publication:
  date: '2026-03-14'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/41025
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/41025
institutions:
- Korea Advanced Institute of Science and Technology
- Radical Numerics
- OMELET
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Profiled Vehicle Routing Problem
summary: A parallel autoregressive PVRP constructor conditions on client–vehicle profiles and preference weights
  through dedicated embeddings, bidirectional attention and logit reshaping; one checkpoint handles profile distributions,
  with remaining heuristic-reference gaps and unavailable implementation details.
arxiv_url: https://arxiv.org/abs/2505.05119
code_url: https://github.com/ai4co/uspr
figure:
  path: paper-assets/uspr-learning-a-unified-solver-for-profiled-routing/framework.png
  alt: Profile, client, vehicle and weight embeddings feed four attention relations, communicating vehicle decoders,
    score reshaping and priority-based conflict resolution.
  caption: 'Figure 2: USPR parallel profile-conditioned route construction.'
  source_url: https://arxiv.org/pdf/2505.05119v2#page=4
---

# USPR: Learning a Unified Solver for Profiled Routing

> **TL;DR:** USPR constructs routes in parallel for vehicles with client-specific preferences and access restrictions. A single policy is conditioned on the preference weight and profile matrix. Its demonstrated unification is across **PVRP settings**, supporting **specialist/constructive** scope here; it is not evidence of one checkpoint jointly solving unrelated native optimization tasks.

## Motivation

Vehicle–client compatibility can reflect geographic restrictions, service preferences or specialized vehicles. A policy trained separately for every preference weight is expensive to maintain and may transfer poorly when profile distributions or instance sizes change. USPR incorporates these relationships into a shared routing policy instead of treating vehicle identity only as a capacity/speed feature. [Introduction/related work.](https://arxiv.org/pdf/2505.05119v2#page=1)

## Contributions

- Profile embeddings encode customer, vehicle, preference-matrix and global-weight inputs, including separate representations for hard restrictions.
- Multi-head profiled attention combines customer–customer, vehicle–vehicle and both directions of vehicle–customer interaction.
- Profile-aware score reshaping supplements neural logits with explicit spatial/profile information.
- Shared-weight training and evaluations compare profile-conditioned construction with PVRP-adapted neural baselines and classical heuristics, including larger synthetic instances and CVRPLib-derived locations.

## Methodology

### Problem and construction process

PVRP assigns every client to service routes while balancing travel duration against a vehicle–client profile reward. Client inputs contain coordinates and demand; vehicle inputs include capacity, speed and start position. The conceptual profile value is finite for a soft preference, negative infinity for a forbidden assignment and positive infinity for a mandatory assignment. The scalar alpha weights preference reward relative to duration. Zero profiles recover the duration-based CVRP case. This represents a parameterized family of PVRP settings, rather than independently demonstrated multi-task training across CVRP, time-window routing, pickup-and-delivery and other native tasks. [Formulation.](https://arxiv.org/pdf/2505.05119v2#page=3)

The encoder projects these inputs and alpha into 128-dimensional representations and exchanges information through four attention relations. Each vehicle has a decoder query formed from its encoded context, current node and dynamic state. A communication layer processes the vehicle queries, and multiple pointers propose the next customers in parallel. When vehicles propose the same client, the largest log-probability receives priority. Feasibility masks and deterministic state updates track served clients and capacity. The supplementary MDP permits returning to the depot and resetting capacity for another route segment. No learned operator takes an existing complete solution and rewrites its routes: the neural solver is constructive. [Figure 2/equations 2–7/MDP.](https://arxiv.org/pdf/2505.05119v2#page=4)

### Profiles, reshaping and training

Finite profile scores use a linear embedding, while positive/negative infinity receive distinct parameterized embeddings. Separate alpha embeddings allow the same policy to change its preference–duration trade-off. The score-reshaping rule combines the learned pointer score with a hand-designed distance/profile term before tanh clipping, masking and softmax. The paper uses both PSR and the inconsistent acronym PAR for this component; the note follows the main PSR name.

Training uses REINFORCE with a shared baseline and eight symmetry-augmented rollouts per instance. Main experiments sample alpha in [0,.2] and random profile/hard-constraint patterns rather than training one model per fixed alpha. Generic formulation/training discussion also mentions [0,1]; this broader mathematical range should not be confused with the main training distribution. Test-time conditioning changes inputs, not network weights or incumbent solutions. [Training and supplementary configuration.](https://arxiv.org/pdf/2505.05119v2#page=5)

### Printed-formulation boundaries

The displayed supplementary integer program is incomplete as a standalone solver specification: the assignment variables are not explicitly linked to routing variables; conservation alone does not eliminate disconnected cycles; and explicit mandatory/forbidden-assignment constraints are absent. For example, all routing variables can be zero while assignment variables still satisfy the displayed once-per-client condition. Its capacity inequality is per vehicle across the whole edge set, whereas the MDP resets capacity on depot returns. Consequently, the MDP's practical routing semantics must be distinguished from that printed program. These observations concern the written formulation; they do not establish infeasibility of the reported decoder outputs. [Supplementary constraints and MDP.](https://arxiv.org/pdf/2505.05119v2#page=12)

Equation 5 also needs implementation clarification. As printed, subtracting log(distance + profile score) reduces the logit when a positive preference increases at fixed distance, despite the earlier interpretation that a higher score is desirable. Negative/infinite raw profile values additionally require a transformation or masking convention not specified in that equation. The inaccessible implementation prevents independently resolving these details; a silently corrected formula is not substituted for the authors' expression.

## Experiments

### Budgets and data

Training is 100 epochs ×100,000 sampled instances, batch32, Adam initially1e-4 with tenfold decays at epochs80/95. The network has three encoder layers, eight heads and feed-forward width512. Training varies60–100 clients and3–7 vehicles. Synthetic coordinates and soft preferences are uniform on[0,1], demands are integer1–9, the main100-client setting uses capacity40 and speed1, and random hard-constraint probabilities lie in[0,.1]. An angular-sector generator supplies zone restrictions. These specific synthetic choices do not constitute arbitrary real access policies. [Main setup/Table 6.](https://arxiv.org/pdf/2505.05119v2#page=6)

The reported machine is an AMD Ryzen Threadripper3960X CPU and RTX4090 GPU. In-distribution tests use1,280 instances per size; larger tests use128. Greedy and sampling results are distinct: sampling chooses the best of1,280 solutions per instance. Classical reference columns allow10/12/15 minutes for the small sizes and15 minutes for larger sizes, while neural times are reported per instance; they are different budgets, not equal-time optimality comparisons. PVRPLib preserves CVRPLib geometry/capacity/fleet information but adds generated preferences and restrictions, so it is a modified benchmark rather than observed real driver preferences.

### Results and qualifications

Table1 gives USPR average gaps of9.20% greedy and4.02% sampling to HGS-PyVRP across60/80/100 clients and3/5/7 vehicles. CAMP's corresponding gaps are10.50%/4.58%. USPR's reported small-instance times are.11–.20s greedy and.22–.42s sampling. USPR has the lowest cost among the listed neural methods in those columns, but HGS remains the reference with lower cost. Individual USPR cells also do not all beat OR-Tools: for example,100 clients/five vehicles has11.44 greedy versus OR-Tools11.41. [Table1.](https://arxiv.org/pdf/2505.05119v2#page=6)

The1,000-client table with30/50/70 vehicles reports19.35% greedy and14.15% sampled gaps to HGS, versus CAMP23.72%/23.44%; the displayed USPR times are1.07s/1.18s. Supplementary200/500-client sampling gaps are12.03%/12.97%. Thus the data support improvement over these neural baselines and often OR-Tools under the listed protocols, not general equivalence to or superiority over classical search. The setup prose mentions500 clients and15/25/35 vehicles; that corresponds to the supplementary500-client table and differs from main Table3's1,000-client setting. [Tables3/8/9.](https://arxiv.org/pdf/2505.05119v2#page=7)

On CVRPLib-derived PVRPLib groups, USPR's reported gaps are5.19%/5.21%/6.62%/13.46%/5.06% on setsA/B/F/M/P, and8.72–15.21% over the four increasing Set-X size groups. The largest group's CAMP25.77% versus USPR15.21% is a10.56 percentage-point gap reduction; it is not a10.56% reduction in solution cost. Best-known values come from HGS, not proven optima. [Table4.](https://arxiv.org/pdf/2505.05119v2#page=7)

The ablation gap increases from4.42% to4.72% without PSR,5.12% without both profile and spatial reshaping, and6.72% after also removing MHPA. These nested removals do not independently isolate every possible interaction. Figure3 illustrates the same instance as alpha grows: duration rises from14.07 to17.09 and preference from8 to100, demonstrating a trade-off rather than universal duration improvement. [Table5/Figure3.](https://arxiv.org/pdf/2505.05119v2#page=7)

The efficiency table compares one1.5M-parameter USPR model/100 epochs/11hours with ten CAMP models/17.6M total parameters/1,000 total epochs/4.6days. This is a portfolio-versus-single-model comparison, not a tenfold reduction of the size of each individual network. Moreover, the stated fixed-alpha grid0,.025,…,.20 contains nine values, whereas that table says ten CAMP models; the discrepancy remains unresolved.

## Limitations

The approach has no optimality guarantee, and heuristic-reference gaps remain significant on large problems. Reported speed/quality advantages use different neural sampling and classical search budgets. Results do not demonstrate arbitrary preference magnitudes, all possible mandatory-assignment combinations or operational deployment. Random positive-infinity assignments would require compatibility handling if multiple vehicles become mandatory for one client; the available text does not fully specify that generation safeguard.

The dense profile representation becomes memory-intensive at extremely large sizes; the authors specifically identify10,000-plus nodes as a limitation. The printed objective/constraints, score sign/nonfinite handling, alpha-grid count and scale descriptions need reconciliation for independent reproduction. None of these local reporting limitations is expanded into a claim that all empirical outcomes are false. Confidence intervals, independent run counts and every stochastic comparison's significance are not established by the displayed tables.

## Reproducibility

- The actual fully read source is **arXiv2505.05119v2,2025-08-25,16 pages**, including all references and supplementary formulations/configurations/results. The primary history gives v1 as2025-05-08. Formal AAAI2026 DOI10.1609/aaai.v40i43.41025 has publisher-deposited publication2026-03-14 and pages36973–36981; that date is separate from arXiv posting and the January conference.
- The formal byline has six authors, with Hua and Berto contributing equally, and affiliations KAIST/Radical Numerics/OMELET. The actually read arXiv byline uses KAIST/OMELET and an AI4CO-community contribution footnote. This version-specific affiliation difference is preserved; formal PDF byte identity is not claimed.
- The official proceedings index supplies the PDF link; the retrieved OJS requests return a challenge/error response. The formal PDF's indexed first page explicitly identifies the arXiv URL as the extended version. All scientific supplementary sections present in that version were read. No separate scientific archive was named or found in the checked official repository.
- [Official repository](https://github.com/ai4co/uspr), main SHA`95cef9fff6be8c73e4c840c91dde0e4833cc2bc2`, currently contains **only LICENSE**. Manual branch/tag/release checks find one main branch and no releases/tags. A linked repository is therefore recorded, but source code, checkpoints, data generation and paper-table reproduction are not claimed to be available or executed.
- The complete original Figure2 is cropped from PDFpage4, rectangle(46,48,563,302), at4× resolution and visually checked. The original formulas, main result/ablation tables and all supplementary tables were also rendered and inspected.
- Internal edges require an explicit body citation and matching bibliography identity. Cited preprint years/titles and printed year mistakes are retained in evidence. RL4CO's cited shorter author list matches its official repository citation; its formal DOI represents the same benchmark, without rewriting the source's list. Works absent from the catalog are not forced onto similar-title targets.
