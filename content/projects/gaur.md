# Gaur

> the default backend for data apps: define your metrics once and serve them to
> every dashboard, app, and AI agent with the same numbers everywhere, no data
> engineer required.

| role | technical cofounder at GaurData · solo build |
| ---- | -------------------------------------------- |
| when | Feb 2026 - now                               |
| link | [gaur.run](https://gaur.run)                 |

## the problem

Two things stand between an app and the analytics it needs. You have to stand up
a data stack and learn a data engineer's job first. And once more than one thing
queries your data, a dashboard, the app, an AI agent, the same metric gets
redefined in each place and the numbers quietly drift apart.

Gaur fixes both. You define your metrics, dimensions, and access rules once as a
contract, and every consumer queries that same contract, so the numbers match
everywhere. A query returns a correct answer or a clear error, never a silently
wrong number.

## what I built

The whole product, solo: backend, frontend, and the infrastructure under it.

- **Backend, entirely in Rust**, including the AI agents. The whole data path is
  Rust, so there's no Python sitting in the middle of it.
- **The contract layer**: define data sources, dimensions, measures, and
  row-level security once, and Gaur validates the model so a contract can't fan
  out into a wrong aggregate.
- **Three ways to consume a contract**: a REST query API, an OpenAI-compatible
  chat endpoint that streams answers, and an MCP server so agents query it
  directly.
- **Frontend in TanStack Start**: the web console, the product site, and internal
  tools like the admin dashboard.
- **Data and infra**: Postgres for state, DuckDB for OLAP, and NATS for service
  discovery and the ingestion queue. The web apps run on Cloudflare Workers; the
  web console and the rest run on Hetzner, shipped with a custom Nix framework I
  built.

The piece I'm most proud of is **webhook ingestion**. Plenty of SaaS platforms
already push their events over webhooks, so rather than build a bespoke
integration per source, I built one webhook path that a wide range of them can
push straight into. It came out of early testers wanting more SaaS connectors
supported.

## stack

| area     | tech                              |
| -------- | --------------------------------- |
| backend  | Rust                              |
| frontend | TanStack Start                    |
| data     | Postgres, DuckDB, NATS            |
| infra    | Cloudflare Workers, Hetzner, Nix  |
| serve    | REST, MCP, OpenAI-compatible chat |
