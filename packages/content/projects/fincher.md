# Fincher

Media post-production release pipelines face constant supply chain defects: audio sync drift, revised master cuts, SLA breaches, and failed QC packages across global territories. Resolving them before premiere deadlines usually means operators scrambling across spreadsheets and emails to reassign vendors and place delivery holds.

Built as an autonomous operations engine that detects defects, investigates root causes, and executes remediation in a closed loop.

## What I Built

- **Asynchronous workflow graphs in Go**: Event-driven execution graphs for incident triage, asset allocation, and auto-resolution running over Echo, with SSE streaming live execution traces.
- **Read-only AI agents with Gemini**: Agents never mutate state directly, querying ClickHouse and operational SQLite through structured tools to draft action plans.
- **Deterministic policy verifier**: Every LLM proposal must pass strict Go invariants (market isolation, vendor accuracy >= 90%, turnaround countdown limits) before execution.
- **Closed-loop execution and scheduler**: A time-compressed scheduler runs turnaround tasks and triggers simulated QC callbacks to auto-resolve deliveries and title health.

## Technical Details

- **Backend**: Go, Echo
- **AI**: Gemini, ClickHouse MCP
- **Data**: SQLite, ClickHouse
- **Deploy**: NixOS, Caddy, Docker
