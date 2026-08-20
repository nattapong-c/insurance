import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Customer } from "../../service/customer/customer.model";

export const registerCustomerTools = (server: McpServer) => {
  server.registerTool(
    "search_customers",
    {
      description: "Search customers by vehicle license plate number or list with pagination.",
      inputSchema: {
        plate_number: z.string().optional().describe("License plate number to filter (e.g. '1กก')"),
        page: z.string().optional().default("1").describe("Page number"),
        size: z.string().optional().default("20").describe("Items per page")
      }
    },
    async ({ plate_number, page, size }) => {
      try {
        const result = await Customer.getList({ plate_number, page, size });
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
              text: `Failed to search customers: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );

  server.registerTool(
    "create_customer",
    {
      description: "Register a new customer and vehicle license plate number.",
      inputSchema: {
        name: z.string().describe("Customer full name or company name"),
        plate_number: z.string().describe("Vehicle license plate number (e.g. '1กก-1234' or 'กข-999')")
      }
    },
    async ({ name, plate_number }) => {
      try {
        const result = await Customer.create({ name, plate_number });
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
              text: `Failed to create customer: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );

  server.registerTool(
    "update_customer",
    {
      description: "Update an existing customer record by MongoDB Object ID.",
      inputSchema: {
        id: z.string().describe("MongoDB Object ID of the customer"),
        name: z.string().optional().describe("Updated customer name"),
        plate_number: z.string().optional().describe("Updated license plate number")
      }
    },
    async ({ id, name, plate_number }) => {
      try {
        const result = await Customer.update(id, { name, plate_number });
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
              text: `Failed to update customer: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );

  server.registerTool(
    "delete_customers",
    {
      description: "Delete one or more customer records by MongoDB Object IDs.",
      inputSchema: {
        id_list: z.array(z.string()).describe("Array of MongoDB Object IDs of customers to delete")
      }
    },
    async ({ id_list }) => {
      try {
        const result = await Customer.delete(id_list);
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
              text: `Failed to delete customers: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );
};
