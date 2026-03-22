use petriola::startup::run;
use std::net::TcpListener;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    let listener = TcpListener::bind("0.0.0.0:8080").expect("Failed to bind port 8080");
    log::info!("Server started on port 8080");
    run(listener)?.await
}
