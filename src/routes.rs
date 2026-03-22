use actix_web::{HttpResponse, Responder, web};
use tera::Tera;

pub async fn index(tera: web::Data<Tera>) -> impl Responder {
    render_page("index", tera)
}

pub async fn dynamic_page(path: web::Path<String>, tera: web::Data<Tera>) -> impl Responder {
    render_page(&path.into_inner(), tera)
}

fn render_page(page: &str, tera: web::Data<Tera>) -> HttpResponse {
    let template_name = format!("{}.html", page);
    // Add page name to context, so tera can render if needed.
    let mut context = tera::Context::new();
    context.insert("page_name", page);

    match tera.render(&template_name, &context) {
        Ok(html) => HttpResponse::Ok().content_type("text/html").body(html),
        Err(e) => {
            log::error!("Template rendering error: {}", e);
            HttpResponse::NotFound().body("Page not found")
        }
    }
}
