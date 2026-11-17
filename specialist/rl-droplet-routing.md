---
id: rl-droplet-routing
short_title: RL Droplet Routing
title: Adaptive Droplet Routing in Digital Microfluidic Biochips Using Deep Reinforcement Learning
authors:
- Tung-Che Liang
- Zhanwei Zhong
- Yaas Bigdeli
- Tsung-Yi Ho
- Krishnendu Chakrabarty
- Richard Fair
year: 2020
date: '2020-11-21'
publication:
  date: '2020-11-21'
  source_url: https://proceedings.mlr.press/v119/liang20c.html
venue: ICML
paper_url: https://proceedings.mlr.press/v119/liang20c.html
institutions:
- Department of Electrical and Computer Engineering, Duke University
- Department of Computer Science, National Tsing Hua University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Microfluidic Droplet Routing
summary: A size-specific CNN/PPO droplet-path constructor adapts from movement feedback under hidden electrode degradation,
  with simulation and a fabricated-chip demonstration.
code_url: https://github.com/tcliang-tw/dmfb-env
figure:
  path: paper-assets/rl-droplet-routing/framework.png
  alt: Original Figure4 showing RGB camera observation, controller, neural routing action and electrode actuation.
  caption: 'Figure4: original camera/controller/neural droplet-routing feedback loop.'
  source_url: https://proceedings.mlr.press/v119/liang20c/liang20c.pdf#page=4
---

# Adaptive Droplet Routing in Digital Microfluidic Biochips Using Deep Reinforcement Learning

> **TL;DR:** A size-specific CNN/PPO policy constructs droplet paths from camera-derived grid observations and continues adapting as electrodes degrade. Simulation and a6×6 fabricated-chip example demonstrate routing adaptation; the experiments do not establish unrestricted fault tolerance or biochemical diagnostic accuracy.

## Motivation

Digital microfluidic biochips transport droplets by electrowetting on an electrode array. Repeated actuation can degrade electrodes, causing a fixed shortest route to fail. Electrode health is not directly visible from appearance, motivating feedback from actual droplet movements and online policy adaptation. [pp.1–3]

## Contributions

- A four-direction neural droplet router and Gym-compatible simulator model stochastic transport under electrode degradation.
- Healthy-device pretraining is followed by adaptation in degrading environments, with different policies trained for different chip dimensions.
- A19-routing-task nucleosome-immunoprecipitation protocol demonstrates operation on a fabricated PCB chip with one emulated degraded electrode. [pp.3–9]

## Methodology

**Observation and action.** An RGB grid records the current droplet, destination and electrodes occupied by concurrent operations. The feed-forward policy selects north/east/south/west. Boundary or occupied-cell moves leave the droplet in place. This is sequential construction of the current route, rather than editing an incumbent complete route. It remains specialist: separate models are trained for chip sizes within the same droplet-routing task. [pp.3–5,7]

**Degradation.** The formal simulator gives each affected electrode a factor τ∈[.6,1), with health d=τ^⌊n/50⌋ after n actuations. A departure from the current electrode succeeds with Bernoulli probability d; otherwise the droplet stays. Health and usage are not explicitly included in the RGB observation. The controller uses observed transition feedback and continued training, rather than receiving a perfect electrode-health map. [pp.4–5]

**Policy and reward.** The compact CNN has32/64/64 convolution channels, a256-unit fully connected layer and four actions. PPO is tested with1/2/4/8 environments and16/32/64/128/256 update steps; eight environments are selected. Reaching the destination gives+1, moving closer+.5, staying−.3 and moving farther−.8, with closeness defined as Manhattan distance in the formal description. The reward discussion motivates avoiding profitable back-and-forth motion; it is not a proof of convergence or optimal routing for arbitrary positive reward values. [pp.5–6]

## Experiments

| Setting | Reported evidence |
| --- | --- |
| Sizes | Seven arrays:5×5 through35×35 in increments of5 |
| Repetition |Three separately trained models for each size |
| Pretraining |Healthy-device simulation, compared with the static router of Zhao/Chakrabarty2012 |
| Degradation |10%,50% or90% of electrodes assigned degrading factors; ongoing adaptation |
| Metrics |Episode reward and actuation cycles per routing task |
| Physical device |6×6 PCB array; RaspberryPi3B+ controller, camera feedback,1kHz/200Vpp actuation |

**Simulation:** Healthy-device training approaches the static router's reward/shortest-path behavior on the displayed cases. The paper reports about four hours to train the20×20 model, without enough training-hardware detail for a normalized runtime comparison. During early adaptation the agent can perform slightly worse because it explores alternative paths. Benefits are strongest on the5×5 degradation examples; larger arrays often show overlapping agent/baseline curves. Supplementary figures extend the hyperparameter sweep to35×35, but their degradation-cycle panels stop at30×30. No precise universal speedup or success percentage is tabulated. [pp.6–7; supplementpp.1–3]

**Physical demonstration:** The19-task NuIP workflow is executed on a fabricated chip. Electrode(row4,column3) is deliberately driven at150Vpp to emulate degradation. The third routing task encounters failure; later tasks avoid that electrode. This is evidence of adaptation in that setup, rather than a natural-aging cohort, an unconditional all-fault guarantee or measured clinical sensitivity/specificity. [pp.8–9]

## Limitations

### Curator Notes

- **Partial observation:** RGB observations omit latent health/usage. Identical observed grids can have different next-move probabilities, so the observation alone is not a fully observed Markov state. The paper's MDP framing should be read with this qualification; online adaptation is substantive, not a fixed pretrained guarantee.
- **Current simulator differences:** The release uses an obstacle-aware BFS distance map for reward rather than literal Manhattan distance when obstacles require detours. Health is updated on episode reset when usage is strictly greater than50, rather than applying τ^⌊n/50⌋ at every step; degradation also stops once more than two electrodes have health below.1. These are version/protocol qualifications, not proof that the reported experiments are invalid.
- **Budgets and defaults:** Formal text calls an epoch20,000 games, while the release calls `learn(total_timesteps=20000)`; those units differ. The example launcher runs15×15, one environment,64 update steps and degrading mode, whereas the described selected setting uses eight environments and healthy pretraining. The release's unused random-start branch contains a `repeate` typo. No historical PPO run was replayed.
- The published reward/actuation curves and one fabricated-chip demonstration do not establish robustness for all degradation distributions, simultaneous multi-droplet planning or all bioassays. Chip control and assay validation remain separate concerns.

## Reproducibility

- **Publication:** [ICML2020 / PMLR119](https://proceedings.mlr.press/v119/liang20c.html), publisher metadata2020-11-21; all six authors and the Duke ECE/NationalTsingHua CS affiliations match the formal first page.
- **Full text:** All11 formal pages and the separately linked three-page scientific supplement were freshly read, including both complete bibliographies. Page6's excessive PDF text layer was reviewed using the complete rendered page and its body text. All nine main figures, the architecture table and all four supplementary figures were visually inspected.
- **Companions:** Both official event entries6330/53759 identify the paper but expose no additional downloadable scientific attachment. The main/supplement reference points to an author GoogleDrive video folder that returned404 during this audit; those videos were not read or counted as evidence. The repository's22-frame animated routing example was fully decoded and every frame viewed; it is an illustration, not a replacement for the missing experiment videos.
- **Code:** [Author Gym simulator](https://github.com/tcliang-tw/dmfb-env), untruncated15-entry treed8c50128ef78c990268697f6c0bb2435c1c26fb1 and16-member917,538-byte ZIP, without scientific PDFs/notebooks/archives or pretrained neural weights. README, CNN, training/evaluation, complete environment and static-router implementation were read.
- **Local check:** Original observation/health-update methods were executed in isolation: health1 versus.2 gives identical RGB;50 uses leaves health1 and51 uses changes it to.6. This confirms the stated release semantics only, without training a router or rerunning the bioassay.
- **Figure:** Original Figure4 and its complete caption show the camera/controller/policy/actuation feedback loop.
- **Graph:** Neither complete bibliography cites a paper in the frozen364-entry catalogue; no similarity-based edge was invented.
