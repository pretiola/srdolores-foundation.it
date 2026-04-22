use actix_web::{web, HttpResponse, Responder};
use chrono::{Datelike, Utc};
use std::fs;
use tera::Tera;
use serde_json::json;
use crate::mcp;

pub async fn index(tera: web::Data<Tera>, client: web::Data<reqwest::Client>) -> impl Responder {
    let mut context = tera::Context::new();
    context.insert("page_name", "index");
    context.insert("current_year", &Utc::now().year());

    // Opportunistic liturgical info
    let today = Utc::now().format("%Y-%m-%d").to_string();
    let liturgical_info = mcp::call_mcp_tool(&client, "get_liturgy_of_the_day", json!({
        "date": today,
        "locale": "en"
    }), None).await;
    context.insert("liturgical_info", &liturgical_info);

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

#[derive(serde::Deserialize)]
pub struct LiturgyParams {
    pub year: i32,
    pub month: String,
}

pub async fn liturgy(
    params: web::Path<LiturgyParams>,
    tera: web::Data<Tera>,
    client: web::Data<reqwest::Client>,
) -> impl Responder {
    let mut context = tera::Context::new();
    let year = params.year;
    let month_str = params.month.to_lowercase();
    
    let month = match month_str.as_str() {
        "january" | "1" => 1,
        "february" | "2" => 2,
        "march" | "3" => 3,
        "april" | "4" => 4,
        "may" | "5" => 5,
        "june" | "6" => 6,
        "july" | "7" => 7,
        "august" | "8" => 8,
        "september" | "9" => 9,
        "october" | "10" => 10,
        "november" | "11" => 11,
        "december" | "12" => 12,
        _ => return HttpResponse::NotFound().body("Invalid month"),
    };

    let month_name = match month {
        1 => "January", 2 => "February", 3 => "March", 4 => "April",
        5 => "May", 6 => "June", 7 => "July", 8 => "August",
        9 => "September", 10 => "October", 11 => "November", 12 => "December",
        _ => "",
    };

    context.insert("view_year", &year);
    context.insert("view_month", &month);
    context.insert("view_month_name", &month_name);
    context.insert("current_year", &Utc::now().year());

    // Navigation logic
    let (prev_year, prev_month) = if month == 1 { (year - 1, 12) } else { (year, month - 1) };
    let (next_year, next_month) = if month == 12 { (year + 1, 1) } else { (year, month + 1) };
    
    let month_to_name = |m: u32| match m {
        1 => "january", 2 => "february", 3 => "march", 4 => "april",
        5 => "may", 6 => "june", 7 => "july", 8 => "august",
        9 => "september", 10 => "october", 11 => "november", 12 => "december",
        _ => "",
    };

    context.insert("prev_url", &format!("/liturgy/{}/{}", prev_year, month_to_name(prev_month)));
    context.insert("next_url", &format!("/liturgy/{}/{}", next_year, month_to_name(next_month)));
    context.insert("prev_month_name", &month_to_name(prev_month));
    context.insert("next_month_name", &month_to_name(next_month));

    // Today's info for the navbar
    let now = Utc::now();
    let today_str = now.format("%Y-%m-%d").to_string();
    let today_info = mcp::call_mcp_tool(&client, "get_liturgy_of_the_day", json!({
        "date": today_str,
        "locale": "en"
    }), None).await;
    context.insert("liturgical_info", &today_info);

    // Calculate days in month
    let last_day = if month == 12 {
        chrono::NaiveDate::from_ymd_opt(year + 1, 1, 1)
    } else {
        chrono::NaiveDate::from_ymd_opt(year, month as u32 + 1, 1)
    }.unwrap().pred_opt().unwrap().day();

    let mut tasks = Vec::new();
    let timeout_10s = Some(std::time::Duration::from_secs(10));
    for day in 1..=last_day {
        let date_str = format!("{:04}-{:02}-{:02}", year, month, day);
        let client_clone = client.clone();
        tasks.push(async move {
            (date_str.clone(), mcp::call_mcp_tool(&client_clone, "get_liturgy_of_the_day", json!({
                "date": date_str,
                "locale": "en"
            }), timeout_10s).await)
        });
    }

    let results = futures::future::join_all(tasks).await;
    context.insert("liturgy_month", &results);

    match tera.render("liturgy.html", &context) {
        Ok(html) => HttpResponse::Ok().content_type("text/html").body(html),
        Err(e) => {
            log::error!("Template rendering error: {}", e);
            HttpResponse::InternalServerError().body("Error rendering liturgy page")
        }
    }
}

pub async fn dynamic_page(
    path: web::Path<String>,
    tera: web::Data<Tera>,
    client: web::Data<reqwest::Client>
) -> impl Responder {
    let page = path.into_inner();
    render_page(&page, tera, client).await
}

async fn render_page(page: &str, tera: web::Data<Tera>, client: web::Data<reqwest::Client>) -> HttpResponse {
    let template_name = format!("{}.html", page);
    let mut context = tera::Context::new();
    context.insert("page_name", page);
    context.insert("current_year", &Utc::now().year());

    // Opportunistic liturgical info
    let today = Utc::now().format("%Y-%m-%d").to_string();
    let liturgical_info = mcp::call_mcp_tool(&client, "get_liturgy_of_the_day", json!({
        "date": today,
        "locale": "en"
    }), None).await;
    context.insert("liturgical_info", &liturgical_info);

    if page == "index" {
        context.insert("agriculture_images", &scan_gallery_images("agriculture"));
        context.insert("housing_images", &scan_gallery_images("housing"));
    } else if page == "holy_mass" {
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
