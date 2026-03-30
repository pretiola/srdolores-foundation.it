use actix_web::{web, HttpResponse, Responder};
use chrono::{Datelike, Utc};
use std::fs;
use tera::Tera;

pub async fn index(tera: web::Data<Tera>) -> impl Responder {
    let mut context = tera::Context::new();
    context.insert("page_name", "index");
    context.insert("current_year", &Utc::now().year());
    context.insert("agriculture_images", &scan_gallery_images("agriculture"));
    context.insert("housing_images", &scan_gallery_images("housing"));

    match tera.render("index.html", &context) {
        Ok(html) => HttpResponse::Ok().content_type("text/html").body(html),
        Err(e) => {
            log::error!("Template rendering error: {}", e);
            HttpResponse::NotFound().body("Page not found")
        }
    }
}

pub async fn dynamic_page(path: web::Path<String>, tera: web::Data<Tera>) -> impl Responder {
    let page = path.into_inner();
    render_page(&page, tera)
}

fn render_page(page: &str, tera: web::Data<Tera>) -> HttpResponse {
    let template_name = format!("{}.html", page);
    let mut context = tera::Context::new();
    context.insert("page_name", page);
    context.insert("current_year", &Utc::now().year());

    if page == "holy_mass" {
        context.insert("mass_images", &scan_gallery_images("mass"));
    }

    match tera.render(&template_name, &context) {
        Ok(html) => HttpResponse::Ok().content_type("text/html").body(html),
        Err(e) => {
            log::error!("Template rendering error: {}", e);
            HttpResponse::NotFound().body("Page not found")
        }
    }
}

/// Scan the optimized pictures directory for gallery images with the given prefix.
/// Returns a sorted list of basenames (e.g. "agriculture_PHOTO-2026-03-25-18-18-47").
fn scan_gallery_images(prefix: &str) -> Vec<String> {
    let dir = "static/pictures/optimized";
    let suffix = "_800w.jpg";
    let prefix_pattern = format!("{}_", prefix);

    let entries = match fs::read_dir(dir) {
        Ok(entries) => entries,
        Err(e) => {
            log::warn!("Could not read gallery directory {}: {}", dir, e);
            return Vec::new();
        }
    };

    let mut basenames: Vec<String> = entries
        .filter_map(|entry| {
            let name = entry.ok()?.file_name().into_string().ok()?;
            if name.starts_with(&prefix_pattern) && name.ends_with(suffix) {
                Some(name[..name.len() - suffix.len()].to_string())
            } else {
                None
            }
        })
        .collect();

    basenames.sort();
    basenames
}

const PARTIALS: &[&str] = &["navbar.html", "footer.html"];
const BASE_URL: &str = "https://srdolores-foundation.it";

pub async fn sitemap(tera: web::Data<Tera>) -> impl Responder {
    let mut urls = Vec::new();
    urls.push(format!("  <url><loc>{}/</loc></url>", BASE_URL));

    let mut template_names: Vec<&str> = tera
        .get_template_names()
        .filter(|name| name.ends_with(".html") && !PARTIALS.contains(name))
        .collect();
    template_names.sort();

    for name in template_names {
        urls.push(format!("  <url><loc>{}/{}</loc></url>", BASE_URL, name));
    }

    let xml = format!(
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n{}\n</urlset>\n",
        urls.join("\n")
    );
    HttpResponse::Ok().content_type("application/xml").body(xml)
}
