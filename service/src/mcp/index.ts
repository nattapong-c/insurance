import dotenv from "dotenv";
import path from "path";

// Ensure environment variables are loaded
dotenv.config({ path: path.join(__dirname, "../../.env") });
dotenv.config({ path: path.join(__dirname, "../.env") });

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { connectDB } from "../database/mongo";
import { createMcpServer } from "./server";

const server = createMcpServer();

async function main() {
  try {
    console.error("[MCP] Connecting to MongoDB...");
    await connectDB();
    console.error("[MCP] MongoDB connected successfully.");

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[MCP] Insurance MCP Server is running on stdio transport.");
  } catch (err) {
    console.error("[MCP] Fatal error starting MCP server:", err);
    process.exit(1);
  }
}

main();
