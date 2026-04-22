use serde_json::{json, Value};
use std::time::Duration;

/// Generic function to call an MCP tool with an optional latency budget.
/// Returns None if the request fails, times out, or returns an error.
pub async fn call_mcp_tool(tool_name: &str, arguments: Value, timeout: Option<Duration>) -> Option<Value> {
    let timeout = timeout.unwrap_or(Duration::from_millis(300));
    
    // Default to the Liturgical Calendar MCP endpoint if not provided
    let endpoint = std::env::var("MCP_ENDPOINT")
        .unwrap_or_else(|_| "https://liturgical.pretiola.org/mcp".to_string());
    
    let client = match reqwest::Client::builder()
        .timeout(timeout)
        .connect_timeout(Duration::from_millis(1000))
        .build() {
            Ok(c) => c,
            Err(_) => return None,
        };
    
    let payload = json!({
        "jsonrpc": "2.0",
        "id": "1",
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": arguments
        }
    });

    match client.post(&endpoint)
        .header("Accept", "application/json, text/event-stream")
        .json(&payload)
        .send()
        .await {
        Ok(response) => {
            if response.status().is_success() {
                let text = response.text().await.ok()?;
                
                // The server returns SSE format: "event: message\ndata: { ... }"
                // We need to extract the JSON from the data: line
                if let Some(data_line) = text.lines().find(|l| l.starts_with("data: ")) {
                    let json_str = &data_line[6..];
                    let body: Value = serde_json::from_str(json_str).ok()?;
                    
                    // Prefer structuredContent if available, otherwise fall back to parsing result.content[0].text
                    if let Some(structured) = body.get("result").and_then(|r| r.get("structuredContent")) {
                        if !structured.is_null() {
                            return Some(structured.clone());
                        }
                    }

                    let content_text = body.get("result")?
                        .get("content")?
                        .as_array()?
                        .first()?
                        .get("text")?
                        .as_str()?;
                    
                    serde_json::from_str(content_text).ok()
                } else {
                    log::error!("MCP response did not contain data: line");
                    None
                }
            } else {
                log::error!("MCP tool call failed with status: {}", response.status());
                None
            }
        }
        Err(e) => {
            if e.is_timeout() {
                log::warn!("MCP tool call timed out ({:?})", timeout);
            } else {
                log::error!("MCP tool call error: {}", e);
            }
            None
        }
    }
}
