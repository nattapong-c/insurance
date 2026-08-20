import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Company } from "../../service/company/company.model";

export const registerCompanyTools = (server: McpServer) => {
  server.registerTool(
    "list_insurance_companies",
    {
      description: "List partner insurance companies (e.g. Viriyah, Dhipaya, Bangkok Insurance) with optional name search and pagination.",
      inputSchema: {
        name: z.string().optional().describe("Company name to filter (e.g. 'วิริยะ')"),
        page: z.string().optional().default("1").describe("Page number"),
        size: z.string().optional().default("50").describe("Items per page")
      }
    },
    async ({ name, page, size }) => {
      try {
        const result = await Company.getList({ name, page, size });
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
              text: `Failed to list insurance companies: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );

  server.registerTool(
    "create_insurance_company",
    {
      description: "Register a new partner insurance company with ID, name, and address.",
      inputSchema: {
        id_company: z.string().describe("Unique company registration/tax ID (e.g. '0105531098765')"),
        name: z.string().describe("Company name (e.g. 'บริษัท วิริยะประกันภัย จำกัด (มหาชน)')"),
        address: z.string().describe("Official company address")
      }
    },
    async ({ id_company, name, address }) => {
      try {
        const result = await Company.create({ id_company, name, address });
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
              text: `Failed to create insurance company: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );

  server.registerTool(
    "update_insurance_company",
    {
      description: "Update an existing partner company record by MongoDB Object ID.",
      inputSchema: {
        id: z.string().describe("MongoDB Object ID of the company"),
        id_company: z.string().optional().describe("Company registration ID"),
        name: z.string().optional().describe("Company name"),
        address: z.string().optional().describe("Company address")
      }
    },
    async ({ id, id_company, name, address }) => {
      try {
        const result = await Company.update(id, { id_company, name, address });
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
              text: `Failed to update company: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );

  server.registerTool(
    "delete_insurance_companies",
    {
      description: "Delete one or more partner companies by MongoDB Object IDs.",
      inputSchema: {
        id_list: z.array(z.string()).describe("Array of MongoDB Object IDs of companies to delete")
      }
    },
    async ({ id_list }) => {
      try {
        const result = await Company.delete(id_list);
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
              text: `Failed to delete companies: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );
};
