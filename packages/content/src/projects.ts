import type { Project } from "./schema";

export const PROJECTS: ReadonlyArray<Project> = [
  {
    number: "01",
    title: "Gaur",
    company: "GAURDATA",
    period: "FEB 2026-PRESENT",
    summary:
      "The default backend for data apps. Defines metrics once and serves them to dashboards, web apps, and AI agents with identical numbers everywhere.",
    metrics: ["built solo from scratch", "Rust data engine", "DuckDB + Postgres + NATS"],
    link: "https://gaur.run",
  },
  {
    number: "02",
    title: "Meterus",
    company: "FACTLY",
    period: "2024-2026",
    summary:
      "In-house usage metering and API key management platform in Rust replacing expensive SaaS, metering dozens of production applications.",
    metrics: [
      "2+ years in production",
      "dozens of apps metered",
      "ClickHouse + Redpanda streaming",
    ],
    link: "https://github.com/elliot14A",
  },
  {
    number: "03",
    title: "Fincher",
    company: "GOOGLE AGENTIC CINEMA",
    period: "SEP 2026",
    summary:
      "Autonomous operations engine for media release pipelines with event-driven incident triage, defect detection, and closed-loop recovery.",
    metrics: ["autonomous agent recovery", "Echo + Go event graphs", "ClickHouse + Gemini"],
    link: "https://github.com/elliot14A/fincher",
  },
  {
    number: "04",
    title: "Ruspie",
    company: "FACTLY",
    period: "2024-2025",
    summary:
      "High-throughput reverse proxy and API gateway in Rust with distributed rate limiting and dynamic route matching.",
    metrics: ["sub-millisecond latency", "Rust async tokio"],
    link: "https://github.com/elliot14A",
  },
];
