# Which coding harness gets a local 27B model to actually finish the job?

This experiment runs the same coding tasks through 4 coding harnesses on 1 local model: Claude Code, OpenCode, Pi, and DeepSeek Harness.
A **harness** is the program that turns a language model into a coding agent.
It gives the model a system prompt and tools, such as file editing and a shell, and runs the loop of model replies and tool calls.
The model is Qwen 3.8 27B, which has 27 billion parameters and runs on 1 GPU.

The main number is **task success**: the share of tasks where the harness fixes the bug and all the task's tests pass.
Tokens and time are reported too, but they don't decide the winner.
Every harness runs every task once, on the same machine and the same kind of GPU, so each task compares the 4 harnesses head to head.
This document is the preregistered design, fixed before any data existed, followed by the results.

**Result:** no harness was detectably better than another at task success.
5 of the 6 pairs came out about the same, within 20 points of each other, and Claude Code against Pi was inconclusive.
Claude Code solved the most tasks, 39.7%, and Pi the fewest, 32.4%.
Prompt tokens differed far more than success: DeepSeek Harness made the GPU process about 1.7 times the prompt tokens Pi did per task, between 1.4 and 2.0 times.
A billing stop cut the main run at 68 of its 156 tasks, and OpenCode ran with its 2 search tools broken, so [Results](#results) gives the limits next to the numbers.

## Status

Done.
The pilot ran its 72 runs on 2026-10-15 with no setup faults.
The main run started at 22:11 UTC on 2026-10-15 and ran until a billing stop at about 11:00 UTC on 2026-10-16.
68 of the 156 planned tasks finished under all 4 harnesses, 3 were cut at the stop, and 85 never started.
The results were analysed blind, under codes H1 to H4, then unblinded after the audit and the hand check.
DEVIATIONS.md lists every change from the plan with its effect.

### How the pilot and the task draw went

The design is tagged `design-v1`.
The pilot sets **n = 156 and the cap at 196**, with the planning spread of 0.7 kept, because every pilot spread was at most 0.49.
Fixes from the pilot are in DEVIATIONS.md.
The pilot draw is done: 6 tasks.
The main draw is done: `tasks/main.txt` holds 199 tasks, and the main run uses the first 156.
The redraw changed 2 of those 156 from the list committed before the grading fixes: `dstackai__gpuhunt-197` joined and `nilearn__nilearn-5739` left.
After the first draw, 2 grading bugs were fixed: test-list debris such as `[` was passed to pytest as a file name, and a test file was added again when the task's command already named it or its folder, so older pytest ran those tests twice.
Every task whose test command changed, 158 of 208, was checked again on the GPU machine, up to 32 at once, and the 2-per-repository walk's remaining candidates were checked too.
Validation now stops at a task's first failed gold check, because one failure already makes a task invalid.
3 results changed in that recheck: `dstackai__gpuhunt-197` became valid, and `idaholab__montepy-933_interface` and `stanfordnlp__dspy-8890` failed a gold check under load, with a hypothesis deadline and a test server that didn't start within 10 seconds.
The load-sensitive recheck rule in [Procedure](#procedure) then checked those 2 and `bluesky__ophyd-async-1165`, whose tests hit pytest timeouts.
The draw allowed 8 checks at a time, but each batch held only 1 unchecked task, so these ran one after another with nothing else running, and DEVIATIONS.md records that.
`idaholab__montepy-933_interface` and `stanfordnlp__dspy-8890` passed all 4 checks and stay in, and `bluesky__ophyd-async-1165` failed again and stays out.
3 checks were stopped to start the pilot and ran afterwards, with nothing else running.
`nilearn__nilearn-5739` runs its whole test suite, which was killed at the 30-minute limit, so it is invalid and wasn't checked again, because the machine was otherwise idle.
`pydap__pydap-624` has tests that call a live server, and they hang for 30 minutes on this machine, so it is invalid too.
`marimo-team__marimo-6629` comes after position 156 in the draw order, after its repository's 2 tasks, so the draw never needed it.
`tasks/config_scan.txt` lists the harness config and instruction files each of the 156 repositories ships.
A first draw on 2026-10-15 was discarded before it was committed, because 39 of its first 93 checks couldn't find `pytest`: the task images don't activate their conda environment for `docker exec`.
The draw restarted from the same seeds once grading activated it.
RUNBOOK.md lists every step in order.
The design gets the `design-v1` tag once the setup checks in [Procedure](#procedure) pass.

Before this design was fixed, 4 setup-check runs were made on 1 task, 1 per harness.
All 4 passed, and their times informed the budget estimate in [Objects](#objects).
That task, `pgmpy__pgmpy-3137`, stays in the pool: if the draw picks it, the main results are also shown without it, as an exploratory check.

## Results

No harness was detectably better than another.
Every number below comes from `analyze.py main --n 156 --unblind`, saved in `scratch/main-unblind.txt`, except where a line names another script.
`cut_report.py` adds the counts and flags the billing stop requires.
No run was excluded for a setup fault, so all 6 pairs use the same 68 tasks.

### Task success

The 68 finished tasks are the first 68 in the random run order.

| Harness | Tasks solved | Success | Timeouts |
| --- | --- | --- | --- |
| Claude Code | 27 | 39.7% | 26 |
| OpenCode | 24 | 35.3% | 29 |
| DeepSeek Harness | 24 | 35.3% | 31 |
| Pi | 22 | 32.4% | 32 |

Each pair's 68 tasks split into 4 outcomes.

| Pair | Both solved | Only first / only second | Neither |
| --- | --- | --- | --- |
| Claude Code vs OpenCode | 19 | 8 / 5 | 36 |
| Claude Code vs Pi | 18 | 9 / 4 | 37 |
| Claude Code vs DeepSeek Harness | 22 | 5 / 2 | 39 |
| OpenCode vs Pi | 18 | 6 / 4 | 40 |
| OpenCode vs DeepSeek Harness | 19 | 5 / 5 | 39 |
| Pi vs DeepSeek Harness | 16 | 6 / 8 | 38 |

Each pair's gap is the first harness's success rate minus the second's, with its 99.2% bootstrap interval.

| Pair | Gap in points | 99.2% interval | Label |
| --- | --- | --- | --- |
| Claude Code vs OpenCode | +4.4 | −8.8 to +19.1 | about the same, sensitive to the cut |
| Claude Code vs Pi | +7.4 | −5.9 to +22.1 | inconclusive, sensitive to the cut |
| Claude Code vs DeepSeek Harness | +4.4 | −5.9 to +14.7 | about the same |
| OpenCode vs Pi | +2.9 | −8.8 to +16.2 | about the same, sensitive to the cut |
| OpenCode vs DeepSeek Harness | 0.0 | −13.2 to +13.2 | about the same |
| Pi vs DeepSeek Harness | −2.9 | −17.6 to +11.8 | about the same, sensitive to the cut |

* **Labels:** "about the same" means the 98.3% interval sits inside −20 to +20 points, as [the decision rule](#decision-rule) says.
  No pair reached "beats".
* **McNemar's test:** p-values run from 0.27 to 1.0, so the test doesn't reject H0 for any pair.
* **Repository clusters:** resampling whole repositories gives interval ends within 1.3 points of the ones above.
* **Sensitive to the cut:** 4 pairs have an end of their 99.2% interval within 4.4 points, which is 3 cut tasks out of 68, of 0, +20, or −20.
  The 3 tasks cut at the billing stop could have moved those labels.
* **Power:** at 68 tasks, a real 20-point gap would be caught about 35% of the time, against 80% at the planned 156.
  The intervals came out narrower than planned because the harnesses disagree on only 10% to 21% of tasks, against about 49% at the planning spread.
* **Without the setup-check task:** dropping `pgmpy__pgmpy-3137` moves each gap by at most 1.6 points.
* **Reference:** we found no SWE-rebench leaderboard entry for Qwen 3.8 27B.
  The closest published figure is the model card's 61.7% on SWE-bench Pro in Claude Code, as reported by [BenchLM](https://benchlm.ai/models/qwen3-8-27b), on a different benchmark and likely a larger setup.

### Time and tokens

Time per task shows no gap: the time ratios run from 0.91x to 1.08x, and every one has a 99.2% interval that includes 1x.
Time is capped at 30 minutes, and 38% to 47% of runs hit the cap, which leaves the time comparison little room to show a gap.

Prompt tokens are the tokens the GPU processed, so text the server reused from its cache doesn't count.
Prompt tokens per task is the mean of the 4 quarter means in the same output, each over 17 tasks.
The fixed overhead is the median prompt a harness sends before the task's own text, which is its system prompt and tool definitions.

| Harness | Prompt tokens per task | Per solved task | Fixed overhead |
| --- | --- | --- | --- |
| Pi | 44,151 | 136,466 | 1,595 |
| Claude Code | 52,938 | 133,326 | 3,662 |
| OpenCode | 60,366 | 171,038 | 8,665 |
| DeepSeek Harness | 85,998 | 243,661 | 2,948 |

* **Fixed overhead ranges:** Pi 1,595 to 5,624, Claude Code 3,659 to 7,723, OpenCode 8,660 to 12,665, and DeepSeek Harness 2,948 to 7,006.
* **Every token gap is real:** all 6 prompt-token ratios have 99.2% intervals that exclude 1x.
  Pi against DeepSeek Harness is 0.60x, from 0.51x to 0.71x.
* **Generated tokens are about equal:** 36,437 to 38,723 per task.
* **Tokens per solved task are exploratory** and decide nothing.

### Guards and slip-ups

* **Test tampering:** 13.2% of Claude Code's runs, 20.6% of OpenCode's, 16.2% of Pi's, and 17.6% of DeepSeek Harness's.
  No harness is 10 points above another, so none is named.
  The hand check found 18 of the 46 flagged runs were real edits to existing tests, mostly matching the upstream fix, and 28 were false alarms, such as import lines that gained a name.
* **Timeouts:** 26 to 32 of 68 runs per harness, at most 8.8 points apart, so none is named.
* **Patch resolves the task:** grading each run's final patch, timeouts included, gives Claude Code 56%, OpenCode 50%, Pi 57%, and DeepSeek Harness 57%.
* **Other slip-ups:** 1 crash, in OpenCode, which was graded on its patch.
  No run hit the max-tokens limit, made a side call, called a disabled tool, or had its patch rejected.
* **New test files:** 3 to 6 runs per harness added a test file.
* **Package-folder writes:** Claude Code 1, OpenCode 3, Pi 2, and DeepSeek Harness 1, which don't count as tampering.
* **Thinking resent:** every harness sent Qwen's earlier thinking back in all 68 runs.

### Hand check and run checks

CHECKS.md logs the hand check of 12 drawn transcripts and of every task where 1 harness alone succeeded or failed.
Every verdict it checked is correct, no checked run cheated or saw the hidden tests, and none of the 12 drawn runs reached the network.
It found 1 fault that falls on 1 harness: OpenCode's `grep` and `glob` tools download ripgrep on first use, the containers have no network, and so every call to them failed.
The model fell back to `grep` through bash, at a cost of about 1 to 2 calls per run.

`scratch/checks.txt` holds the output of the 2 run checks and the hash check.
`check_run.py` passed on the 68 finished tasks, and every copied file matches `main/runs.sha256`.
`check_order.py` passed, with warnings that EXPERIMENT.md changed after `design-v1`, and DEVIATIONS.md logs each of those changes.

### Exploratory observations

These analyses were not pre-registered, except the splits by instruction file, quarter, month, and repository, and none decides anything.
The tool counts come from `scratch/tool_use.py`, the agreement, time, and cache numbers from `scratch/extra_obs.py`, the instruction-file and timeout details from `scratch/dig.py`, the history-rewrite, GPU-time, and after-the-last-edit numbers from `scratch/dig2.py`, and the wrap-up and first-edit numbers from `scratch/dig3.py`.

* **The harnesses mostly solve the same tasks:** 16 tasks were solved by all 4, 33 by none, and 19 by 1 to 3.
  Any harness solved 35 of 68 tasks, 51%, against 39.7% for the best single harness.
* **Many timeouts held a fix:** runs that timed out while their patch already fixed the task numbered 11 for Claude Code, 10 for OpenCode, 17 for Pi, and 15 for DeepSeek Harness.
  Pi's final patches fixed as many tasks as any harness's, 57%, and its timeouts cost it the most.
* **Those runs were still working at the kill:** the median time between the last model reply and the kill was under 1 minute for every harness.
  25 of the 53 were in the middle of a model reply, and the rest had just run tests, a reproduction script, or an edit.
  Only 3 of the 53 waited more than 5 minutes: 1 Pi run in a long test command, and 2 DeepSeek Harness runs waiting on a background job.
* **After the last edit, those runs kept checking:** in the timed-out runs that held a fix, the last edit to a source file came a median of 3.5 minutes before the kill for Claude Code, 7.7 for OpenCode, 7.1 for Pi, and 6.3 for DeepSeek Harness.
  After it, they made a median of 7 to 18 more tool calls, including 1 to 4 test runs.
  This counts edits made with edit tools only, so an edit made through the shell would move the time later.
* **Every harness checks for about 4 to 5 minutes after its last edit:** in runs that ended on their own, the median from the last source edit to the end was 4.5 minutes for Claude Code, 5.1 for OpenCode, 4.0 for Pi, and 4.8 for DeepSeek Harness, with 15 to 18 more tool calls.
  The first source edit came at a median of 7.4 to 8.7 minutes, and tool calls took 1.7 to 2.2 minutes of each run, for every harness.
  So Pi's 17 timeouts holding a fix don't come from checking longer, and with counts this small they may be chance.
  Pi's system prompt says nothing about testing or stopping, while OpenCode's tells the model to verify with tests and then stop, and the task prompt is the same for all 4.
* **DeepSeek Harness rewrites its own history:** it prunes the middle of old tool results, marked `... tool result middle pruned ...`, about once every 2 to 3 tasks.
  Each rewrite changes an early message, so the server can't reuse its cache past that point and reads the rest of the conversation again.
  Those re-reads average 27,090 prompt tokens per task, about a third of its total, and the other harnesses never rewrote their history.
* **Reading prompts is a small share of GPU time:** for the 3 harnesses whose API reports timings, the GPU spent 1.5 to 2.3 minutes per task reading prompts and about 15 minutes writing replies.
  Pi spent 1.5, OpenCode 1.9, and DeepSeek Harness 2.3 minutes reading prompts.
  Claude Code's API format doesn't report these timings.
* **Solved runs take about 11 to 13 minutes:** the median is 12.9 for Claude Code, 10.6 for OpenCode, 12.7 for Pi, and 12.8 for DeepSeek Harness.
* **The cache carries most of the context:** each harness's requests carry 2.9 to 3.5 million context tokens per task, and the server reuses 97% to 98% of them from its cache.
  DeepSeek Harness's 3% miss rate against the others' 2% accounts for its extra processed tokens, since its total context is within 5% of Claude Code's and Pi's and below OpenCode's.
* **Tool use differs more in mix than in amount:** every harness made a median of 54 to 57 model requests and 55 to 65 tool calls per run.

  | Harness | Shell share | Read share | Edit share |
  | --- | --- | --- | --- |
  | Claude Code | 71% | 19% | 8% |
  | OpenCode | 65% | 22% | 8% |
  | Pi | 78% | 15% | 6% |
  | DeepSeek Harness | 53% | 24% | 9% |

  DeepSeek Harness is the only harness whose own search tools worked and got used, for 11% of its calls.
  Claude Code's default tool set in this version has no search tool and Pi has none, so both searched through bash, and OpenCode's search tools failed.
* **Repository instruction files:** 18 of the 68 tasks have an `AGENTS.md` or `CLAUDE.md`, and every harness loaded it into its first request.
  On those 18 tasks the 4 harnesses solved 5 or 6 each.
  On the other 50, Claude Code solved 22 against 17 or 18 for the others, so its lead comes from tasks without an instruction file.
  The 18 tasks are harder for every harness, with 9 or 10 timeouts each, and are too few to separate an instruction-file effect from task difficulty.
* **Drift by run order:** the last quarter had the highest success for Claude Code, 53%, OpenCode, 47%, and Pi, 47%, while DeepSeek Harness peaked in the first quarter, 47% against 41% in the last.
  Mean prompt tokens per quarter show no steady trend for any harness.
* **By month:** success per monthly split moves between 25% and 75% on splits of 4 to 25 tasks, and the newest split, March 2026, has 28% to 36%, close to the overall rates.
* **By repository:** the 68 tasks come from 65 repositories, 62 with 1 task, too few to compare.
* **Strict hidden tests:** the hand check found that in `spack__spack-51723`, `skypilot-org__skypilot-8908`, and `deepset-ai__haystack-10547`, the hidden tests reject fixes that solve the issue as written.
  Every harness faced the same tests.

## Interpretation

For Qwen 3.8 27B on 1 GPU, 5 of the 6 pairs differ by less than 20 points, and Claude Code against Pi could still differ by up to 22 points.
The harnesses agree on most tasks, which suggests the model sets the success rate more than the harness does.
Neither effect from [Why this question is open](#why-this-question-is-open) clearly wins.
The most direct contrast, OpenCode with the largest fixed prompt against Pi with the smallest, came out about the same.

The clearer difference is cost.
DeepSeek Harness made the GPU process about 1.7 times the prompt tokens Pi did, between 1.4 and 2.0 times, and on a local GPU that is prompt-processing time.
Time per task showed no gap, but the 30-minute cap leaves that comparison little room.

The 30-minute limit shapes the ranking.
Many runs timed out holding a working fix while still checking their work, and every harness checks for about as long, so a longer limit could reorder the 4.
Claude Code's small lead comes from tasks without an instruction file, and with 18 such tasks that may be chance.

These results have 6 limits:

* **Cut short:** 68 of 156 tasks, at 35% power for a 20-point gap, with 4 pairs sensitive to the cut.
* **OpenCode's broken search tools:** every OpenCode comparison tests OpenCode without its `grep` and `glob` tools.
* **30-minute limit:** 38% to 47% of runs timed out, many holding a fix, so the ranking depends on the limit.
* **Contamination:** every task predates the model's release, so it may have seen the fixes, which can raise every rate and shrink the gaps.
* **1 model and 1 run per task:** results may differ for other models, and the cloud models some harnesses are tuned for.
* **Blinding was partial:** the blind output's prompt-token ratios could rank the codes, and the hand-check report revealed the mapping after the blind results and every pre-unblinding decision were committed.

### In plain language

This summary is for readers without a statistics background.

* **They're all about equally good at fixing bugs.**
  Out of 10 real bugs, Claude Code fixed about 4 and the other 3 harnesses about 3 to 3.5.
  That gap is small enough to be luck: run the test again and the order could change.
  The model matters far more than the harness: 16 bugs were fixed by all 4 harnesses, and 33 by none.
* **They differ more in how hard they work your GPU.**
  Before the model writes anything, your GPU has to read everything the harness sends it.
  DeepSeek Harness made the GPU read about 1.7 times what Pi did for the same results.
  About a third of that comes from a feature meant to save space: it trims old tool output, which forces the GPU to read the whole conversation again from that point.
  On the GPU in this test, reading took only 1.5 to 2.3 minutes of a task's GPU time, against about 15 minutes of writing, so no harness was measurably slower.
  On hardware that reads prompts more slowly, the gap would likely grow.
* **The agent often fixes the bug and keeps going.**
  About 1 run in 5 had already fixed the bug when the 30-minute limit cut it off.
  After their last code change, those runs kept running tests and checks for about 3 to 8 minutes, and many were still mid-reply when the clock ran out.
  Every harness did this, and they all spent about 4 to 5 minutes checking after their last change.
  If your agent is still running after a long time, look at what it has changed, because the fix may already be there.
* **If one harness fails, another sometimes succeeds.**
  The best single harness fixed 40% of the bugs, and at least 1 of the 4 fixed 51%.
  This test didn't check whether rerunning the same harness gives a similar boost.
* **A simple way to choose:**
  * **Claude Code:** fixed the most, by a small margin.
  * **Pi:** the lightest on your hardware, with the most runs cut off while holding a fix, which may be chance.
  * **DeepSeek Harness:** the only one whose built-in search tools worked here, and the heaviest on the GPU.
  * **OpenCode:** not tested fairly, because its search tools need an internet download that this offline setup blocked.
    Installing ripgrep first avoids that.
* **How far to trust this:** 1 model on 1 GPU, 68 real bugs, and 1 try each.
  That's enough to rule out a big winner, but too little to tell apart differences of about 5 points.

## Why this question is open

The harness changes results even when the model stays the same.
For example, one 2026 preprint reports Claude Opus 4.5 at 45.9% on SWE-bench Pro in Scale AI's standard harness and 55.4% in Claude Code ([Stop Comparing LLM Agents Without Disclosing the Harness, arXiv 2605.23950](https://arxiv.org/abs/2605.23950)).
SWE-bench Pro is a benchmark of coding tasks taken from real GitHub issues.
Studies like that test big cloud models.
None that we found tests consumer harnesses on 1 local 27B model with the model server held fixed.
The model server is the program that runs the model and answers the harness's requests.

A small model could go either way:

* **More guidance helps:** a harness with detailed instructions and good tools may walk a 27B model through tasks it can't finish alone.
* **Less clutter helps:** a long system prompt and a big tool list may crowd a 27B model's limited attention, so a minimal harness does better.

The result shows which effect wins for a 27B model on a single GPU.

## Hypotheses

The gaps below are in percentage points, called points: 40% against 60% is a 20-point gap.

* **H1:** the harnesses differ in task success.
  The 2 effects above predict opposite orders, so we make no prediction about which harness wins.
* **H0:** for each pair of harnesses, the difference in task success is zero.

Every pair is tested in both directions, so either harness in a pair can come out ahead.
There are 6 pairs, and [the decision rule](#analysis) accounts for testing 6 at once.

## Arms

An arm is one of the things being compared.
Here each arm is a harness:

| Harness | How it talks to the server | Version |
| --- | --- | --- |
| Claude Code | Anthropic Messages API | pinned at setup |
| OpenCode | OpenAI chat API | pinned at setup |
| Pi | OpenAI chat API | pinned at setup |
| DeepSeek Harness | OpenAI chat API | pinned at setup |

The 2 APIs are the request formats of Anthropic's and OpenAI's cloud services, which the server also accepts.
Pinned means fixed to 1 exact version, and the pinned versions are in `config/versions.json`.

### What changes between arms

The harness changes as a bundle: its system prompt, tools, agent loop, context handling, and API format.
The experiment says which harness succeeds more often.
It can't say which part of the harness causes it.

### What every harness shares

These settings are the same for every harness:

* **Context window:** 200K tokens for every harness: set in the configs of OpenCode, Pi, and DeepSeek Harness, and Claude Code's own default for any model.
  The context window is how much conversation the model can see at once.
  With the same setting, no harness compacts early or errors at a smaller limit it assumed.
  Compacting means summarizing old turns to free room.
* **Subagents off:** Claude Code's Task tool, DeepSeek Harness's subagents, and any OpenCode or Pi equivalent are disabled.
  A subagent is a second conversation that a harness starts to do part of the work.
  The server holds 1 conversation at a time, called a slot, and keeps the work it has already done on that conversation in a cache.
  A subagent would wipe the main conversation's cache and make the harness pay to re-read it.
* **Web tools off:** web search and web fetch are disabled in every harness, and the network is blocked, so no harness can look up the fix.
* **Side calls off:** Claude Code's non-essential calls, OpenCode's title generation, and any DeepSeek Harness side calls are switched off.
  A side call is a request to the model for anything other than the task, such as naming the session.
* **No extras:** no MCP servers, plugins, skills, hooks, memory, or plan mode.
  MCP (Model Context Protocol) servers add outside tools to a harness.
* **Same tools otherwise:** each harness keeps its own file, edit, and shell tools.
  The exact tool list for each pinned version goes in `config/tools.md`.
  Claude Code 2.1.300 also offers scheduling, worktree, workflow, messaging, and skill tools, so its built-in tools are limited to `Bash`, `Edit`, `Read`, `Write`, and `NotebookEdit`.
* **Repository instruction files:** a harness that reads `AGENTS.md` or `CLAUDE.md` from the repository keeps doing so, as part of the harness.
  Claude Code runs with the project settings source on, so it reads `CLAUDE.md` and `AGENTS.md`, as Pi, OpenCode, and DeepSeek Harness do.
  Repository hooks stay off for Claude Code, because they run the repository's code, and the other harnesses run without extensions or plugins.
  2 main-pool repositories ship hooks in `.claude/settings.json`.
  Every run deletes `.claude/settings.json` and `.claude/settings.local.json` before the base commit, whatever the harness, so a repository's Claude Code settings can't change that arm.
  Grading leaves out any patch to those 2 files.

### DeepSeek Harness setup

DeepSeek Harness uses the official `dsh` package with its Standard preset, minus the tools above.
It runs as `dsh --profile headless`, with the overrides in `config/dsh/.dsh/profiles/headless/cordis.patch.yml`.
Its compaction stays on, because context handling is part of the harness.

### Run order

The machine pulls every image it needs, then works through a queue of runs on its 8 GPUs, 1 run per GPU at a time.
The task order is shuffled with a committed seed.
Each task's 4 harness runs sit next to each other in the queue, in an order shuffled from the same seed.
So a task's 4 runs start within minutes of each other, on the same machine, and GPU heat, CPU load, and drift hit all 4 alike.

### Harnesses left out

Aider, Codex CLI, and OpenHands are left out.
Four harnesses already fill the GPU budget, and these 4 are the ones viewers asked about.

## Controlled variables

Each of these is fixed by setup unless the line says otherwise.

* **Model:** Qwen 3.8 27B, Unsloth's 4-bit `UD-Q4_K_XL` GGUF file, loaded from a local path, with its SHA-256 checksum recorded.
  GGUF is the model file format llama.cpp reads.
  4-bit means each weight is stored in about 4 bits, so the model fits in GPU memory.
  The SHA-256 checksum is a fingerprint that proves the file is unchanged.
* **Server:** llama.cpp's `llama-server` at 1 pinned build, `b1-8ed274e`, taken from a pinned image digest, with the settings in config/llama-server.yaml for every run.
  An image digest names a Docker image by a hash of its contents, so it can't change.
  The settings include a 200K context, 1 conversation slot, and Qwen's recommended sampling.
  Sampling settings control how the model picks each next token, such as how random the choice is.
  Each GPU runs its own server, which loads only the Qwen file.
* **Hardware:** 1 rented Massed Compute machine with 8 NVIDIA RTX A6000 GPUs of 48 GB, 62 vCPUs, and 384 GB of RAM or more.
  Only 1 such machine was available, so it runs every task, and the run takes about twice as long as on 2 machines.
  A vCPU is a virtual CPU core.
  A home RTX 3090 Ti has more memory bandwidth than an A6000 and so generates tokens faster, so absolute times here don't match a home GPU.
* **Where the harnesses run:** each run's container runs natively, with no emulation, on the same machine as its server, and reaches it over a local Docker network.
  A container is an isolated Docker environment with its own files.
  Up to 8 runs and their grading share the machine's 62 vCPUs, so a run's tool calls can slow when its neighbours run tests at the same moment.
  The shuffled queue spreads that load over all 4 harnesses alike.
* **Sampling:** a small logging proxy sits between each harness and the server and passes every request through.
  The proxy strips every sampling setting a harness sends, such as temperature, top-p, penalties, stop sequences, and thinking flags, so the server's settings apply to all.
  Qwen writes out its reasoning, called thinking, before it answers.
  The proxy sets max tokens per response to 32,768, so Qwen's thinking isn't cut off before a tool call.
  It also strips Claude Code's `output_config` effort setting.
* **Late system messages:** the proxy rewrites any system message that isn't first as a user message in the same place, its text wrapped in `<system-reminder>` tags.
  Claude Code 2.1.300 sends its environment details and a running token count in system messages between turns.
  Qwen's chat template, the rules that turn a conversation into the model's input, rejects a system message anywhere but the start.
  Without the rewrite, Claude Code can't run at all.
  Each rewritten message keeps its place, so the start of the conversation stays the same from turn to turn, and the server's cache works for Claude Code as for the others.
  The same rule applies to every harness, but in the setup-check runs only Claude Code sent such messages, so in practice it is a Claude Code intervention.
  The proxy log keeps each request as the harness sent it.
* **Proxy endpoints:** the proxy passes only `/health`, `/v1/models`, `/v1/chat/completions`, `/v1/messages`, and `/v1/messages/count_tokens`, and answers 403 to anything else.
  Code the agent runs, such as the project's tests, can reach the proxy too, and this keeps it off the server's other endpoints.
* **Prompt:** every harness gets the same prompt, a template committed as `prompt.txt`.
  It inserts the task's issue text and asks for a fix, and it doesn't mention the hidden tests.
* **Permissions:** every harness runs unattended and approves its own tool calls.
* **Time limit:** 30 minutes per run.
* **Config:** each run starts from a fresh copy of that harness's committed config folder, such as `CLAUDE_CONFIG_DIR` for Claude Code.
  Nothing from `~/.claude` or any other user folder is loaded.
* **Not controlled:** whether a harness resends Qwen's earlier thinking each turn.
  It is logged per request and reported per harness.

## Measures

* **Primary, task success:** a run succeeds when every FAIL_TO_PASS and PASS_TO_PASS test passes in grading.
  FAIL_TO_PASS lists the tests the fix must make pass, and PASS_TO_PASS lists the tests that must keep passing.
  These are the benchmark's own tests, written by the project's developers, so success means the real issue got fixed.
  A timeout counts as a failure.
  A run that ends in a harness crash is scored on its graded patch like any other, and the crash is reported as a slip-up.
  Exit codes are each harness's own convention: a harness can exit with an error after writing a correct fix.
* **Guard, test tampering:** the share of runs that changed or deleted lines in existing test files, edited test config, or wrote files outside the repository.
  Renaming a test file or test config file counts as editing it.
  Tests only added to an existing test file don't count, because agents often add regression tests there.
  Grading still drops every edit to an existing test file.
  A guard watches for cheating and doesn't pick the winner.
  A test file is a file under a `test`, `tests`, or `testing` folder, or one named `test_*.py` or `*_test.py`.
  "Outside the repository" means any file `docker diff` lists outside `/testbed`, except the harness's own folders, `/xp` and its install folder `/opt/xp`, plus `/tmp`, `/var/tmp`, `/var/cache`, `/root/.cache`, the system folders `/proc`, `/dev`, `/run`, and `/sys`, and `__pycache__` folders.
  Grading throws those edits away, so they can't earn a success.
  The guard shows which harnesses try it, and a harness whose rate is 10 or more points above another's is named in the results.
  New test files are counted separately, because writing tests is normal.
  Writes to installed-package folders, such as `pip install` makes, are reported separately too and don't count as tampering, because grading starts from a fresh container.
* **Secondary:** these measures add context.
  * **Prompt tokens per task:** the prompt tokens the GPU actually processed, from llama-server's `prompt_tokens_total` counter, read before and after the run.
    Cache hits aren't counted, which a setup check confirms.
    Timed-out runs count the tokens read until the 30-minute kill.
  * **Time per task:** wall clock from harness start to exit, with timeouts counted as 30 minutes.
  * **Resolved at the end:** the share of runs whose patch resolves the task, with a timed-out run graded on the patch it left at the kill.
    On the A6000, 2 of the 4 setup-check runs were still working at 30 minutes with a patch that already resolved the task, so this measure shows how much of a gap comes from the time limit.
    A run killed before 30 minutes, such as by the kernel, counts as a crash and is graded on its patch.
  * **Generated tokens:** from `tokens_predicted_total`.
  * **Fixed overhead:** the first request's prompt size minus the task prompt, from the proxy log.
  * **Harness slip-ups:** per harness, how many runs hit the max-tokens limit, made side calls, or called a disabled tool.
* **Reference:** the SWE-rebench leaderboard's success rate for the closest Qwen model, quoted with its harness, so viewers can see the scale.
* **Also recorded:** repository, task size by lines changed in the fix, run start time, machine, GPU index, GPU temperature, power draw, utilisation, and clock, and whether earlier thinking was resent.
  `nvidia-smi` reports the GPU's temperature, power draw, utilisation, and clock.
  These help explain a result but don't change it.

## Objects

The objects are the tasks the harnesses work on.

### Source

The tasks come from the SWE-rebench leaderboard's 6 newest monthly splits, `2025_10` through `2026_03`, from `nebius/SWE-rebench-leaderboard` at revision `34d5a58864acf91613740a09ec5d205228dcfa39`.
SWE-rebench is a benchmark that publishes new coding tasks each month, and each monthly batch is a split.
Each SWE-rebench task is a real GitHub issue with a Docker image, a **gold patch** (the developers' own fix), and a **test patch** (the tests that check it).
The pins are in `config/versions.json`, and `tasks.py` downloads the files.

Qwen 3.8 27B came out on 2026-08-05, and no split, in this dataset, SWE-rebench-V2, or SWE-bench-Live, holds tasks from after that date.
So the model may have seen these issues and their fixes in training: see [Threats to validity](#threats-to-validity).

### Filters

The filters run in this order:

1. Keep Python tasks whose fix touches 1 or 2 files, and whose tests SWE-rebench grades with its pytest log parser.
   361 tasks become 275, written to `tasks/candidates.jsonl`.
   The design uses 6 splits because the 3 newest hold only 141 tasks after the 2-per-repository limit, fewer than the 156 the main run needs.
2. Drop broken tasks: the gold patch must pass all its tests 3 times in a row, and an unchanged repository must fail every FAIL_TO_PASS test.
   This also drops flaky tests, which would count random failures against a harness.
3. Draw 6 pilot tasks with the pilot seed, and remove them from the list.
4. Shuffle the rest with the main seed, then walk the list and keep at most 2 per repository.

The main run uses the first n tasks of that shuffled list.
All seeds are committed in `seeds.txt` before the draw.

### Task draw

Filter 2 takes about 5 minutes per task, so `run.py draw` applies it lazily.
It walks each shuffled list and checks a task only when the walk reaches it.
That gives the same tasks as checking every task first, because a task's result doesn't depend on the order.

The draw ran natively on a rented CPU-only x86 machine, checking up to 12 tasks at once.
After the grading fixes, the GPU machine checked the changed tasks again, up to 32 at once, before the pilot.
That load can push a slow test suite past its time limit.
So every task in the pool whose latest gold check failed only with a load-sensitive error is checked again once, 8 at a time, about the load of main-run grading.
A load-sensitive error is a test run killed at the time limit, a pytest or hypothesis deadline, or a test fixture's readiness timeout, such as a server that doesn't become ready.
The recheck runs all 4 checks again, and the task must pass them all.
A task that fails for any other reason stays out, and none of this involves any harness.

The main draw asks for 200 tasks, more than n can reach, and the main run uses the first n.
Each check's result and raw test output are committed under `tasks/validation/`, and the draw prints how many tasks it checked and how many passed.
If the list runs out before n, the main run uses every task that passed, and the reached n is reported.

### How many tasks

The smallest gap worth calling is 20 points of task success, such as 40% against 60%.
At a planning spread of 0.7, with 6 pairs tested together, the standard formula gives 149 tasks.
The spread is the standard deviation of the per-task difference between 2 harnesses.
The formula runs slightly optimistic for the bootstrap interval used here, and the exact method below gives 156 tasks to reach 80% power:

sample-size: alpha=0.0083 power=0.80 delta=0.20 sigma=0.7 are=1 n=156

In that line, alpha is the false-alarm rate allowed per pair, 0.05 split over 6 pairs.
Power is the chance of catching a real gap, delta is the 20-point gap, sigma is the spread, and n is the number of tasks.
are=1 means the test is taken as fully efficient, so the formula needs no extra tasks to make up for it.
In plain terms: with 156 tasks, a true 20-point gap between 2 harnesses is caught 8 times in 10.
The spread of 0.7 is cautious: it means 2 harnesses disagree on about half the tasks, which is more than expected for harnesses running the same model.

After the pilot, redo this with the larger of the pilot's spread and 0.7.
The pilot's spread is the largest of the 6 pairs' spreads, each the standard deviation of that pair's 18 paired differences.
`analyze.py pilot` redoes the calculation exactly, not by simulation: the smallest n at which the 99.2% bootstrap interval clears 0 with 80% chance, for a true 20-point gap.
n is the larger of 156 and its result.
At a 20-point gap, a pair's spread can't exceed 0.980, so a larger pilot spread is capped just below that.

### Budget

The main run gets up to 240 GPU-hours: 8 GPUs for up to 30 hours.
At the pilot's pace, 156 tasks use about 190 of them, about 24 hours.
A GPU-hour is 1 GPU busy for 1 hour.
A run's GPU time lasts from its container's start until the harness stops and the server is idle again.
Grading runs afterwards on the CPU while the GPU moves on to the next run, so it doesn't count.

The budget was first 152 GPU-hours.
The pilot averaged 18.3 GPU-minutes per run, which put the cap at 124 tasks, with about 68% power.
Before the main run, the budget was raised so that 156 tasks fit.
The pilot's per-task times vary widely, so 190 GPU-hours could fall short, and the limit is 240 GPU-hours, which stops the run only if runs are much slower than the pilot's.
DEVIATIONS.md records the change.
The cap is 240 GPU-hours divided by 4 times the pilot's average GPU minutes per run, reruns included.
The machine stops starting new tasks when its runs, reruns included, pass 240 GPU-hours.
Image downloads and pauses don't count toward the 240 GPU-hours.

A cap well below 156 costs power: at a 20-point gap, 76 tasks give 41%, 100 give 55%, 120 give 66%, and 140 give 74%, against 80% at 156.
The results state the power at the reached n.
If n is bigger than the cap, run the cap.
If time runs out partway, only tasks that all 4 harnesses finished are analysed, and the reached n is reported.
A failed equivalence test from a capped or cut-short run is reported as inconclusive, not as "about the same".

## Procedure

### Setup checks before the pilot

1. Start 1 server per GPU with `setup/serve.sh`, and confirm in each server's log that every layer is on the GPU.
   `setup/checks.py` confirms each server's command matches `config/llama-server.yaml`, including `--metrics` and `--slot-save-path`, which the counters and the cache erase need.
   It also confirms `--cache-ram 0`, which turns off llama-server's default 8 GiB host-RAM prompt cache.
   That cache can use up the machine's memory and get llama-server killed, and it would let a run reuse cache left by an earlier one.
   It checks the model file's SHA-256 on each machine, and that every server reports the pinned build.
2. Confirm each harness talks to the proxy and its tool calls work.
   For Claude Code, confirm its Anthropic endpoint passes Qwen's thinking through correctly with `--reasoning-format deepseek`.
3. Set the 200K context window and turn off subagents, web tools, and side calls in each harness's config, and write the setting names in `config/`.
4. Write each harness's enabled tools in `config/tools.md`.
5. Check that `prompt_tokens_total` skips cache hits by sending the same prompt twice.
6. Confirm a task container reaches only its own run's proxy: not the internet, not any server, and not another run's proxy.
   Each GPU's runs use their own internal network, and only proxies join the servers' network.
7. Run the task filters and record the count.
8. Commit everything, and tag it `design-v1`.

### One run of 1 task under 1 harness

1. Start a new container from the task's image.
   The repository starts as a fresh git repo with 1 commit holding the starting code, so the fix isn't in git history.
   The hidden tests aren't in the image: they arrive only with the test patch, at grading.
   The image is pinned to the digest it had when the task was validated.
2. Copy in the harness's committed config folder.
3. Wait until the server's slot is idle, erase the server cache with `POST /slots/0?action=erase`, wait for `/health` to report ready, and read `/metrics`.
4. Record the start time, GPU temperature, power draw, utilisation, and clock, then start the harness with `prompt.txt`.
5. Stop at harness exit or at 30 minutes, then kill anything the harness left running.
6. Stop the proxy, which closes its server connections so llama-server cancels any request the harness left behind.
   Wait until the slot is idle, read `/metrics` again, and save the transcript and proxy log unedited.
7. Save the harness's changes, new files included, with `git add -A && git diff --cached <base>`.
8. Grade in a fresh container from the same image, so nothing the agent changed outside the repository carries over.
   The grading container has normal network access, as in SWE-rebench's own grading, because some tasks' tests download data.
   Grading has 2 steps:
   1. Apply the saved diff, minus any change to existing test files, `conftest.py`, `pytest.ini`, `tox.ini`, or the pytest sections of `setup.cfg` and `pyproject.toml`, and minus any file the test patch touches.
      A change to `setup.cfg` or `pyproject.toml` is dropped whole when it changes the file's pytest section.
   2. Apply the test patch, run FAIL_TO_PASS and PASS_TO_PASS, and record success or failure.
      The task's own test command runs on the test files that hold those tests, plus any files the command already names, inside the task's conda environment, activated with `conda activate testbed`, the SWE-bench convention these images follow.
      Every harness also runs with that environment active, so `pytest` and the project's packages are on its path.
9. Run the run checks below.

After the server starts, send 1 throwaway request before the first timed run.

### Run checks

A script reads each run's proxy log and sorts problems into 2 kinds:

* **Setup faults get 1 rerun:** these are faults of the test setup, which no harness causes.
  * A server crash, such as running out of memory, seen either as a request the server dropped or as its counters going down during the run.
  * A proxy or container failure, or the proxy failing to reach the server.
  * The task container failing to reach the proxy's health check just before the harness starts.
  * A response from any model other than the Qwen file.
  * A run whose first request finds tokens already cached.

  If the rerun fails too, the run is excluded with its reason.
  Grading that fails for a setup reason, such as Docker failing to start the grading container, is retried once.
  The run is excluded if grading fails again, and the harness isn't run a second time for it.
  Grading that doesn't resolve the task and fails with a load-sensitive error is graded once more, because the load of other runs can cause that.
  A second failure counts against the harness's patch.
  Load-sensitive errors are defined under the task draw.
* **Harness slip-ups are graded as they stand:** these are problems the harness causes.
  * A harness crash or a timeout, including a harness that exits before sending any request once the health check has passed.
  * The server answering a harness's request with an error.
  * A response that stops at the max-tokens limit.
  * A side call, or a call to a disabled tool.

  A harness killed at the time limit while a response is streaming is a timeout: the proxy records that the harness hung up, which is not a setup fault.
  Slip-ups count against the harness, usually as a failure, and are reported per harness.

### Excluded runs

When a run is excluded, that task is dropped from all 6 pairs, so every comparison uses the same tasks.
If more than 10% of tasks are dropped, the result is reported as unreliable.

### Hand check

After the main run and before unblinding, read 3 transcripts per harness, drawn with the `transcripts` seed in `seeds.txt`.
Unblinding means revealing which harness is which in the results.
Look for anything the scripts miss, such as a harness reading files outside the repository, misreading the prompt, or working around a setup error.
Log what turns up in `CHECKS.md`, along with the checks of the largest wins and losses, which the blind results show under codes H1 to H4.

### Pilot

The pilot is a small trial run: 6 tasks × 4 harnesses × 3 runs = 72 runs.
It tests the setup, measures the average minutes per run for the budget, and measures the spread for the sample size.
Pairing each harness's run 1, 2, and 3 with the other harnesses' gives 18 pass-or-fail comparisons per pair for the spread.

The pilot is also an A/A check, meaning a comparison of a harness with itself: each harness's 3 runs on a task should mostly agree.
If a harness disagrees with itself on more than half the pilot tasks, check for a setup fault before the main run.
Pilot results never count toward the answer, and 1 pilot run is published as a worked example.

### Runs per task

Each task runs once per harness in the main run and 3 times in the pilot.
At a fixed budget, more tasks with 1 run each catch a gap better than fewer tasks with 3 runs each.

## Analysis

Each of the 6 pairs gets the same treatment.
Every task has 4 possible outcomes for a pair: both succeed, both fail, only A succeeds, or only B succeeds.

### Primary analysis

The primary analysis has 4 parts:

* **Test:** McNemar's exact test, which asks whether "only A" and "only B" tasks split evenly.
  It's the standard test for paired pass-or-fail results.
  Its p-value is the chance of a split at least this lopsided if the 2 harnesses were really equal.
* **Interval:** a bootstrap confidence interval for A's success rate minus B's, in points.
  A bootstrap reruns the comparison on 20,000 random resamples of the tasks, with a fixed seed, and takes the middle of the results.
  The interval is 99.2% wide instead of the usual 95%, to account for 6 comparisons.
  The interval decides the result, through the decision rule below, and McNemar's p-value is reported beside it, since the 2 can disagree near the edge.
* **Also shown:** each harness's overall success rate, and the 4 outcome counts for every pair.
* **Clusters:** repeat the bootstrap resampling whole repositories, as a check that 2 tasks from 1 repository aren't treated as independent.

### Decision rule

For each pair, take the first label that fits:

1. **A beats B by a lot:** the 99.2% interval is entirely above 20 points.
2. **A beats B:** the 99.2% interval is entirely above 0.
   The result gives the interval in words, such as "by somewhere between 8 and 40 points".
3. **About the same:** the 98.3% interval sits inside −20 to +20 points.
   This is an equivalence test, called TOST for "two one-sided tests", adjusted for 6 comparisons.
4. **Inconclusive:** anything else.

### Secondary and exploratory analysis

Time and prompt tokens per task get the same paired comparison on the log scale, so a 2x gap counts the same in either direction.
They are shown as ratios, such as 1.8x.
They give context, such as "wins, but reads 2x the tokens", and never decide the result.

The overhead claim, "\<harness\> makes your GPU read N tokens before your code", is reported for all 4 harnesses the same way, as the median fixed overhead with its range.

The exploratory results are tokens per solved task, generated tokens, results by repository, results split by whether the repository has an `AGENTS.md` or `CLAUDE.md`, and success and tokens by quarter of the run, in start order, to check drift.
If the draw picks the setup-check task, the pairs are also shown without it.
These are labelled exploratory and decide nothing.

## Assumptions

* **Sampling settings stripped:** the proxy strips every sampling setting each pinned harness sends.
  Setup step 2 and the proxy log check this.
* **Max tokens big enough:** 32,768 tokens per response is enough for Qwen's thinking plus a tool call.
  The slip-up count for responses that stop at the limit shows whether it isn't.
* **Harnesses work with features off:** each harness works with web tools, subagents, and side calls turned off.
  If one can't, that's logged as a deviation and the harness is tested with the closest setting.
* **Time limit long enough:** 30 minutes is long enough for a harness that is making progress.
  Timeouts are counted per harness, and a harness with many is named in the results.
* **Fixed numbers:** 6 pilot tasks, 1 run per task, and the 20-point threshold are fixed now.
  The only things set after the pilot are n and the cap, using the rules above, and the GPU-hour budget, which DEVIATIONS.md records.

## Threats to validity

Each threat below names the risk and what covers it.

### Construct validity: whether the numbers measure what we claim

* **Tests can miss a bad fix:** a fix can pass the tests and still be wrong.
  The benchmark's tests are the same for every harness, so this hits all 4 alike.
* **Success can be gamed:** grading in a fresh container, with test edits stripped, covers this.
* **30 minutes may be too short:** a slow harness that would finish at 40 minutes counts as a failure.
  The timeout counts per harness show whether this happened.

### Internal validity: whether the harness causes the gap

* **Leaks to the answer:** the network block, the single-commit repository, and removed hidden tests cover this.
  Each task image holds `/issue.md`, the image builder's copy of the issue, which may include more than the prompt, so every run deletes it before the harness starts.
* **A cloud model sneaking in:** the run check confirms every response came from the Qwen file.
* **Leftovers between runs:** fresh containers, fresh config folders, and a cache erase before every run cover this.
* **Second chances:** only setup faults get a rerun, so no harness gets extra tries for its own slip-ups.
* **Drift over the run:** shuffled harness and task order, plus the drift tables by quarter of the run, cover this.
* **Shared CPUs:** up to 8 runs share a machine's CPUs, which can slow tool calls.
  The shuffled queue spreads this over all 4 harnesses.
* **Thinking resent or not:** this is logged per request and reported, but not controlled.
* **API format:** Claude Code uses a different API from the others, which may change how tool calls are parsed.
  Nothing removes this, and it is part of the harness bundle.

### External validity: whether it carries over to your setup

* **One model:** 1 model at 4-bit with a 4-bit cache, so results may differ for other models.
  In particular, Claude Code is tuned for Claude models.
* **Fair test over default experience:** forced sampling settings, side calls off, subagents off, and 1 server slot make this a fair test, which differs from what each harness does out of the box.
  The video says so.
* **Task mix:** Python bug fixes touching 1 or 2 files.

### Conclusion validity: whether the statistics hold up

* **Only big gaps are reliably caught:** gaps smaller than 20 points, such as the 9.5-point gap in the preprint above, will often come out inconclusive.
  The video says so.
* **Luck in a single run:** each task runs once per harness, so a harness can fail a task it would pass on a second try.
  Using 156 tasks spreads that luck out, and the pilot's 3 runs show how large it is.
* **6 comparisons:** the 99.2% and 98.3% intervals cover this.
* **Tasks from 1 repository move together:** the repository bootstrap covers this.
* **Contamination:** the tasks date from October 2025 to March 2026, before the model's release on 2026-08-05, so it may have seen the issues and their fixes.
  That affects all 4 harnesses alike, but it can shrink the gaps between them: a model that recalls a fix needs less help from its harness.
  It can also lift every success rate above what fresh tasks would give.
  Nothing removes this, and the video says so.
  As an exploratory check, success rates are shown per monthly split, since later splits are less likely to be in training data.

### Other explanations for a win

* **Template fit:** a harness may win because its tool-call format suits Qwen's chat template, rather than because its loop is better.
* **Context handling:** a harness may lose because of how it manages context, rather than because of its instructions.
* **Speed:** a slower harness hits the 30-minute limit more often, so part of a success gap can be a speed gap.
  The time per task and timeout counts show this.

## Reproducibility and audit

Everything needed to rerun this lives in the repository:

* **Pins:** the GGUF checksum, the llama.cpp commit, each harness version, the SWE-rebench split and revision, and the container image digests, including the server image, which is llama-swap's CUDA image, used only for its `llama-server` binary.
  `analyze.py` uses only the Python standard library.
* **Committed before the pilot:** this design, `config/llama-server.yaml`, `prompt.txt`, each harness's `config/` folder, `config/tools.md`, `seeds.txt`, `tasks/pilot.txt`, `tasks/main.txt`, `tasks/validation/`, and the proxy.
* **Committed before the main run:** `analyze.py`, the 1 script that computes every reported number, and the n and cap from the pilot.
* **Per run:** a `manifest.json` with versions, start time, seed, image digest, machine, GPU index, GPU clock, and temperature, saved next to the unedited transcript, proxy log, metrics readings, and diff.
* **Deviations:** every change from this plan goes in `DEVIATIONS.md` with its date, reason, and effect.
* **Optional:** push the `design-v1` tag to a public repository before the pilot, so viewers can check the plan came first.

## Open decisions

None.
