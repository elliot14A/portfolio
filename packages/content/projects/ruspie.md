# Ruspie

Teams sit on large volumes of CSV and Parquet files with no fast way to query them without loading everything into a heavy database or data warehouse first. Ruspie skips that step: point it at files in cloud object storage or local disk, and query them directly in place.

## What I Built

Engineered solo as an intern at Factly and transitioned into production:

- **Query engine in Rust**: Built on Apache Arrow and DataFusion, reading CSV and Parquet directly from cloud storage and serving them over REST, SQL, and GraphQL.
- **Natural language to SQL endpoint**: An early nl2sql implementation allowing analysts to query tabular files using plain English prompts.
- **Conversion pipeline**: Scripts and batch workers converting legacy CSV datasets into Parquet format for faster analytical queries and smaller storage footprints.
- **Production impact**: Served more than 25,000 public datasets straight from Google Cloud Storage without loading into a relational database, powering dataful.in for data journalists.

## Technical Details

- **Engine**: Rust, Apache Arrow, DataFusion
- **Formats**: CSV, Parquet
- **Storage**: AWS S3, Google Cloud Storage, Local Filesystem
- **Protocols**: REST, SQL, GraphQL
