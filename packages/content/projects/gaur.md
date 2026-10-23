# Gaur

Two things stand between an app and the analytics it needs. You have to stand up a data stack and learn a data engineer's job first. And once more than one thing queries your data, a dashboard, the app, an AI agent, the same metric gets redefined in each place and the numbers quietly drift apart.

Gaur fixes both. You define your metrics, dimensions, and access rules once as a contract, and every consumer queries that same contract, so the numbers match everywhere. A query returns a correct answer or a clear error, never a silently wrong number.

## What I Built

The whole product, solo: backend, frontend, and the infrastructure under it.

- **Backend, entirely in Rust**: Vectorized execution engine using Apache Arrow and DataFusion for fast in-memory query processing.
- **The contract layer**: Define metrics, dimensions, and row-level security once, and Gaur validates the model so a contract cannot fan out into a wrong aggregate.
- **Three ways to consume a contract**: A REST query API, an OpenAI-compatible chat endpoint that streams answers, and an MCP server so agents query it directly.
- **Data and infrastructure**: Postgres for state catalogs, embedded DuckDB for fast OLAP query execution, and NATS for service discovery and real-time cache invalidation across distributed worker nodes.

## Technical Details

- **Language**: Rust
- **OLAP Engine**: DuckDB, Apache Arrow, DataFusion
- **State & Messaging**: Postgres, NATS
- **Deploy**: Cloudflare Workers, Hetzner, NixOS
