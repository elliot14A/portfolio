# ruspie

> serve thousands of datasets straight from cloud object storage over REST, SQL,
> and GraphQL, with no database to load them into first.

| role | solo build, as an intern at Factly                |
| ---- | ------------------------------------------------- |
| when | Sep 2022 - Mar 2024                               |
| repo | [factly/ruspie](https://github.com/factly/ruspie) |

## the problem

Teams sit on piles of CSV and Parquet files with no quick way to query them. The
usual answer is to load everything into a database or a heavier analytics system
first. ruspie skips that step: point it at the files, in object storage or on
local disk, and query them where they already are.

## what I built

I built ruspie solo as an intern, then moved it to production.

- **Query engine in Rust** on Apache Arrow and DataFusion, reading CSV and
  Parquet from object storage and serving them over REST, SQL, and GraphQL.
- **An nl2sql endpoint** in the early days of the LLM wave, so people could ask
  for data in plain language and have the SQL run for them.
- **A CSV to Parquet pipeline**: scripts that converted the existing CSV datasets
  to Parquet, for faster queries and smaller storage.
- **Contributed to ROAPI**, a related open-source project, while building it.

## outcome

- In production it served 25,000+ datasets straight from GCS.
- Powered dataful.in, a marketplace of clean, ready-to-use public datasets for
  journalists.
- Moving the datasets from CSV to Parquet made queries faster and cut their
  storage footprint.
- Shipped solo, from an intern prototype to production; open-sourced as
  factly/ruspie.

## stack

| area    | tech                           |
| ------- | ------------------------------ |
| engine  | Rust, Apache Arrow, DataFusion |
| formats | CSV, Parquet                   |
| sources | S3, GCS, filesystem            |
| query   | REST, SQL, GraphQL, nl2sql     |
