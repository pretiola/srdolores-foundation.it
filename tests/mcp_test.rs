use pretiola::mcp::call_mcp_tool;
use serde_json::json;
use std::time::Instant;

#[tokio::test]
async fn test_mcp_timeout_fail_open() {
    // Point to a non-routable address to force a timeout
    std::env::set_var("MCP_ENDPOINT", "http://10.255.255.1:8080/mcp");
    
    let start = Instant::now();
    let result = call_mcp_tool("any_tool", json!({}), Some(std::time::Duration::from_millis(150))).await;
    let duration = start.elapsed();
    
    // Should return None (Fail-Open)
    assert!(result.is_none());
    
    // Should have timed out or failed within the budget.
    assert!(duration.as_millis() < 300, "Should not have taken too long, took {}ms", duration.as_millis());
}

#[tokio::test]
async fn test_mcp_connection_failure_fail_open() {
    // Point to a dead port on localhost
    std::env::set_var("MCP_ENDPOINT", "http://127.0.0.1:1/mcp");
    
    let result = call_mcp_tool("any_tool", json!({}), Some(std::time::Duration::from_millis(150))).await;
    
    // Should return None (Fail-Open)
    assert!(result.is_none());
}
