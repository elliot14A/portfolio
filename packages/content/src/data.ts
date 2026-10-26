import type {
  PersonalProject,
  Profile,
  ProjectDoc,
  RoleExperience,
  SelectedWorkItem,
  SystemProject,
} from "./schema";

export const GAUR_PROJECT: SystemProject = {
  slug: "gaur",
  title: "Gaur",
  role: "Co-Founder",
  company: "GaurData",
  period: "Feb 2026 - Aug 2026",
  liveUrl: "https://gaur.run",
  tagline:
    "Governed semantic layer and agent runtime turning analytical data into stable contracts",
  summary:
    "Governed semantic layer turning analytical data into stable contracts queried by apps, dashboards, and AI agents across REST, OpenAI-compatible chat, and streamable MCP.",
  highlights: [
    "Took customer data from raw upload to governed, queryable contracts in [under 10 minutes]",
    "Unified Rust backend integrating [rig.rs agent runtimes] with vectorized DuckDB query execution",
    "Built three-protocol consumption layer: [REST, OpenAI-compatible SSE chat, and streamable HTTP MCP]",
    "Declarative semantic layer with automated schema inference and [row-level security (RLS)]",
  ],
  techStack: [
    "TypeScript",
    "Rust",
    "TanStack Start",
    "TanStack AI",
    "rig.rs",
    "DuckDB",
    "Postgres",
    "gRPC",
    "MCP",
  ],
  overview: [
    "Gaur is a [governed semantic layer for analytical data]. It turns fragmented tables and models into governed contracts: stable, permissioned interfaces that applications, dashboards, and AI agents query without writing SQL or touching raw schemas. A query against a contract returns a correct answer or a clear error, never a silently wrong number.",
    "Gaur separates two jobs: builders connect data sources, explore schemas, and publish contracts; integrators query those contracts through [three first-class protocols]: a structured REST query API, an OpenAI-compatible SSE chat completions endpoint, and a streamable HTTP Model Context Protocol (MCP) server.",
  ],
  whatIBuilt: [
    "End-to-End Platform Surface: Built solo from scratch in TypeScript on [TanStack Start and TanStack AI] with server functions, SSR, SSE streaming, and session authentication.",
    "Unified Rust Backend & Agent Runtime: Vectorized analytical execution engine and autonomous agent runtimes powered by [rig.rs], isolating queries into per-tenant DuckDB processes over async gRPC (tonic).",
    "Three-Protocol Consumption Layer: Implemented the structured REST query API, an OpenAI-compatible chat endpoint streaming custom [delta.gaur_event] payloads, and an HTTP streamable MCP server for AI agents.",
    "Connector & Ingestion Pipeline: Automated schema inference, DuckDB indexing, and multi-source connectors (S3, Cloudflare R2, Postgres, MySQL, SQLite, Stripe, Webhooks) with full and incremental syncs in [under 10 minutes].",
    "Semantic Contract & Governance Engine: Declarative contracts enforcing single-fact rules, fan-out/chasm prevention, [row-level security (RLS)], and cryptographic audit logging.",
  ],
};

export const GOPIE_PROJECT: SystemProject = {
  slug: "gopie",
  title: "Gopie",
  role: "Senior Backend Developer",
  company: "Factly Media & Research",
  period: "May 2024 - Jan 2026",
  liveUrl: "https://gopie.ai",
  repoUrl: "https://github.com/factly/gopie",
  tagline:
    "Conversational AI data analyst and multi-OLAP query engine translating natural language into verified SQL",
  summary:
    "Enterprise conversational data analyst powered by a multi-agent LangGraph runtime and high-concurrency Go backend, routing natural-language questions into verified SQL executed across DuckDB and ClickHouse with sub-500ms latency.",
  highlights: [
    "Multi-agent nl2sql orchestration using [LangGraph, Qdrant semantic schema search, and LangSmith evals]",
    "Concurrent analytical backend in Go using [hexagonal architecture and sqlc]",
    "Slashed multi-OLAP query execution latency from [5s down to under 500ms]",
    "Sandboxed Python execution in [E2B microVMs] and automated Vega-Lite visualization",
  ],
  techStack: [
    "Go",
    "Python",
    "FastAPI",
    "LangGraph",
    "LangSmith",
    "Qdrant",
    "DuckDB",
    "ClickHouse",
    "PostgreSQL",
    "E2B",
    "Vega-Lite",
  ],
  overview: [
    "Non-technical teams frequently need rapid answers from complex datasets without waiting on a dedicated data team to write bespoke SQL queries. When users rely on raw general-purpose LLMs, they face hallucinated columns, invalid JOIN operations, and severe schema blind spots.",
    "Gopie is an enterprise AI Data Analyst that bridges conversational questions into [verified, deterministic SQL] and dynamic visual charts. It isolates operational application databases from heavy analytical workloads by routing analytical execution through high-speed columnar OLAP engines.",
  ],
  whatIBuilt: [
    "Multi-Agent Query Orchestration: Built the core AI agent in FastAPI using [LangGraph], featuring a supervisor agent that routes between single-dataset and multi-dataset sub-graphs with query decomposition and parallel execution.",
    "Semantic Schema Search & Vector Retrieval: Implemented vector-based schema retrieval using [Qdrant] and OpenAI embeddings, indexing tables, column metadata, and sample distributions to feed precise context into LLM prompts without token overflow.",
    "Concurrent Go Backend & Hexagonal Architecture: Engineered the core backend in Go following [hexagonal architecture] with sqlc-generated type-safe PostgreSQL queries, managing multi-tenant workspaces, dataset uploads, and Zitadel authentication.",
    "Multi-OLAP Routing & Latency Optimization: Implemented query execution across DuckDB and ClickHouse, optimizing Parquet S3 streaming and analytical aggregations to slash OLAP execution latency from [5s down to under 500ms].",
    "Sandboxed Code Execution & Visualizations: Integrated [E2B secure microVM sandboxes] to safely run arbitrary Python data transformations and built automated Vega-Lite chart generation for interactive visual insights.",
    "Observability & Evaluation Benchmarks: Instrumented the full query generation pipeline with [LangSmith] for prompt versioning, automated evaluation benchmarks, and systematic triage of SQL generation accuracy.",
  ],
};

export const METERUS_PROJECT: SystemProject = {
  slug: "meterus",
  title: "Meterus",
  role: "Senior Backend Developer",
  company: "Factly Media & Research",
  period: "May 2024 - Jan 2026",
  repoUrl: "https://github.com/factly/meterus-go",
  tagline:
    "High-availability telemetry and metering engine benchmarked to process millions of events per second",
  summary:
    "High-availability telemetry and usage-metering engine in Rust benchmarked to ingest millions of events per second via Redpanda into ClickHouse with 99.99% production uptime and sub-millisecond quota checks.",
  highlights: [
    "Benchmarked to ingest [millions of events per second] with high availability",
    "Maintained [99.99% production uptime] across all internal microservices and APIs",
    "Ultra-low latency quota enforcement resolving in [under 1 millisecond]",
    "Standardized telemetry ingestion on [CloudEvents v1.0 and gRPC]",
  ],
  techStack: [
    "Rust",
    "Redpanda (Kafka)",
    "ClickHouse",
    "gRPC (Tonic)",
    "Protobuf",
    "PostgreSQL",
    "Redis",
    "CloudEvents",
    "Go",
    "Docker",
  ],
  overview: [
    "Multiple production data products and AI applications at Factly handle millions of API requests and data queries each day. Third-party commercial billing and metering tools were cost-prohibitive at high volume and introduced intolerable network latency into the critical request path.",
    "Meterus was engineered in-house as a [high-availability, high-throughput metering engine] in Rust. It decouples high-volume event ingestion from transactional business logic, processing CloudEvents streams through distributed message queues into columnar storage for instant aggregation.",
  ],
  whatIBuilt: [
    "High-Throughput Streaming Ingestion: Built high-performance async streaming workers in Rust on Tokio, benchmarked to ingest [millions of events per second] from Redpanda partitions into ClickHouse batch buffers without event loss.",
    "High-Availability Cluster Architecture: Architected horizontal worker partitioning with automated consumer group rebalancing, maintaining [99.99% production uptime] over two years of continuous operation.",
    "Sub-Millisecond Quota Enforcement: Built low-latency gRPC validation services with in-memory caching and Redis fallbacks, evaluating customer quotas and API key entitlements in [under 1 millisecond].",
    "Vectorized Analytical Metering: Configured ClickHouse schemas and materialized views for sub-second aggregations (counts, sums, unique subjects, rolling billing windows) across [hundreds of millions of historical events].",
    "Cross-Language Client SDKs: Authored official client libraries including [meterus-go] and meterus-js, providing idiomatic CloudEvent producers, retry pipelines, and background batching.",
  ],
};

export const TAGORE_PROJECT: SystemProject = {
  slug: "tagore",
  title: "Tagore AI",
  role: "Back End Developer",
  company: "Factly Media & Research",
  period: "Feb 2023 - Apr 2024",
  liveUrl: "https://tagore.ai",
  tagline:
    "AI research platform delivering cited, hallucination-free answers across 2,000,000+ official documents",
  summary:
    "Enterprise AI research platform delivering cited, zero-hallucination answers across 2,000,000+ government records, 500,000+ data tables, and 700,000+ fact checks via a Go streaming backend and LangGraph agent.",
  highlights: [
    "Zero-hallucination research agent indexing [2,000,000+ official documents and 500,000+ tables]",
    "High-throughput streaming backend built in [Go with Server-Sent Events (SSE)]",
    "Centralized chat history microservice in [Go and MongoDB] powering internal apps",
    "Enterprise AI gateway layer using [Portkey and LiteLLM] with automated provider fallbacks",
  ],
  techStack: [
    "Go",
    "Python",
    "LangGraph",
    "pgvector",
    "Qdrant",
    "MongoDB",
    "PostgreSQL",
    "Portkey",
    "LiteLLM",
    "Server-Sent Events (SSE)",
  ],
  overview: [
    "Journalists, public policy researchers, and fact-checkers face a critical trust gap with conventional LLMs: generative AI regularly hallucinates statistics, misattributes quotes, and cannot cite official gazettes, parliamentary records, or verified fact checks.",
    "Tagore AI is a zero-hallucination research platform backed by official institutional sources: [2,000,000+ official documents] (Parliament questions, PIB press releases, central statutes), 500,000+ structured data tables from Dataful, and 700,000+ verified fact checks in ClaimReview. Queries produce structured, evidence-grounded responses with verbatim citations and verifiable primary-source links.",
  ],
  whatIBuilt: [
    "Go Real-Time Streaming Backend: Engineered high-concurrency streaming API endpoints in Go using [Server-Sent Events (SSE)], multiplexing LLM token streams with citation payloads and data table references directly to client frontends with low time-to-first-token (TTFT).",
    "Deep Research Agent: Built the multi-step research agent in Python using [LangGraph], decomposing complex analytical questions into targeted sub-queries across Parliament archives, PIB releases, and legislative gazettes in Research Mode.",
    "Hybrid Vector Retrieval: Implemented dense and sparse retrieval across [Qdrant and pgvector], orchestrating semantic embedding search alongside exact-match keyword filters across 2M+ vectorized government records.",
    "Centralized Chat History Service: Architected and deployed an independent [microservice in Go and MongoDB] to persist conversational state, session context, and citation metadata across all AI applications at Factly.",
    "AI Gateway & Resilience Layer: Integrated [Portkey and LiteLLM] as the central gateway layer, implementing intelligent model routing, automated multi-provider fallbacks (OpenAI, Anthropic, open-weights), latency tracking, and prompt evals.",
  ],
};

export const RUSPIE_PROJECT: SystemProject = {
  slug: "ruspie",
  title: "Ruspie",
  role: "Back End Developer",
  company: "Factly Media & Research",
  period: "Sep 2022 - Jan 2023",
  liveUrl: "https://dataful.in",
  repoUrl: "https://github.com/factly/ruspie",
  tagline: "In-place analytical query engine in Rust on Apache Arrow and DataFusion",
  summary:
    "In-place analytical query engine in Rust built on Apache Arrow and DataFusion, executing SQL, GraphQL, and REST queries directly against CSV and Parquet files in cloud storage without database pre-loading.",
  highlights: [
    "In-place analytical query engine built from scratch in Rust on [Apache Arrow and DataFusion]",
    "Core query engine powering [dataful.in] across 25,000+ public datasets",
    "Multi-protocol querying over [REST parameter filtering, ANSI SQL, and GraphQL]",
    "Upstream contributor to [roapi], the open-source static dataset query framework",
  ],
  techStack: [
    "Rust",
    "Apache Arrow",
    "DataFusion",
    "Tokio",
    "AWS S3",
    "Google Cloud Storage",
    "MinIO",
    "GraphQL",
    "Docker",
  ],
  overview: [
    "Data portals and analytical teams frequently hoard massive archives of CSV and Parquet files in cloud object storage. Querying these datasets conventionally requires spinning up heavy database clusters, defining rigid relational schemas, and running slow ETL pipelines before running a single query.",
    "Ruspie is an open-source, in-place query engine written in Rust. It bypasses database pre-loading entirely: point it at an S3 bucket, Google Cloud Storage prefix, or local folder, and run immediate [ANSI SQL, GraphQL, and REST queries] directly against raw columnar batches using the Apache Arrow in-memory format.",
  ],
  whatIBuilt: [
    "Vectorized Query Execution Engine: Built the core server in Rust leveraging [DataFusion and Apache Arrow], registering files dynamically into execution plans and streaming RecordBatches with zero serialization waste.",
    "Cloud Object Storage Streaming: Engineered streaming readers for [AWS S3, Google Cloud Storage, and MinIO], streaming byte ranges for columnar Parquet footers and projections without downloading whole files.",
    "Multi-Protocol Query Interface: Implemented unified routing supporting [REST query parameters, ANSI SQL, and GraphQL], enabling frontend data exploration tables to sort, filter, and paginate on the fly.",
    "Production Scaling for Dataful: Deployed and operated Ruspie as the primary analytical engine for dataful.in, querying [25,000+ public datasets] straight from cloud storage with zero database maintenance.",
    "Upstream Open-Source Contributions: Contributed performance enhancements and fixes upstream to [roapi], collaborating on Apache Arrow integration and cloud storage adapters.",
  ],
};

export const ROCKY_PROJECT: SystemProject = {
  slug: "rocky",
  title: "Rocky",
  role: "Author & Creator",
  company: "Personal Project",
  period: "2026",
  repoUrl: "https://github.com/elliot14A/rocky.git",
  tagline: "Opinionated NixOS fleet deployment CLI tool written in Rust",
  summary:
    "Opinionated NixOS fleet deployment tool in Rust managing cloud VPS instances across Hetzner and OCI with automated Disko partitioning, Tailscale networking, Agenix secret scoping, and zero-downtime rollbacks.",
  highlights: [
    "Automated blank VPS bootstrapping using [Disko and nixos-anywhere] over SSH",
    "Declarative fleet layout mapping NixOS service modules to hosts with [automatic Caddy reverse-proxy routing]",
    "Fine-grained secret scoping deriving [Agenix recipient keys] per host workload",
    "Atomic deployments and automated rollbacks powered by [deploy-rs]",
  ],
  techStack: [
    "Rust",
    "Nix / NixOS",
    "Disko",
    "deploy-rs",
    "Tailscale",
    "Agenix (Age)",
    "Hetzner Cloud",
    "OCI",
  ],
  overview: [
    "Managing fleets of NixOS servers across multiple cloud providers (Hetzner Cloud and Oracle Cloud Infrastructure) often requires repetitive bootstrapping, manual disk partitioning, and error-prone secret distribution.",
    "Rocky is an opinionated fleet deployment tool written in Rust. You define your services as standard NixOS modules, map them to hosts in a declarative fleet environment file, and use Rocky to bootstrap blank VPS machines from scratch and deploy atomic system closures with [zero downtime].",
  ],
  whatIBuilt: [
    "Automated Disk Formatting & OS Bootstrap: Orchestrated Disko and nixos-anywhere over SSH to wipe blank VPS disks, inject dedicated host SSH keys, and install NixOS unattended.",
    "Service Addressing & Reverse Proxy: Dynamically computed private [Tailscale mesh addresses] and generated Caddy reverse-proxy upstream configs directly from fleet topologies.",
    "Least-Privilege Secret Scoping: Implemented automated [Agenix recipient key derivation] so hosts only receive decryption keys for secrets their assigned services actually consume.",
    "Deployment & Rollback Engine: Built atomic deployment workflows on top of deploy-rs, validating system activation and triggering [immediate rollbacks if systemd units fail].",
    "CLI & Developer Workflow: Built an ergonomics-first [CLI in Rust] (rocky new env, rocky new host, rocky up, rocky status) providing live connectivity and generation tracking.",
  ],
};

export const PORTFOLIO_PROJECT: SystemProject = {
  slug: "portfolio",
  title: "Portfolio",
  role: "Author & Creator",
  company: "Personal Project",
  period: "2026",
  repoUrl: "https://github.com/elliot14A/portfolio.git",
  tagline:
    "Type-safe portfolio and streaming AI agent built with Effect 4.x, deployed to a single Cloudflare Worker",
  summary:
    "High-performance personal portfolio and conversational AI agent deployed as a single Cloudflare Worker, combining Effect 4.x type safety, Preact SSR, and D1 rate limiting.",
  highlights: [
    "End-to-end typed schema contract with [Effect 4.x HttpApi] and zero manual fetch calls",
    "Interactive streaming AI agent with [typed tool calling] over structured portfolio data",
    "Single Cloudflare Worker bundling [Preact SSR, static asset CDN, and D1 rate limiting]",
    "Zero-runtime CSS with [Vanilla Extract] in a distraction-free Rosé Pine terminal design",
  ],
  techStack: [
    "TypeScript",
    "Effect 4.x",
    "Preact",
    "Cloudflare Workers",
    "Cloudflare D1",
    "Vanilla Extract",
    "Bun",
    "Nix",
  ],
  overview: [
    "Most developer portfolios fall into two extremes: either a static brochure page that quickly goes stale, or a heavy SPA framework bundle running client-side API requests with fragile fetch wrappers. I wanted something fast, scannable, and robust: a minimal Rosé Pine terminal interface that renders cleanly on the server, paired with a personal AI assistant that can accurately answer questions about my background without hallucinating.",
    "The entire application is built on top of [Effect 4.x] for strict functional type safety, and deployed as a single Cloudflare Worker that combines server-side rendering, static asset CDN caching, and an SSE streaming AI agent without any container overhead.",
  ],
  whatIBuilt: [
    "Grounded AI Terminal Assistant: Engineered a conversational agent powered by Effect AI tools that query structured portfolio models directly, streaming verified answers, related links, and recruiter-focused suggestions with [zero vector database overhead].",
    "End-to-End Type Safety with Effect 4.x: Defined the complete API contract using [HttpApiEndpoint and HttpApiClient], replacing all manual fetch calls with validated schemas across request bodies, SSE byte streams, and tagged domain errors.",
    "Edge Compute & D1 Rate Limiting: Deployed the app to a single Cloudflare Worker using Cloudflare D1 to track [per-device sliding-window limits and global daily quotas], protecting LLM API spend from abuse.",
    "Zero-Runtime Styling & Performance: Co-located design tokens and styles using [Vanilla Extract], achieving sub-millisecond SSR times and 60kb total CSS output served directly through Cloudflare Workers Static Assets CDN.",
  ],
};

export const ALL_PROJECTS: readonly SystemProject[] = [
  GAUR_PROJECT,
  GOPIE_PROJECT,
  METERUS_PROJECT,
  TAGORE_PROJECT,
  RUSPIE_PROJECT,
  ROCKY_PROJECT,
  PORTFOLIO_PROJECT,
];

export const PROJECTS_BY_SLUG: Readonly<Record<string, SystemProject>> = {
  gaur: GAUR_PROJECT,
  gopie: GOPIE_PROJECT,
  meterus: METERUS_PROJECT,
  tagore: TAGORE_PROJECT,
  ruspie: RUSPIE_PROJECT,
  rocky: ROCKY_PROJECT,
  portfolio: PORTFOLIO_PROJECT,
};

export const ROLE_EXPERIENCES: readonly RoleExperience[] = [
  {
    role: "Co-Founder",
    company: "GaurData",
    period: "Feb 2026 - Aug 2026",
    location: "Hyderabad, India",
    bullets: [
      "Handled tech and product end to end as solo technical founder, taking customer data from raw upload to an interactive queryable application in [under 10 minutes] at [Gaur](/projects/gaur).",
      "Architected a unified Rust backend integrating vectorized query execution with [rig.rs agent runtimes] and async gRPC microservices.",
      "Shipped generative data exploration interfaces with [TanStack Start and TanStack AI], backed by custom MCP servers in Rust and TypeScript.",
      "Engineered multi-source connectors (S3, Cloudflare R2, Postgres, Stripe, Webhooks) and declarative semantic contracts with [row-level security (RLS)] and automated schema inference.",
    ],
  },
  {
    role: "Senior Backend Developer",
    company: "Factly Media & Research",
    period: "May 2024 - Jan 2026",
    location: "Hyderabad, India",
    bullets: [
      "Built [Gopie](/projects/gopie) end to end: high-concurrency backend services in Go, and the [natural-language-to-SQL agent] in FastAPI with LangGraph.",
      "Optimized OLAP query execution across DuckDB and ClickHouse, slashing analytical query latency from [5s down to under 500ms].",
      "Built and operated [Meterus](/projects/meterus), a high-availability telemetry pipeline in Rust benchmarked to process [millions of events per second] into ClickHouse with [99.99% production uptime].",
      "Mentored junior engineers and interns through regular pairing sessions and code reviews, establishing [engineering quality standards] across Go, Rust, and TypeScript.",
    ],
  },
  {
    role: "Back End Developer",
    company: "Factly Media & Research",
    period: "Feb 2023 - Apr 2024",
    location: "Hyderabad, India",
    bullets: [
      "Built the Go streaming backend and multi-step research agent behind [Tagore AI](/projects/tagore), delivering cited answers across [2,000,000+ government documents and 500,000+ tables].",
      "Architected a [centralized chat history service] in Go and MongoDB powering internal AI chat applications with low-latency context retrieval.",
      "Integrated [Portkey and LiteLLM] as an AI gateway layer to orchestrate intelligent model routing and automated provider fallbacks.",
      "Maintained and optimized [Kavach](https://github.com/factly/kavach.git) on Ory Kratos, and scaled [ruspie](/projects/ruspie) in Rust to query [25,000+ public datasets] straight from cloud storage.",
    ],
  },
  {
    role: "Back End Developer Intern",
    company: "Factly Media & Research",
    period: "Sep 2022 - Jan 2023",
    location: "Remote",
    bullets: [
      "Built [ruspie](/projects/ruspie) from scratch in Rust on top of Apache Arrow and DataFusion to query CSV and Parquet files directly from cloud storage with [zero database pre-loading].",
      "Shipped ruspie as the core query engine powering [dataful.in](https://dataful.in) and open-sourced it at [github.com/factly/ruspie](https://github.com/factly/ruspie).",
      "Contributed upstream to [roapi](https://github.com/roapi/roapi), an open-source query framework for static datasets.",
    ],
  },
];

export const PERSONAL_PROJECTS: readonly PersonalProject[] = [
  {
    name: "rocky",
    repoUrl: "https://github.com/elliot14A/rocky.git",
    writeupSlug: "rocky",
    description:
      "Opinionated NixOS fleet deployment CLI tool in Rust managing VPS instances across Hetzner and OCI with automated bootstrapping, secret scoping, and zero-downtime rollbacks.",
    highlights: [
      "Automated blank VPS bootstrapping with [Disko and nixos-anywhere over SSH].",
      "Least-privilege secret scoping deriving [Agenix recipient keys] per host workload.",
      "Atomic deployments and automated rollbacks powered by [deploy-rs over Tailscale].",
    ],
    techStack: ["Rust", "Nix / NixOS", "Disko", "deploy-rs", "Tailscale", "Agenix"],
  },
  {
    name: "portfolio",
    repoUrl: "https://github.com/elliot14A/portfolio.git",
    writeupSlug: "portfolio",
    description:
      "Type-safe portfolio and streaming AI agent built with Effect 4.x, deployed to a single Cloudflare Worker.",
    highlights: [
      "End-to-end typed contract with [Effect 4.x HttpApi] and zero manual fetch calls.",
      "Grounded conversational AI agent with [streaming SSE tool execution] and D1 rate limiting.",
      "Fast Preact SSR with [Vanilla Extract zero-runtime styles] and static asset CDN caching.",
    ],
    techStack: [
      "TypeScript",
      "Effect 4.x",
      "Preact",
      "Cloudflare Workers",
      "Cloudflare D1",
      "Vanilla Extract",
      "Bun",
    ],
  },
  {
    name: "fincher",
    repoUrl: "https://github.com/elliot14A/fincher.git",
    liveUrl: "https://fincher.elliot14a.work",
    description:
      "Autonomous operations engine for media post-production release pipelines: catching defects, querying logs over MCP, and orchestrating closed-loop recovery.",
    highlights: [
      "Asynchronous workflow graphs in Go running event-driven incident triage over [live SSE traces].",
      "Read-only AI agents with Gemini 2.5 querying ClickHouse and SQLite through [custom MCP tools].",
      "Deterministic policy verifier enforcing [vendor accuracy >= 90%] and market isolation.",
    ],
    techStack: ["Go", "Echo", "Gemini 2.5 Flash", "ClickHouse MCP", "SQLite", "Preact", "NixOS"],
  },
  {
    name: "cerberust",
    repoUrl: "https://github.com/elliot14A/cerberust.git",
    description:
      "Reliable Rust authentication server built on Axum, Diesel, and PostgreSQL with fine-grained access control.",
    highlights: [
      "JWT authentication with [automatic refresh token rotation] and reuse detection.",
      "Hierarchical resource trees and [Role-Based Access Control (RBAC)].",
      "Declarative configuration via [cerberust.toml] with Docker Compose orchestration.",
    ],
    techStack: ["Rust", "Axum", "PostgreSQL", "Diesel", "Docker", "JWT"],
  },
];

export const TOOLBOX = [
  {
    category: "languages",
    items: ["TypeScript", "JavaScript", "Python", "Go", "Rust", "SQL"],
  },
  {
    category: "ai & agents",
    items: [
      "LangGraph",
      "rig.rs",
      "Google ADK",
      "LangSmith",
      "Portkey",
      "LiteLLM",
      "MCP",
      "pgvector",
      "Qdrant",
    ],
  },
  {
    category: "backend & systems",
    items: ["Effect-TS", "FastAPI", "Tonic (gRPC)", "Echo", "Axum", "Node.js", "SSE"],
  },
  {
    category: "data & infra",
    items: ["Postgres", "DuckDB", "ClickHouse", "Redis", "Kafka", "Cloudflare", "Docker", "NixOS"],
  },
  {
    category: "frontend & tooling",
    items: ["TanStack Start", "TanStack AI", "React", "Preact", "Bun", "Tailwind CSS", "v0"],
  },
] as const;

export const PROFILE: Profile = {
  name: "Akshith Katkuri",
  handle: "elliot14a",
  roleBadges: ["Fullstack AI Engineer", "AI Platforms & Agents"],
  location: "Hyderabad, Telangana, India",
  links: {
    email: "akshithmadhur0072@gmail.com",
    github: "https://github.com/elliot14A",
    linkedin: "https://www.linkedin.com/in/akshith-katkuri-14am",
  },
  photoUrl: "/fightclub.jpg",
  bio: [
    "I'm a fullstack engineer who builds AI platforms and agent systems from the ground up to production. I like working close to the hard problems: query engines, concurrency, and engineering agents that are reliable, tested, and deterministic. Rust is where I have the most fun, though I don't box myself into one language or framework: shipping across Rust, Go, Python, and TypeScript.",
    "Co-founder at GaurData, previously at Factly. Building [production AI platforms, query engines, and agent systems].",
  ],
  toolbox: [...TOOLBOX],
  experience: [...ROLE_EXPERIENCES],
  personalProjects: [...PERSONAL_PROJECTS],
};

// Compatibility exports
export const SELECTED_WORK: readonly SelectedWorkItem[] = ALL_PROJECTS.map((p) => ({
  title: p.title,
  company: p.company,
  period: p.period,
  summary: p.summary,
  highlights: p.highlights,
  slug: p.slug,
}));

export const EXPERIENCE = ROLE_EXPERIENCES.map((r) => ({
  period: r.period,
  company: r.company,
  role: r.role,
}));

export const LEGACY_PROJECTS_BY_SLUG: Readonly<Record<string, ProjectDoc>> = Object.fromEntries(
  ALL_PROJECTS.map((p) => [
    p.slug,
    {
      slug: p.slug,
      title: p.title,
      content: `# ${p.title}\n\n${p.overview.join("\n\n")}\n\n## What I Built\n\n${p.whatIBuilt
        .map((b) => `- ${b}`)
        .join("\n")}`,
    },
  ]),
);

export const AGENT_CONTEXT = `# PROFILE
Name: ${PROFILE.name} (${PROFILE.handle})
Roles: ${PROFILE.roleBadges.join(" · ")}
Location: ${PROFILE.location}
Bio: ${PROFILE.bio.join(" ")}

# TOOLBOX
${TOOLBOX.map((t) => `${t.category}: ${t.items.join(", ")}`).join("\n")}

# EXPERIENCE
${ROLE_EXPERIENCES.map(
  (r) =>
    `${r.role}, ${r.company} (${r.period}) · ${r.location}
${r.bullets.map((b) => `• ${b}`).join("\n")}`,
).join("\n\n")}

# PERSONAL PROJECTS
${PERSONAL_PROJECTS.map(
  (p) =>
    `${p.name} (${p.repoUrl}): ${p.description}
${p.highlights.map((h) => `• ${h}`).join("\n")}`,
).join("\n\n")}`;
