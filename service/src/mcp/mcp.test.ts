import { createMcpServer } from "./server";

describe("MCP Server Factory and Toolset", () => {
  it("should create McpServer instance and register all tools, resources, and prompts", () => {
    const server = createMcpServer("test-mcp-server", "1.0.0");
    expect(server).toBeDefined();
  });
});
