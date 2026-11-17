---
id: neuroschedule
short_title: NeuroSchedule
title: 'NeuroSchedule: A Novel Effective GNN-based Scheduling Method for High-level
  Synthesis'
authors:
- Jun Zeng
- Mingyang Kou
- Hailong Yao
- Xu-Cheng Yin
- Haili Wang
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/964b1c8dd5667fd647c09c8772829fd1-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/964b1c8dd5667fd647c09c8772829fd1-Abstract-Conference.html
institutions:
- Tsinghua University
- University of Science and Technology Beijing
- Hercules Microelectronics
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- High-Level Synthesis Scheduling
summary: ILP-supervised GIN priorities guide resource-constrained HLS list scheduling;
  pretraining is followed by setting-specific fine-tuning, with dataset and metric
  qualifications from the separate supplement.
---

# NeuroSchedule: A Novel Effective GNN-based Scheduling Method for High-level Synthesis

> **TL;DR:** Train a GINto rank HLSoperations using ILP-derived timing labels, then use those priorities in list scheduling. The separate supplement supplies the actual11-feature model/dataset setup; transfer to a new resource setting includes fine-tuning, and headline improvement/optimality percentages need their reported denominators.

## Motivation

High-level synthesis schedules operations of a control-data-flow graph onto limited functional units. Fast list/entropy-directed heuristics can choose poor ready-operation priorities, while exact ILPcan be costly. NeuroSchedule learns the priority function from ILPsolutions, aiming to retain useful scheduling quality while moving the optimization effort into offline supervision/training.

## Contributions

The method formulates HLSpriority prediction as supervised graph learning, combines a GINencoder with a scalar priority head, and uses a pairwise rank loss instead of relying only on absolute start-time regression. A50,000-CDFGsynthetic dataset provides ILP-derived labels. Pretraining across resource configurations and subsequent fine-tuning reduce the effort needed for a specific setting. CHStone/MiBenchand synthetic tests assess cycle count, runtime and loss/training choices.

This is a **specialist/constructive** scheduler. A neural pass predicts priorities and a conventional resource-aware list procedure constructs the schedule. Pretraining/fine-tuning for different operation/unit-count/delay settings is native HLSadaptation; the paper does not demonstrate one unchanged checkpoint solving distinct combinatorial problem families. The learned policy selects priorities rather than performing HLSallocation, binding and RTLgeneration itself.

## Methodology

The objective is to minimize total execution cycles under operation dependencies, functional-unit compatibility and non-overlap. Smaller predicted priority values are preferred among ready operations. Gurobi-generated ILPstart times, normalized by the maximum label time, supply supervision. The logistic pairwise loss penalizes disagreement with the sign of label-time differences; pairs with equal labels contribute a constant term rather than enforcing an arbitrary tie order (Equation5).

The main text introduces operation type, operation delay and normalized ASAP/ALAPfeatures. The separate supplement expands the actual node input to11dimensions: two operation-type indicators, cycle count, resource-constrained ASAP/ALAPscheduling results, unconstrained ASAP/ALAPpositions, a traditional list-scheduling start time, maximum ASAPposition, total traditional-list cycles and corresponding functional-unit count. Thus some inputs already require conventional scheduling passes, not just raw graph adjacency. These feature calculations are part of the deployment cost.

Supplementary AppendixA.4specifies a five-layer GINwith width64, dropout0.5and dense transformations64-to64and64-to1. Main Section4.2instead describes three fully connected layers; this mismatch is retained as an implementation detail needing clarification because no executable model was verified. The50,000-graphdataset is split49,000training/1,000evaluation. Pretraining runs2,500epochs; the initial learning rate0.0002decays by0.9every ten epochs. Fine-tuning uses another1,000graphs with one functional unit of each type and25epochs under the stated schedule. New scheduling settings receive setting-specific fine-tuning rather than guaranteed zero-shot adaptation.

## Experiments

**CHStone/MiBench.** Table1contains18basic-block cases with25-433nodes. Summed cycle counts are1,621for NeuroSchedule and1,699for entropy-directed scheduling(EDS). The headline6.10%corresponds to the13strictly improved cases after excluding five ties: their totals are1,200versus1,278cycles. Across all18displayed cases, the aggregate reduction is approximately4.59%. These are curator reconstructions from the printed integer cycle counts; they do not change the per-case observations or represent a rerun.

The paper reports88.89%optimal solutions, but four ILPentries are N/Aafter exceeding10,000s. Among the14cases with displayed ILPcycle counts, NeuroSchedule matches12and exceeds two by one cycle: dfadd49versus48and gsm41versus40. The table therefore does not certify optimality for all18cases. The separate synthetic heatmap suite is reported to have90%optimal solutions and94%improvement cases over EDS; it is a different evaluation set and should not be merged into the CHStone/MiBenchcertificate count.

**Runtime.** Table1reports total NeuroScheduleruntime0.952s versus EDS0.167s and a censored ILPtotal above50,000s. The large speedup compares a learned heuristic with expensive/timeout-prone optimization; offline dataset-label generation and training are additional costs. For an uncensored example, mipsuses0.038s versus2,207sfor ILP. EDSis faster than NeuroSchedule in the displayed cases. The hardware is an Intel Xeon Gold5218CPUand Tesla V100GPU, using Python3.9.12/PyTorch1.8.0/PyG2.0.4on Ubuntu20.04.

**Training comparisons.** Fine-tuning improves the reported synthetic optimal rate by roughly three percentage points over training from scratch with the1,000-graphsetting dataset. The rank-loss curve starts learning earlier than MSEand reaches similar/slightly higher final quality in the displayed run. The checklist explicitly reports no error bars; the curves should not be described as statistically established differences across independent training runs.

## Limitations

ILPsupervision can be expensive and need not be available for arbitrary large instances or new resource settings. The method relies on features from conventional scheduling and on a correct list-scheduling decoder; low ranking loss alone does not certify a minimum-cycle schedule. Fine-tuning is part of the reported adaptation procedure. Operation chaining and evaluation on larger/more complicated benchmarks are future work. The four real-benchmark ILPtimeouts, restricted input types and absent uncertainty estimates limit broad near-optimality claims.

### Curator Analysis

Literal Algorithm1on main PDF7iterates over the remaining ready set before testing whether the same node belongs to the unscheduled set, even though those sets are disjoint. Its supplementary Algorithm2repeats that logic. On the simple chain a->b, scheduling the initial ready node a leaves b unscheduled and the ready set empty forever under those printed steps. A bounded four-iteration translation reproduces the stall. The intended conventional decoder must update eligible successors and respect predecessor completion, including multi-cycle delays; this note does not silently present the printed pseudocode as a verified executable implementation.

This is a specific pseudocode reproducibility issue. The archive supplies data and a scientific appendix but no source implementation, so the check does not establish which decoder generated the reported experiments. Likewise, the footnote for the average improvement has an inconsistent formula label; the precise6.10%subset reconstruction above follows the displayed cycle counts and exclusion statement rather than copying that formula verbatim.

## Reproducibility

- All13pages of the [formal paper](https://proceedings.neurips.cc/paper_files/paper/2022/file/964b1c8dd5667fd647c09c8772829fd1-Paper-Conference.pdf), its26references/checklist and the complete separate three-page scientific appendix were read. The appendix is image-only: all three rendered pages were visually read, not inferred from an empty text extraction. Eight central main pages were also rendered for the architecture, scheduling/ranking formulas, all results and authorship.
- The [publisher ZIP](https://proceedings.neurips.cc/paper_files/paper/2022/file/964b1c8dd5667fd647c09c8772829fd1-Supplemental-Conference.zip) contains the scientific`NeuroSchedule_sup.pdf`, three serialized dataset lists and a README. It is registered as a separate supplement source with its archive-member path/hash. The READMEidentifies adjacency, operation-feature and ILP-priority datasets; no model/decoder implementation is included. The serialized datasets were inventoried rather than executed as source code. No verified author implementation repository was found through the formal sources or repository search; the code link remains absent.
- The formal PDFnames **five authors**: Jun Zeng, Mingyang Kou, Hailong Yao, Xu-Cheng Yin and Haili Wang, with Tsinghua/USTB/Hercules affiliations. The publisher HTMLindex omits the last two; this note uses the complete formal-PDFauthor block and records the discrepancy. Publisher metadata verifies NeurIPS35, December6,2022and DOI10.52202/068431-1728. Exact-title OpenReview APIv1/v2queries returned403; the publisher's identified scientific appendix has nevertheless been fully read.
- Rounded-table/certificate counting and the bounded literal-pseudocode example are saved in `research/full-text-review/neuroschedule/recompute_scope.py` and its JSONoutput. These checks do not train the network, solve new ILPs or reproduce benchmark runtime. The full bibliography contains no identified existing-catalogue target for a supported relation, so no architecture-only or invented citation edge is added.
