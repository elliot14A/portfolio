# abel

> reproduce a failing CI job locally and hand it to your coding agent, over MCP.

| role | solo, open source                                   |
| ---- | --------------------------------------------------- |
| when | Aug 2026                                            |
| repo | [elliot14A/abel](https://github.com/elliot14A/abel) |

## the problem

The slowest loop in CI is push, wait, watch it fail, guess, push again. And when
a coding agent is doing the fixing, it is working from scraped terminal output it
cannot fully trust. abel closes that loop on your machine: it runs a GitHub
Actions job's steps in the container the job declares, and when a step fails it
captures exactly why, as structured data an agent can act on.

## what I built

- **A local CI runner in Go**: abel reads your workflow, runs its `run:` steps in
  the declared Docker image with state carried between steps, streams the logs,
  and on the first failing step captures the failure context: the step, its
  command, the exit code, the log tail, and the line in the workflow file.
- **An MCP server** so a coding agent can drive the whole loop: list the jobs,
  plan one without touching your tree, run it, read why it failed, mark a fix, and
  run it again to verify. It gets structured JSON, progress while a job runs, and
  can bound a job that might hang. Secrets are redacted before anything leaves the
  process.
- **One business path behind two transports**: the CLI and the MCP server share
  the same use-cases, so they can never disagree about what your CI does. The
  hexagonal rings are enforced in CI, the workflow parser is fuzzed, and a fake
  store is kept honest by a contract suite run against the real one.

What I like most is the honesty: abel reports what it cannot reproduce (`uses:`
actions, matrices, `${{ }}` expressions) instead of reproducing it wrongly.

## stack

| area  | tech        |
| ----- | ----------- |
| lang  | Go          |
| tools | Docker, MCP |
