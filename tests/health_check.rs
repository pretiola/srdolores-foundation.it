use actix_web::rt::spawn;
use pretiola::startup::run;
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
    assert!(body.contains("Piglet Project"));
    assert!(body.contains("Home"));
    assert!(body.contains("Our mission"));
}

#[actix_web::test]
async fn all_pages_return_200() {
    let address = spawn_app();
    let client = reqwest::Client::new();

    let pages = [
        "/",
        "/index.html",
        "/who_we_are.html",
        "/benificiaries.html",
        "/challenges.html",
        "/goals.html",
        "/holy_mass.html",
        "/get_involved.html",
        "/privacy_policy.html",
        "/terms_of_use.html",
    ];

    for page in pages {
        let response = client
            .get(&format!("{}{}", &address, page))
            .send()
            .await
            .unwrap_or_else(|_| panic!("Failed to request {}", page));
        assert!(
            response.status().is_success(),
            "Page {} returned {}",
            page,
            response.status()
        );
    }
}

#[actix_web::test]
async fn nonexistent_page_returns_404() {
    let address = spawn_app();
    let client = reqwest::Client::new();

    let response = client
        .get(&format!("{}/nonexistent.html", &address))
        .send()
        .await
        .expect("Failed to execute request.");

    assert_eq!(response.status(), 404);
}

#[actix_web::test]
async fn sitemap_returns_valid_xml() {
    let address = spawn_app();
    let client = reqwest::Client::new();

    let response = client
        .get(&format!("{}/sitemap.xml", &address))
        .send()
        .await
        .expect("Failed to execute request.");

    assert!(response.status().is_success());
    let content_type = response
        .headers()
        .get("content-type")
        .unwrap()
        .to_str()
        .unwrap()
        .to_string();
    assert!(content_type.contains("xml"));

    let body = response.text().await.expect("Failed to get body");
    assert!(body.contains("<urlset"));
    assert!(body.contains("srdolores-foundation.it"));
    // Should include content pages
    assert!(body.contains("index.html"));
    assert!(body.contains("who_we_are.html"));
    assert!(body.contains("get_involved.html"));
    // Should NOT include partials
    assert!(!body.contains("navbar.html"));
    assert!(!body.contains("footer.html"));
}

#[actix_web::test]
async fn head_requests_work() {
    let address = spawn_app();
    let client = reqwest::Client::new();

    let pages = ["/", "/index.html", "/sitemap.xml"];

    for page in pages {
        let response = client
            .head(&format!("{}{}", &address, page))
            .send()
            .await
            .unwrap_or_else(|_| panic!("HEAD request failed for {}", page));
        assert!(
            response.status().is_success(),
            "HEAD {} returned {}",
            page,
            response.status()
        );
    }
}

#[actix_web::test]
async fn donation_instructions_do_not_require_javascript() {
    let address = spawn_app();
    let body = reqwest::get(format!("{}/get_involved.html", address))
        .await.unwrap().text().await.unwrap();
    for instruction in ["60 families", "300 piglets", "IT41T3608105138265553265858",
        "BPPIITRRXXX", "0x344d169735f17D25E0d3AE8aa00b47F88D613017",
        "Ethereum Mainnet", "vitalimmanuel@gmail.com", "View EURC transfers on the public ledger"] {
        assert!(body.contains(instruction), "Missing non-JavaScript instruction: {}", instruction);
    }
    assert!(!body.contains("0.00</span>"), "Unknown totals must not render as zero");
    assert!(!body.contains("onclick="), "Payment actions must be added only when supported");
    assert!(!body.contains("<canvas"), "No blank QR canvas in the plain HTML fallback");
}

#[actix_web::test]
async fn x_tracking_is_not_exposed() {
    let address = spawn_app();
    let client = reqwest::Client::new();
    let body = client.get(format!("{}/get_involved.html", address))
        .send().await.unwrap().text().await.unwrap();
    for beacon in ["ads-twitter.com", "twq(", "/api/track/get_involved"] {
        assert!(!body.contains(beacon), "X tracking must not return in rendered HTML");
    }
    let response = client.post(format!("{}/api/track/get_involved", address))
        .send().await.unwrap();
    assert!(response.status().is_client_error());
}

#[actix_web::test]
async fn contact_and_text_qrs_are_available_without_javascript() {
    let address = spawn_app();
    let client = reqwest::Client::new();
    let body = client.get(format!("{}/get_involved.html", address))
        .send().await.unwrap().text().await.unwrap();
    let contact = body.split("Contact information</h2>").nth(1).unwrap();
    assert!(contact.contains("Fr. Emmanuel Kasibante"));
    for name in ["bank-custom", "bank-40", "ethereum-eurc"] {
        for suffix in ["", "-ascii"] {
            let path = format!("/static/qr/{}{}.txt", name, suffix);
            if suffix.is_empty() { assert!(body.contains(&path)); }
            let response = client.get(format!("{}{}", address, path)).send().await.unwrap();
            assert!(response.status().is_success());
            assert!(response.headers()["content-type"].to_str().unwrap().starts_with("text/plain"));
            let text = response.text().await.unwrap();
            assert!(text.lines().count() <= 24);
            assert!(text.lines().all(|line| line.chars().count() <= 80));
            if name.starts_with("bank") {
                assert!(text.contains("Bank transfer"));
            } else {
                assert!(text.contains("EURC") && text.contains("Ethereum Mainnet"));
            }
        }
    }
}
