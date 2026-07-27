# Gopie

> turn your data and documents into plain-language answers and reports, with no
> SQL or analyst in the loop.

| role | senior backend developer & project lead at Factly |
| ---- | ------------------------------------------------- |
| when | Apr 2024 - Jan 2026                               |
| link | [gopie.ai](https://gopie.ai)                      |
| repo | [factly/gopie](https://github.com/factly/gopie)   |

## the problem

Getting answers out of data usually means knowing SQL or waiting on an analyst.
Gopie removes that step: upload your datasets and the documents that explain
them, then ask questions in plain English and get back answers and reports, each
one backed by the underlying data.

## what I built

I owned the backend and led the project, from PRD to production.

- **Backend from scratch in Go**, over Postgres: the query system, the REST API,
  and the natural-language path that turns a plain question into a query and a
  structured answer. I took cues from prior art like Rill and WrenAI.
- **Hexagonal architecture** (ports and adapters), so the query core stays
  independent of its transport and storage, which kept it easy to test and
  extend as the product grew.

## outcome

- Cut typical query latency from 3 to 5 seconds down to sub-second.
- Delivered the full PRD from first spec to production.
- Led the backend and coordinated the AI team, frontend interns, and devops,
  turning stakeholder requirements into tasks, delegating them, and mentoring a
  few teammates along the way.
- Shipped to production and open-sourced under AGPL; it's the backend behind
  gopie.ai.

## stack

| area     | tech     |
| -------- | -------- |
| backend  | Go       |
| database | Postgres |
