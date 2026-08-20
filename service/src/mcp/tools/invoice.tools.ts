import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Invoice } from "../../service/invoice/invoice.model";

export const registerInvoiceTools = (server: McpServer) => {
  server.registerTool(
    "search_invoices",
    {
      description: "Search and list insurance invoices with optional filtering by vehicle plate number and pagination.",
      inputSchema: {
        plate_number: z.string().optional().describe("Vehicle license plate number to search (e.g. '1กก-1234')"),
        page: z.string().optional().default("1").describe("Page number (1-indexed)"),
        size: z.string().optional().default("20").describe("Number of items per page")
      }
    },
    async ({ plate_number, page, size }) => {
      try {
        const result = await Invoice.getList({ plate_number, page, size });
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
              text: `Failed to search invoices: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );

  server.registerTool(
    "get_invoice_by_number",
    {
      description: "Get detailed information of a specific invoice by its invoice number.",
      inputSchema: {
        invoice_no: z.string().describe("Invoice number to retrieve (e.g. '101')")
      }
    },
    async ({ invoice_no }) => {
      try {
        const invoice = await Invoice.get(invoice_no);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(invoice, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Failed to get invoice ${invoice_no}: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );

  server.registerTool(
    "get_invoice_overview",
    {
      description: "Get high-level summary statistics including total invoice count and latest invoice number."
    },
    async () => {
      try {
        const info = await Invoice.info();
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(info, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Failed to get invoice overview: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );

  server.registerTool(
    "create_or_update_invoice",
    {
      description: "Create a new invoice or update an existing invoice record in the database.",
      inputSchema: {
        invoice_no: z.number().int().positive().describe("Invoice number (e.g. 101)"),
        plate_no: z.string().describe("Vehicle license plate number (must match existing customer plate)"),
        insurance_type: z.string().describe("Type/class of insurance (e.g. 'ชั้น 1', 'ชั้น 2+', 'ชั้น 3')"),
        insurance_amount: z.string().describe("Insurance coverage amount (e.g. '500,000')"),
        insurance_receiver_id: z.string().describe("Company ID of the insurance partner (e.g. '0105531098765')"),
        insurance_no: z.string().describe("Insurance policy number"),
        act_no: z.string().optional().describe("ACT / พ.ร.บ. policy number"),
        amount: z.number().positive().describe("Base insurance premium amount in THB"),
        amount_act: z.number().nonnegative().optional().describe("ACT compulsory insurance amount in THB"),
        amount_stamp: z.number().nonnegative().describe("Stamp duty amount in THB"),
        is_company: z.boolean().default(false).describe("Whether customer is a corporate entity (for 1% withholding tax)"),
        issue_date: z.string().describe("Invoice issue date in ISO format (e.g. '2026-08-20')"),
        start_date: z.string().describe("Policy coverage start date in ISO format (e.g. '2026-09-01')"),
        end_date: z.string().describe("Policy coverage end date in ISO format (e.g. '2027-09-01')")
      }
    },
    async (params) => {
      try {
        const result = await Invoice.upsert({
          ...params,
          issue_date: new Date(params.issue_date),
          start_date: new Date(params.start_date),
          end_date: new Date(params.end_date)
        });
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  message: "Invoice successfully created/updated",
                  invoice: result
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
              text: `Failed to create/update invoice: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );

  server.registerTool(
    "delete_invoices",
    {
      description: "Delete one or more invoices by their MongoDB Object IDs.",
      inputSchema: {
        id_list: z.array(z.string()).describe("Array of MongoDB Object IDs of invoices to delete")
      }
    },
    async ({ id_list }) => {
      try {
        const result = await Invoice.delete(id_list);
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
              text: `Failed to delete invoices: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );
};
