use actix_web::{HttpResponse, Responder, web};
use tera::Tera;
use chrono::{Datelike, Utc};

pub async fn index(tera: web::Data<Tera>) -> impl Responder {
    render_page("index", tera)
}

pub async fn dynamic_page(path: web::Path<String>, tera: web::Data<Tera>) -> impl Responder {
    render_page(&path.into_inner(), tera)
}

fn render_page(page: &str, tera: web::Data<Tera>) -> HttpResponse {
    let template_name = format!("{}.html", page);
    let mut context = tera::Context::new();
    context.insert("page_name", page);
    context.insert("current_year", &Utc::now().year());

    match tera.render(&template_name, &context) {
        Ok(html) => HttpResponse::Ok().content_type("text/html").body(html),
        Err(e) => {
            log::error!("Template rendering error: {}", e);
            HttpResponse::NotFound().body("Page not found")
        }
    }
}

pub async fn sitemap() -> impl Responder {
    let xml = r#"<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://srdolores-foundation.it/</loc></url>
  <url><loc>https://srdolores-foundation.it/index.html</loc></url>
  <url><loc>https://srdolores-foundation.it/who_we_are.html</loc></url>
  <url><loc>https://srdolores-foundation.it/what_we_do.html</loc></url>
  <url><loc>https://srdolores-foundation.it/benificiaries.html</loc></url>
  <url><loc>https://srdolores-foundation.it/challenges.html</loc></url>
  <url><loc>https://srdolores-foundation.it/goals.html</loc></url>
  <url><loc>https://srdolores-foundation.it/holy_mass.html</loc></url>
  <url><loc>https://srdolores-foundation.it/get_involved.html</loc></url>
  <url><loc>https://srdolores-foundation.it/privacy_policy.html</loc></url>
  <url><loc>https://srdolores-foundation.it/terms_of_use.html</loc></url>
</urlset>
"#;
    HttpResponse::Ok().content_type("application/xml").body(xml)
}
