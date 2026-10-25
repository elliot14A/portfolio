# Tagore AI

Factly's government and policy research platform delivering cited, verified answers across millions of public records, structured data tables, and fact-checks.

## What I Built

- **Go Backend & Streaming API**: Built high-performance streaming services delivering hallucination-free answers across 2,000,000+ official government documents and 500,000+ structured tables.
- **Session & History Persistence**: Architected a centralized chat and session storage engine in Go and MongoDB for high-concurrency ingestion and low-latency context retrieval.
- **AI Gateway Layer**: Integrated Portkey and LiteLLM for intelligent model routing, automated provider fallbacks, latency tracking, and prompt evaluations across LLM providers.

## Technical Details

- **Language & Runtime**: Go
- **Persistence**: MongoDB, PostgreSQL
- **AI Gateway**: Portkey, LiteLLM
- **Authentication**: Ory Kratos, Keto, Oathkeeper
