# Does DeepSeek Harness Beat Claude Code on Qwen 3.8 27B? I Ran 68 Real Bugs

I ran Claude Code, OpenCode, Pi and DeepSeek Harness on the same local model, Qwen 3.8 27B, against 68 real GitHub bugs from SWE-rebench. Hidden tests graded each fix.

## Files

* [EXPERIMENT.md](EXPERIMENT.md): the preregistered design, the results and their limits.
* [results/main_runs.csv](results/main_runs.csv): one row per run, with the harness, the task, whether it passed, the time and the token counts.

The CSV also has 4 runs from 2 tasks the billing stop cut off. The results only use the 68 tasks all 4 harnesses finished.

The experiment code isn't included, so the scripts EXPERIMENT.md mentions aren't here.
