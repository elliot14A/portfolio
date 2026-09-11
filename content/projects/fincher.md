# fincher

> autonomous operations engine for media post-production release pipelines:
> catching defects, querying logs over MCP, and orchestrating closed-loop
> recovery.

| role | solo build · Google Agentic Cinema hackathon submission       |
| ---- | ------------------------------------------------------------- |
| when | Sep 2026                                                      |
| link | [fincher.elliot14a.work](https://fincher.elliot14a.work)      |
| repo | [elliot14A/fincher](https://github.com/elliot14A/fincher)     |

## the problem

Media post-production release pipelines face constant supply chain defects: audio
sync drift, revised master cuts, SLA breaches, and failed QC packages across
global territories. Resolving them before premiere deadlines usually means human
operators scrambling across email threads and spreadsheets to reassign vendors
and place delivery holds.

## what I built

Built as a submission for the Google Agentic Cinema hackathon: an autonomous
operations engine that detects defects, investigates root causes, and executes
remediation in a closed loop.

- **Asynchronous workflow graphs in Go**: event-driven graphs for incident
  triage, asset allocation, and auto-resolution running over Echo, with SSE
  streaming live execution traces.
- **Read-only AI agents with Gemini 2.5**: agents never mutate state directly.
  They query ClickHouse via MCP and operational SQLite through six structured
  tools to draft action plans.
- **Deterministic policy verifier**: every LLM proposal must pass strict Go
  invariants (market isolation, vendor accuracy >= 90%, turnaround inside
  premiere countdowns) before execution.
- **Closed-loop execution & scheduler**: a time-compressed scheduler (1 second =
  1 operational hour) runs turnaround tasks and triggers simulated QC callbacks
  to auto-resolve deliveries and title health.
- **Real-time operations UI**: Preact frontend with TanStack Router, Table, and
  Vanilla Extract, featuring territory matrix views, lineage DAGs, and a live
  defect simulator.

## stack

| area     | tech                                         |
| -------- | -------------------------------------------- |
| backend  | Go, Echo                                     |
| ai       | Gemini 2.5 Flash, Google ADK, ClickHouse MCP |
| data     | SQLite, ClickHouse                           |
| frontend | Preact, TanStack, Vanilla Extract            |
| infra    | NixOS, Caddy, Docker                         |
