# minitraycer

> a command-line planning layer for coding agents: draft a structured plan,
> approve it in the terminal, and serve approved plans to the agent over MCP. it
> never writes code.

| role | solo, open source                                                 |
| ---- | ----------------------------------------------------------------- |
| when | Jul 2026                                                          |
| repo | [elliot14A/minitraycer](https://github.com/elliot14A/minitraycer) |

## the problem

Coding agents write code fast, but they will happily run off and build the wrong
thing before you have agreed on an approach. What is missing is a vetted plan.
minitraycer puts one in front: you draft a structured implementation plan with an
LLM, review and approve it in the terminal, and the coding agent only ever sees
approved plans, one phase at a time, over MCP. It never writes code itself.

## what I built

- **A CLI in TypeScript on Bun**: draft a plan for a task, review and approve it,
  then list and show saved plans.
- **LLM planning** over any OpenAI-compatible, tool-calling model, so a plan comes
  back as structured phases instead of a wall of prose.
- **An MCP server** that serves only approved plans to coding agents, phase by
  phase (list_plans, get_plan, get_next_phase, mark_phase_done). Drafts are never
  served, so an agent only ever picks up vetted work.

The idea I like most is the constraint: it deliberately does not write code. It
is a planning and approval layer that keeps a human in the loop and hands the
agent one phase at a time.

## stack

| area    | tech                    |
| ------- | ----------------------- |
| runtime | TypeScript, Bun         |
| ai      | LLM (tool-calling), MCP |
