use crate::routes::{dynamic_page, index};
use actix_web::dev::Server;
use actix_web::{App, HttpServer, web};
use std::net::TcpListener;
use tera::Tera;

pub fn run(listener: TcpListener) -> Result<Server, std::io::Error> {
    // Initialize Tera with all HTML files in templates directory
    let tera = Tera::new("templates/**/*").expect("Failed to parse tera templates");
    // To optionally disable autoescape to prevent SSI content getting escaped if needed:
    // We leave autoescape for HTML, but templates like `navbar.html` are also HTML. Tera standard is safe.

    let tera = web::Data::new(tera);

    let server = HttpServer::new(move || {
        App::new()
            .app_data(tera.clone())
            // Configure static files serving from /static
            .service(actix_files::Files::new("/static", "./static"))
            // Additionally map /pictures directly for old HTML references
            .service(actix_files::Files::new("/pictures", "./static/pictures"))
            // Handle main index route
            .route("/", web::get().to(index))
            // Handle dynamic page routes
            .route("/{page}.html", web::get().to(dynamic_page))
            // Fallback for static items at root level (e.g. /common.css referenced in HTML)
            .service(actix_files::Files::new("/", "./static"))
    })
    .listen(listener)?
    .run();
    Ok(server)
}
