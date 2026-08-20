import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const registerCalculatorTools = (server: McpServer) => {
  server.registerTool(
    "calculate_insurance_breakdown",
    {
      description: "Calculate the complete financial breakdown for an insurance policy including Stamp Duty (0.4%), 7% VAT, ACT (พ.ร.บ.), and corporate Withholding Tax (1%) without saving to the database.",
      inputSchema: {
        amount: z.number().positive().describe("Base net premium amount in THB (e.g. 15000)"),
        amount_act: z.number().nonnegative().optional().default(0).describe("Compulsory motor insurance (ACT / พ.ร.บ.) amount in THB (optional, e.g. 645.21)"),
        amount_stamp: z.number().nonnegative().optional().describe("Stamp duty in THB. If not specified, automatically calculated as Math.ceil(amount * 0.004)"),
        is_company: z.boolean().optional().default(false).describe("Set to true if customer is a registered company (withholding tax 1% will be deducted from subtotal 1)")
      }
    },
    async ({ amount, amount_act = 0, amount_stamp, is_company = false }: any) => {
      try {
        const stamp = amount_stamp !== undefined ? amount_stamp : Math.ceil(amount * 0.004);
        const subtotal1 = amount + stamp;
        const vat7 = Number(((subtotal1 * 7) / 100).toFixed(2));
        const subtotal2 = Number((subtotal1 + vat7 + amount_act).toFixed(2));
        const vatAtPaid = is_company ? Number((subtotal1 / 100).toFixed(2)) : 0;
        const netPayable = is_company ? Number((subtotal2 - vatAtPaid).toFixed(2)) : subtotal2;

        const breakdown = {
          base_amount: amount,
          act_amount: amount_act,
          stamp_duty: stamp,
          subtotal_1_amount_plus_stamp: subtotal1,
          vat_7_percent: vat7,
          subtotal_2_including_vat_and_act: subtotal2,
          is_company: is_company,
          withholding_tax_1_percent: vatAtPaid,
          net_payable_total: netPayable
        };

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(breakdown, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Calculation error: ${err?.message || err}`
            }
          ]
        };
      }
    }
  );
};
