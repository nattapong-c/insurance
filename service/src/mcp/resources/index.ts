import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import CompanySchema from "../../schema/Company";
import { Invoice } from "../../service/invoice/invoice.model";

export const registerResources = (server: McpServer) => {
  server.registerResource(
    "insurance-companies",
    "insurance://companies",
    {
      title: "Insurance Companies Directory",
      description: "List of all registered partner insurance companies"
    },
    async (uri) => {
      const companies = await CompanySchema.find({}).sort({ name: 1 });
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(companies, null, 2),
            mimeType: "application/json"
          }
        ]
      };
    }
  );

  server.registerResource(
    "invoice-overview",
    "insurance://overview",
    {
      title: "Invoice System Overview",
      description: "Statistics of issued invoices and latest invoice ID"
    },
    async (uri) => {
      const overview = await Invoice.info();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(overview, null, 2),
            mimeType: "application/json"
          }
        ]
      };
    }
  );
};
