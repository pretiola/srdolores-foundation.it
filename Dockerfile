# Builder stage
FROM rust:1-slim-bookworm as builder

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

# CSS build stage
FROM node:20-slim as css-builder
WORKDIR /app
COPY templates templates
COPY static static
RUN npm install tailwindcss @tailwindcss/cli
RUN npx @tailwindcss/cli -i ./static/css/styles.css -o ./static/css/tailwind.css --minify

# Runtime stage
FROM debian:bookworm-slim

# Install root certs and libssl
RUN apt-get update && apt-get install -y ca-certificates libssl3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/target/release/petriola /usr/local/bin/

# Copy standard setup
COPY static /app/static
COPY templates /app/templates
# Override cleanly compiled css from node stage
COPY --from=css-builder /app/static/css/tailwind.css /app/static/css/tailwind.css

ENV RUST_LOG="info"
EXPOSE 8080

CMD ["petriola"]
