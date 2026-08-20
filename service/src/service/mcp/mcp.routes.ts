import { Router, Request, Response, NextFunction } from "express";
import cors from "cors";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createMcpServer } from "../../mcp/server";

const router = (module.exports = Router());

// Enable CORS for MCP endpoints so any AI client can connect
router.use(cors({ origin: "*" }));

// Single persistent McpServer instance
const server = createMcpServer();

// Active transport sessions map: sessionId -> SSEServerTransport
const transports: { [sessionId: string]: SSEServerTransport } = {};

/**
 * Health check endpoint for MCP service
 */
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    active_sessions: Object.keys(transports).length,
    timestamp: new Date().toISOString()
  });
});

/**
 * SSE Connection Endpoint: AI clients connect via GET request
 */
router.get("/sse", async (req: Request, res: Response) => {
  console.log(`[MCP-SSE] New SSE client connecting from ${req.ip}...`);

  // Construct message endpoint path
  const endpoint = "/api/mcp/messages";
  const transport = new SSEServerTransport(endpoint, res);

  transports[transport.sessionId] = transport;
  console.log(`[MCP-SSE] Session created: ${transport.sessionId}`);

  res.on("close", () => {
    console.log(`[MCP-SSE] Client disconnected, closing session: ${transport.sessionId}`);
    delete transports[transport.sessionId];
  });

  await server.connect(transport);
});

/**
 * Message Receiver Endpoint: AI clients post JSON-RPC tool calls here
 */
router.post("/messages", async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    return res.status(400).json({ error: "Missing sessionId query parameter" });
  }

  const transport = transports[sessionId];
  if (!transport) {
    return res.status(404).json({ error: `Session ${sessionId} not found or expired` });
  }

  await transport.handlePostMessage(req, res);
});
