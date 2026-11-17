---
id: genco
short_title: GenCO
title: 'GenCO: Generating Diverse Designs with Combinatorial Constraints'
authors:
- Aaron M Ferber
- Arman Zharmagambetov
- Taoan Huang
- Bistra Dilkina
- Yuandong Tian
year: 2024
date: '2024-07-08'
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/ferber24a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v235/ferber24a.html
institutions:
- University of Southern California
- Cornell University
- Meta FAIR
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Constrained Design
problems:
- Game Level Generation
- Path Planning
- Photonic Design
summary: GenCO trains task-specific generative models through combinatorial solvers,
  combining distribution matching with design objectives; feasibility is conditional
  on encoded constraints and valid solver outputs.
---

# GenCO: Generating Diverse Designs with Combinatorial Constraints

> **TL;DR:** Generate latent objective coefficients, call a combinatorial solver, and train the generator with a population-level generative loss plus an optional individual design loss. Solver outputs enforce the encoded constraints. The three applications use separate networks and solvers; they do not demonstrate a shared cross-task checkpoint.

## Motivation

An unconstrained GAN or VAE can resemble the training distribution while producing invalid designs. Repair after generation can collapse many distinct continuous outputs onto the same feasible object. Penalty losses may encourage constraints without ensuring them. GenCO instead places a combinatorial solver inside the trained forward pipeline so the generator learns how its outputs are transformed into valid designs (Sections 1-2).

## Contributions

The framework couples a neural generator with a solver-compatible latent design space, population losses that encourage realistic/diverse designs, and optional differentiable nonlinear objectives. It instantiates GAN-based game-level generation, GAN-based map generation for shortest paths, and VQVAE-based photonic-device design. The principal contribution is this generative training formulation, building on differentiable optimization and SurCo, rather than a new exact algorithm for nonlinear combinatorial optimization.

This is a specialist constructive framework: Zelda, Warcraft and photonics have separately configured models, losses and feasibility oracles. Reusing the formulation across tasks is different from solving them with the same trained neural checkpoint (Table 2).

## Methodology

A generator maps noise to coefficients c. A solver g maps those coefficients to x in an encoded feasible set Omega, for example by minimizing a linear objective over an ILP. Training minimizes a group loss L on generated solutions plus a weighted sum of individual losses D. WGAN discrimination or VQVAE reconstruction supplies the group term; a path cost or differentiable Maxwell simulation supplies application-specific individual objectives. Approximate black-box differentiation or identity-with-projection propagates updates through the discrete solver. These are useful surrogate backward passes, not an everywhere exact classical derivative of discrete argmin (Equations 2-4; Algorithm 1).

The assumptions include a well-defined solver on generated inputs, feasible returned solutions, a usable gradient or estimator for the individual loss, and a group loss suitable for stochastic optimization. Hard feasibility concerns the constraints actually represented by Omega. Neither the outer nonconvex training nor nonlinear design optimality receives a general global guarantee. Solver calls remain necessary during training and generation.

**Map-generation exception.** For Warcraft, the generated object c is an unconstrained RGB map. A fixed ResNet maps it to costs and a shortest-path solver returns a valid path x. The group loss is L(c), on maps, whereas the individual path objective depends on g(c). Thus the article's general description of losses on feasible solutions has this explicitly stated exception; the method does not impose combinatorial validity constraints on the RGB image itself (Table 2; Section 4.3; Appendix A).

## Experiments

**Zelda.** The training set has 50 human-created levels. An ILP ensures the generated level permits the player to collect the key and reach the exit. The repair baseline and GenCO variants all obtain feasible levels. Among 1,000 generated levels, GAN plus MILP repair gives 520 unique outputs, fixed-adversary GenCO 220, and updated-adversary GenCO 995. Updated GenCO improves this uniqueness metric but does not dominate density/coverage: coverage is 0.82 versus the baseline's 0.94 and fixed-adversary 0.98. Discriminator losses are distributional proxies, not a human assessment of enjoyment (Section 4.2; Table 3).

**Warcraft maps.** ResNet18's first five layers are pretrained on 10,000 labeled 12-by-12 terrain grids for 75 epochs, then held fixed to map 96-by-96 RGB images to solver costs. Evaluation uses these predicted costs rather than ground-truth terrain costs. On 100 generated maps, GenCO reduces average shortest-path loss from 36.45 for the ordinary GAN to 23.99. Density changes from 0.81 to 0.94 and coverage from 0.98 to 0.93. The comparator called semantic loss averages predicted cell costs; it is not the exact logical-circuit semantic-loss method. A larger objective weight can collapse generation to blank maps: at gamma=0.01, path loss, density and coverage are all reported as zero (Tables 4-5; Appendix A).

**Photonics.** A domain-specific solver enforces manufacturing constraints on binary material/void layouts, including brush/die feasibility. A differentiable Maxwell objective evaluates the resulting device. Training uses 100 high-quality designs obtained through expensive SurCo optimization; 1,000 generated feasible devices are evaluated. Reconstruction plus objective training yields 100% unique outputs, density 0.153, coverage 0.738 and reported mean solution loss 0. The postprocessing baseline gives 30.6% unique outputs and loss 1.244. Objective-only training also reports zero mean loss but only 46.6% uniqueness, illustrating the distribution/quality tradeoff. These finite-sample, rounded table results do not certify every possible generated design or arbitrary unseen photonic specifications (Table 6).

## Limitations

The guarantee inherits the encoded feasible set and the solver's valid-return behavior. It does not cover omitted physical requirements, learned cost accuracy, aesthetics or arbitrary social constraints. Solver cost and differentiable-solver coverage limit scalability. Approximate backward passes and nonconvex generative training provide no general convergence, global nonlinear optimum or complete distribution-coverage guarantee. Diversity/quality metrics trade off, and the fixed-adversary Zelda result demonstrates that training through a solver alone need not improve uniqueness.

### Curator Notes

Table 1 labels GenCO fast, but its pseudocode still calls a solver for each generated latent input; this is not solver-free neural inference or a general measured speedup over MILP. Appendix C describes maximizing combined losses while Algorithm 4 minimizes its positive reconstruction/quantization/objective sum, and changes argmin/argmax and coefficient symbols across the pseudocode. These printed objective/sign conventions need clarification for reproduction; they do not establish that the reported experiments used an incorrect implementation (PDF pages 14-15).

## Reproducibility

- All fifteen pages of the [formal ICML 2024 article](https://raw.githubusercontent.com/mlresearch/v235/main/assets/ferber24a/ferber24a.pdf) were read, including complete references and scientific Appendices A-C. Eight method/result/appendix pages were visually inspected. The publisher verifies the five authors, PMLR235:13445-13459, and publication metadata date July 8, 2024; the conference itself ran July21-27. Affiliations are USC, Cornell and Meta FAIR.
- The [publisher page](https://proceedings.mlr.press/v235/ferber24a.html) links the article and OpenReview, with no separate scientific supplement. Both OpenReview notes APIs for `DiyE6OOGBa` returned403 and the public forum presented a verification challenge. No missing separate scientific document is explicitly referenced by the complete article. Appendices are integrated in the fifteen-page PDF.
- No author implementation URL was verified in the article or accessible primary publication links. No generator training, solver experiment, Maxwell simulation or table result was rerun. 8 exact citations to papers already in this collection are recorded with body and bibliography page evidence.
