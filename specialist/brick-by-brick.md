---
id: brick-by-brick
short_title: Brick-by-Brick
title: 'Brick-by-Brick: Combinatorial Construction with Deep Reinforcement Learning'
authors:
- Hyunsoo Chung
- Jungtaek Kim
- Boris Knyazev
- Jinhwi Lee
- Graham W. Taylor
- Jaesik Park
- Minsu Cho
year: 2021
date: '2021-12-06'
publication:
  date: '2021-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2021/hash/2d4027d6df9c0256b8d4474ce88f8c88-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2021/hash/2d4027d6df9c0256b8d4474ce88f8c88-Abstract.html
institutions:
- POSTECH
- University of Guelph
- Vector Institute
- POSCO
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Planning
problems:
- Combinatorial Construction
summary: Image-conditioned PPO assembles connected nonoverlapping2x4bricks through pivot/offset decisions; a pretrained
  graph validity predictor masks many invalid actions within fixed construction budgets.
code_url: https://github.com/POSTECH-CVLab/Brick-by-Brick
---

# Brick-by-Brick: Combinatorial Construction with Deep Reinforcement Learning

> **TL;DR:** A graph actor-critic assembles a target shape one brick at a time from binary image views. A separate validity predictor reduces costly collision checking, but can miss invalid actions. Experiments demonstrate bounded, separately trained construction tasks rather than arbitrary-scale or cross-task checkpoint solving.

## Motivation

Constructing a connected3Dobject from2Dviews requires choosing a long sequence of discrete placements while preventing overlapping bricks. The number of candidate pivot/offset combinations grows as construction progresses, and enumerating all valid attachments becomes expensive. The paper introduces this task using homogeneous2x4bricks and develops a sequential image-conditioned policy without ground-truth assembly-sequence supervision (Sections1-2).

## Contributions

Brick-by-Brick combines graph-structured partial constructions, factorized pivot/offset actions, CNN target-image features and PPO. A separately pretrained GNN predicts action validity from the current construction and can be reused across the construction scenarios. The paper evaluates MNIST-derived shapes, randomly assembled objects and selected ModelNet categories, with separate train/test target instances and feature/validity ablations.

The paper remains **specialist/constructive**. Reusing a validity classifier or architecture across scenarios does not establish a shared image-conditioned solver checkpoint across native problems. Figure4 explicitly uses separately trained MNIST class models; the supplement evaluates category-specific benchmarks and configured action subsets. Construction adds a brick to the partial structure rather than revising a complete incumbent.

## Methodology

Each brick has an integer3Dposition and one of two axis-aligned orientations. The graph stores brick poses and bidirectional stud-contact edges with relative-pose features. A decision first chooses an existing pivot brick, then a relative attachment offset. The full homogeneous-brick setup permits at most92offsets, but experiments restrict these substantially. New nodes and contact edges update the state deterministically (PDF3-5).

A CNN encodes one binary image or concatenates separately encoded views. Target features condition node/edge MLPs and separate pivot/offset GNNs. Their pooled features and the target feed the value network. A separate target-independent GNN, trained with oracle validity labels from randomly assembled structures, predicts pivot/offset masks. Softmax probabilities are renormalized after masking. If an invalid action survives the predicted mask and is selected, the episode terminates; this is a learned filter, not a feasibility certificate (PDF5-6).

The printed reward is the change in volumetric intersection-over-union, gated to zero when the newly placed brick has insufficient target overlap. Although policy input is image based, computing this training reward requires the complete target voxel representation. The brick budget also depends on the target. With the overlap gate and discounting, maximizing discounted reward is not automatically identical to maximizing terminal IoU. PPO uses clipped policy updates and a learned value baseline; no global optimality or convergence theorem is supplied.

The finite implementations pad pivot outputs to Nmax45for MNIST/random assembly and70for ModelNet. MNIST uses six offsets, gamma0.5and300,000training timesteps; other benchmarks use gamma0.75and500,000timesteps. The common settings include eight environments, learning rate0.0001,512steps per rollout, six update epochs and32minibatches. The reported hidden dimensions are64for MNIST and192otherwise. Thus the approach handles a varying number of currently assembled bricks within configured maxima, not an unbounded output space (Supplement2-4/7).

## Experiments

**Targets and information budgets.** Each MNIST class supplies400training and100test images. Images are binarized/downsampled and expanded into a volumetric target; class-specific policies construct held-out images. Random-assembly targets contain10-15bricks with16top-only offsets, using800training and200test objects and three14x14views. ModelNet experiments select airplane, monitor and table shapes requiring fewer than60bricks, use three views and32above/below offsets. These are controlled primitive/action subsets, not all possible LEGO shapes (PDF8-9; Supplement2-4).

**Construction quality.** Main curves and additional category plots average three random seeds. GNN policies outperform their MLP counterparts on several MNIST/ModelNet cases, but random assembly has comparable GNN/MLP returns and Bayesian optimization performs slightly better. The Bayesian baseline has access to exact target volume at both training and test, while the neural policy sees images; it uses five initialization points and ten acquisition steps per construction step. Supervised imitation of one assembly sequence is tested only on random assembly and generalizes poorly there. These comparisons retain different information and computation budgets (PDF6-9; Supplement3-6).

Qualitative results show recognizable digit/airplane/monitor/table structures while missing some fine parts. Limited views can be intrinsically ambiguous: two- and four-legged tables may produce the same three input views. A matching projection therefore does not imply unique or correct hidden3Dgeometry. The authors explicitly discuss this limitation (PDF9; Supplement5/8).

**Validity prediction.** The validity dataset has200,000training constructions with1-20bricks and30,000test constructions with1-30bricks. At threshold0.5, the pretrained model's test pivot precision/recall are0.9909/0.9944and offset precision/recall0.9125/0.9661. It outperforms several feature ablations and the jointly trained alternative in important metrics, but does not dominate every recall entry: the no-edge test offset recall is0.9672. The reported oracle-validity computation exceeds20seconds at100bricks; that timing plot uses ten repetitions with bands labeled±1.96standard deviation, not standard error. It does not provide an end-to-end neural speedup ratio (PDF7; Supplement1-2).

All experiments use an i7-6850K and two Titan X Pascal GPUs on Ubuntu16.04. Supplementary plots cover the other nine MNIST classes, remaining ModelNet categories, node/edge ablations and unseen-target constructions. Performance is mainly presented as return curves and qualitative geometry; the plots should not be converted into invented exact numerical final-IoU tables.

## Limitations

The primitive is homogeneous and axis aligned, with discrete attachment subsets and predefined construction limits. The learned validity model permits errors; masking can also remove useful actions. Neither learned masking nor geometric connectivity alone proves physical stability under gravity, robotic executability or structural load safety. Image ambiguity and restricted action sets limit reconstruction accuracy. The formulation depends on volumetric training rewards and target-dependent budgets despite incomplete policy observations, and the published tests do not demonstrate arbitrary categories, arbitrary bricks or a universal checkpoint.

### Curator Notes

The current public release is an incomplete reproduction artifact. Its README says it is under construction; the85-file tree has MNIST environments/training plus artificial-object policy classes, but no complete ModelNet environment/pipeline, benchmark datasets or pretrained checkpoints. The supplied MNIST shell command uses rollout32and entropy coefficient0.02, compared with512/0.01in Supplement TableS3.

More materially, the selected shell environment's `calculate_reward` computes delta-IoU internally but returns newly covered target voxels divided by8when that count is at least4(`lego_env_mnist_no_mask.py:354-375`). This differs from the printed gated delta-IoU. Executing that original method on a synthetic state filling the remaining eight voxels of a16-voxel target gives1.0, while the printed IoU change is0.5. This is a bounded check of the pinned current release, not evidence that the historical experimental curves were generated incorrectly. The dataset loader uses disjoint index ranges within directories named train; the directory name alone is not evidence of train/test leakage.

## Reproducibility

- All13pages of the [formal NeurIPS2021 paper](https://proceedings.neurips.cc/paper_files/paper/2021/file/2d4027d6df9c0256b8d4474ce88f8c88-Paper.pdf) and all nine pages of its [separate scientific supplement](https://proceedings.neurips.cc/paper_files/paper/2021/file/2d4027d6df9c0256b8d4474ce88f8c88-Supplemental.pdf) were read, including both complete bibliographies. Fifteen pages were rendered and checked, covering every figure/table and the central reward/GNN/PPO formulas. Formal metadata confirms seven authors, POSTECH/Guelph/Vector/POSCO affiliations and NeurIPS34:5745-5757. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2021/hash/2d4027d6df9c0256b8d4474ce88f8c88-Abstract.html) explicitly records `citation_publication_date` as **2021-12-06**, independently of any paper-specific acceptance date.
- Publisher links were manually checked: paper, reviews and the registered nine-page supplement. Both OpenReview APIs for`c1p817YZAx6` returned403. The official repository contains no PDF/ZIP scientific attachments, and no explicitly missing scientific document was identified.
- The [official repository](https://github.com/POSTECH-CVLab/Brick-by-Brick) was inspected at`b000f98f04c17d6f59bb4f0144b997583c479e2a`. The full README/dependencies/MNIST shell configuration, central environment transitions/reward/split loader, mask inference/training, graph-policy/model loss/checkpoint and default-setting sections were read. Dependencies are unpinned TensorFlow/Numpy/Matplotlib/geometric_primitives. The minimum reward check executes the original method without the neural environment; no full training or construction benchmark was run.
- One existing-catalogue relation is supported by the supplement's explicit Pointer Networks suggestion and matching bibliography[4]. It is a proposed alternative head, not the implemented architecture. Other cited graph-generation or brick-construction works without existing catalogue IDs do not receive invented edges.
