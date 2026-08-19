import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCalculatorTools } from "./tools/calculator.tools";
import { registerInvoiceTools } from "./tools/invoice.tools";
import { registerCustomerTools } from "./tools/customer.tools";
import { registerCompanyTools } from "./tools/company.tools";
import { registerQuotationTools } from "./tools/quotation.tools";
import { registerResources } from "./resources";
import { registerPrompts } from "./prompts";

export const createMcpServer = (name = "insurance-service-mcp", version = "1.0.0"): McpServer => {
  const server = new McpServer({
    name,
    version
  });

  // Register all tool domains
  registerCalculatorTools(server);
  registerInvoiceTools(server);
  registerCustomerTools(server);
  registerCompanyTools(server);
  registerQuotationTools(server);

  // Register context resources and prompts
  registerResources(server);
  registerPrompts(server);

  return server;
};
