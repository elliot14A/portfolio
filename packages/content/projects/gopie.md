# Gopie

An AI data analyst for non-technical users, translating natural language questions into verified analytical queries executed against high-performance analytical storage.

## What I Built

- **Natural Language to SQL Agent**: Built using FastAPI, LangChain, and LangGraph, translating conversational user prompts into verified, deterministic SQL queries executed against DuckDB.
- **Multi-OLAP Backend**: Designed and implemented database abstractions supporting both DuckDB and ClickHouse, isolating analytical workloads from primary transactional systems.
- **Hexagonal Architecture**: Established company-wide architectural guidelines separating business logic from transport drivers, database engines, and third-party APIs.

## Technical Details

- **Language & Frameworks**: Python, FastAPI, LangChain, LangGraph
- **Query Engines**: DuckDB, ClickHouse
- **Storage**: PostgreSQL, SQLite
