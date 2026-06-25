use crate::routes::{dynamic_page, index, liturgy, sitemap, track_get_involved};
use actix_web::dev::Server;
use actix_web::{web, App, HttpServer, HttpResponse};
use chrono::Datelike;
use std::net::TcpListener;
use tera::Tera;


pub fn run(listener: TcpListener) -> Result<Server, std::io::Error> {
    // Initialize Tera with all HTML files in templates directory
    let tera = Tera::new("templates/**/*").expect("Failed to parse tera templates");
    // To optionally disable autoescape to prevent SSI content getting escaped if needed:
    // We leave autoescape for HTML, but templates like `navbar.html` are also HTML. Tera standard is safe.

    let tera = web::Data::new(tera);
    
    // Shared HTTP client for connection pooling
    let client = web::Data::new(
        reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(10))
            .connect_timeout(std::time::Duration::from_millis(1000))
            .build()
            .expect("Failed to create HTTP client")
    );

    let server = HttpServer::new(move || {
        App::new()
            .app_data(tera.clone())
            .app_data(client.clone())
            // Configure static files serving from /static
            .service(actix_files::Files::new("/static", "./static"))
            // Additionally map /pictures directly for old HTML references
            .service(actix_files::Files::new("/pictures", "./static/pictures"))
            // Handle main index route
            .service(
                web::resource("/")
                    .route(web::get().to(index))
                    .route(web::head().to(index)),
            )
            // Sitemap XML route
            .service(
                web::resource("/sitemap.xml")
                    .route(web::get().to(sitemap))
                    .route(web::head().to(sitemap)),
            )
            // Conversion tracking
            .service(
                web::resource("/api/track/get_involved")
                    .route(web::post().to(track_get_involved)),
            )
            // Liturgy dynamic route
            .service(
                web::resource("/liturgy/{year}/{month}")
                    .route(web::get().to(liturgy))
                    .route(web::head().to(liturgy)),
            )
            // Redirect old /liturgy.html to current month
            .service(
                web::resource("/liturgy.html")
                    .route(web::get().to(|_tera: web::Data<Tera>| async {
                        let now = chrono::Utc::now();
                        let year = now.year();
                        let month = match now.month() {
                            1 => "january", 2 => "february", 3 => "march", 4 => "april",
                            5 => "may", 6 => "june", 7 => "july", 8 => "august",
                            9 => "september", 10 => "october", 11 => "november", 12 => "december",
                            _ => "january",
                        };
                        HttpResponse::Found()
                            .append_header(("Location", format!("/liturgy/{}/{}", year, month)))
                            .finish()
                    })),
            )
            // Handle dynamic page routes
            .service(
                web::resource("/{page}.html")
                    .route(web::get().to(dynamic_page))
                    .route(web::head().to(dynamic_page)),
            )
            // Fallback for static items at root level (e.g. /robots.txt)
            .service(actix_files::Files::new("/", "./static"))
    })
    .listen(listener)?
    .run();
    Ok(server)
}
