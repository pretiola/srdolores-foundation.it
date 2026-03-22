use actix_web::rt::spawn;
use petriola::startup::run;
use std::net::TcpListener;

fn spawn_app() -> String {
    let listener = TcpListener::bind("127.0.0.1:0").expect("Failed to bind random port");
    let port = listener.local_addr().unwrap().port();
    let server = run(listener).expect("Failed to bind address");
    let _ = spawn(server);
    format!("http://127.0.0.1:{}", port)
}

#[actix_web::test]
async fn health_check_works() {
    let address = spawn_app();
    let client = reqwest::Client::new();

    let response = client
        .get(&format!("{}/", &address))
        .send()
        .await
        .expect("Failed to execute request.");

    assert!(response.status().is_success());
    let body = response.text().await.expect("Failed to get body");
    // Verify that the title is present (from index.html)
    assert!(body.contains("Piglet Project"));
    // Verify that the SSI replacement worked
    assert!(body.contains("Home"));
    assert!(body.contains("Our mission"));
}
