import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Quotation } from "../../service/quotation/quotation.model";

export const registerQuotationTools = (server: McpServer) => {
  server.registerTool(
    "search_quotations",
    {
      description: "Search and list insurance quotations with optional filtering by year and pagination.",
      inputSchema: {
        year: z.string().optional().describe("Year to filter quotations (e.g. '2026')"),
        page: z.string().optional().default("1").describe("Page number"),
        size: z.string().optional().default("20").describe("Items per page")
      }
    },
    async ({ year, page, size }) => {
      try {
        const queryDate = year ? new Date(year) : undefined;
        const result = await Quotation.getList({ year: queryDate, page, size });
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Failed to search quotations: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );

  server.registerTool(
    "get_quotation_by_id",
    {
      description: "Get detailed quotation information by MongoDB Object ID.",
      inputSchema: {
        id: z.string().describe("MongoDB Object ID of the quotation")
      }
    },
    async ({ id }) => {
      try {
        const result = await Quotation.get(id);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Failed to get quotation: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );

  server.registerTool(
    "create_or_update_quotation",
    {
      description: "Create a new quotation or update an existing one for multiple customer vehicles.",
      inputSchema: {
        quotation_id: z.string().optional().describe("MongoDB Object ID to update existing quotation (leave empty to create new)"),
        issue_date: z.string().describe("Quotation issue date (ISO format, e.g. '2026-08-20')"),
        customers: z.array(
          z.object({
            company_id: z.string().describe("MongoDB Object ID of the partner company"),
            customer_id: z.string().describe("MongoDB Object ID of the customer"),
            insurance_amount: z.string().describe("Insurance coverage amount (e.g. '500,000')"),
            amount: z.number().positive().describe("Premium amount in THB"),
            act_amount: z.number().nonnegative().optional().describe("ACT compulsory insurance amount in THB"),
            end_date: z.string().describe("Policy expiration date (ISO format, e.g. '2027-08-20')")
          })
        ).nonempty().describe("List of vehicles/customers included in this quotation")
      }
    },
    async ({ quotation_id, issue_date, customers }) => {
      try {
        const result = await Quotation.upsert(
          {
            issue_date: new Date(issue_date),
            customers: customers.map((c) => ({
              ...c,
              end_date: new Date(c.end_date)
            }))
          },
          quotation_id
        );
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  message: "Quotation created/updated successfully",
                  quotation: result
                },
                null,
                2
              )
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Failed to create/update quotation: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );

  server.registerTool(
    "delete_quotations",
    {
      description: "Delete one or more quotations by MongoDB Object IDs.",
      inputSchema: {
        id_list: z.array(z.string()).describe("Array of MongoDB Object IDs of quotations to delete")
      }
    },
    async ({ id_list }) => {
      try {
        const result = await Quotation.delete(id_list);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Failed to delete quotations: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );
};
