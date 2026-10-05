# Meterus

> in-house usage metering and API-key management in one Rust service, built to
> replace metering SaaS that felt bloated and expensive.

| role | senior backend developer & project lead at Factly |
| ---- | ------------------------------------------------- |
| when | Apr 2024 - Jan 2026                               |

## the problem

Factly runs dozens of applications, and we wanted to track their usage and
eventually bill on it. The metering products on the market, OpenMeter, Orb,
Metronome, felt bloated and expensive for what we needed. So we built our own:
cheaper, and shaped to our actual usage. We also wanted one central place to
manage API keys with fine-grained access control.

## what I built

I owned the backend and led the project end to end, building it with two interns
on the frontend.

- **Metering engine in Rust**: `Usage events stream in over Redpanda and land in ClickHouse, where aggregation is cheap enough to run on demand.`
- **API-key management built in**: `Tracks per-key usage out of the box with fine-grained access control, so metering and keys live in one place instead of two.`
- **Led delivery**: I ran the project with two interns on the Next.js frontend,
  turning stakeholder requirements into tasks and delegating them, while staying
  mostly on the backend myself.

## outcome

- `Stable in production for over two years, with little maintenance.`
- `Meters more than a dozen user-facing production applications at a fraction of the cost of SaaS.`
- Folds API-key management into the same service, so it's one less thing to run.

## stack

| area     | tech                 |
| -------- | -------------------- |
| backend  | Rust                 |
| frontend | Next.js              |
| data     | Postgres, ClickHouse |
| events   | Redpanda             |
| auth     | Better Auth          |
