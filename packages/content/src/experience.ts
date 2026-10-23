import type { ExperienceNode } from "./schema";

export const EXPERIENCE_TREE: ReadonlyArray<ExperienceNode> = [
  {
    period: "Feb 2026-now",
    company: "GaurData",
    role: "Technical Cofounder",
    items: [
      {
        period: "2026",
        role: "Gaur Data Engine (Rust, DuckDB, NATS, TanStack Start)",
      },
    ],
  },
  {
    period: "2022-2026",
    company: "Factly",
    role: "Senior Backend Developer",
    items: [
      {
        period: "2024-2026",
        role: "Project Lead, Meterus (Rust, ClickHouse, Redpanda)",
      },
      {
        period: "2024-2025",
        role: "Ruspie API Gateway & Proxy (Rust, Tokio)",
      },
      {
        period: "2023-2024",
        role: "Backend Developer (Go, Node.js, Postgres)",
      },
      {
        period: "2022-2023",
        role: "Backend Developer Intern",
      },
    ],
  },
  {
    period: "2019-2023",
    company: "Sreenidhi Institute of Science and Technology",
    role: "B.Tech, Electronics & Computer Engineering",
  },
];
