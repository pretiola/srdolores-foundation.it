# Builder stage
FROM rust:1.85-slim as builder

WORKDIR /app
# Install dependencies required by some crates
RUN apt-get update && apt-get install -y pkg-config libssl-dev

# Copy over manifests
COPY Cargo.toml Cargo.lock ./

# Cache dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Copy source tree
COPY . .

# Build for release
RUN touch src/main.rs && cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install root certs and libssl
RUN apt-get update && apt-get install -y ca-certificates libssl3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/target/release/petriola /usr/local/bin/

# Copy static files and templates
COPY static /app/static
COPY templates /app/templates

ENV RUST_LOG="info"
EXPOSE 8080

CMD ["petriola"]
