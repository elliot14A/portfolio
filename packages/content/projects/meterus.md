# Meterus

Factly runs dozens of applications, and we wanted to track their usage and bill on it. Third-party metering products on the market felt bloated and expensive for what we needed. So we engineered our own in-house platform in Rust: cheaper, tailored to our actual workload, and combined with centralized API key management.

## What I Built

Owned the backend and led the project end to end from initial architecture to production:

- **Metering engine in Rust**: Asynchronous usage events stream in over Redpanda and land in ClickHouse, where aggregation queries are fast and cheap enough to execute on demand.
- **API-key management built in**: Tracks per-key usage with fine-grained access control and quota enforcement, combining metering and authentication in one unified service.
- **Production reliability**: Stable in production for over two years, metering dozens of user-facing production microservices with high availability and minimal maintenance.

## Technical Details

- **Language**: Rust
- **Event Streaming**: Redpanda (Kafka-compatible)
- **Analytical Storage**: ClickHouse (sparse indexes and collapsing merge trees)
- **Metadata**: Postgres
