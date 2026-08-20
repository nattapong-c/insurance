import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const registerPrompts = (server: McpServer) => {
  server.registerPrompt(
    "draft_insurance_invoice",
    {
      title: "Draft Insurance Invoice",
      description: "Workflow to guide drafting and issuing an invoice for vehicle insurance",
      argsSchema: {
        plate_number: z.string().optional().describe("Vehicle license plate number (e.g. 1กก-1234)"),
        insurance_type: z.string().optional().describe("Insurance tier/type (e.g. ชั้น 1, ชั้น 2+, ชั้น 3)")
      }
    },
    ({ plate_number, insurance_type }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please help me draft a new vehicle insurance invoice in the system:
${plate_number ? `- Vehicle Plate Number: ${plate_number}` : "- Vehicle Plate Number: [Specify]"}
${insurance_type ? `- Insurance Type: ${insurance_type}` : "- Insurance Type: [Specify]"}

Steps to take:
1. Use 'search_customers' to verify if the vehicle plate already exists. If not, ask to create it via 'create_customer'.
2. Use 'list_insurance_companies' to find the appropriate insurance company partner and its ID.
3. Use 'get_invoice_overview' to determine the next available invoice number.
4. Calculate the financial breakdown using 'calculate_insurance_breakdown'.
5. Once confirmed, save the invoice via 'create_or_update_invoice'.`
            }
          }
        ]
      };
    }
  );

  server.registerPrompt(
    "explain_tax_breakdown",
    {
      title: "Explain Tax and Premium Breakdown",
      description: "Produce a detailed, transparent breakdown of premiums, ACT, stamp duty, and VAT",
      argsSchema: {
        amount: z.string().describe("Base insurance premium amount in THB (e.g. 15000)"),
        amount_act: z.string().optional().describe("ACT compulsory insurance amount (e.g. 645.21)"),
        is_company: z.string().optional().describe("Is corporate customer (true/false)")
      }
    },
    ({ amount, amount_act, is_company }) => {
      const isCorp = is_company === "true";
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please explain the insurance premium calculation and tax breakdown clearly for a customer:
- Base Premium: ${amount} THB
- ACT (พ.ร.บ.): ${amount_act || "0"} THB
- Customer Type: ${isCorp ? "Corporate Company (นิติบุคคล)" : "Individual Person (บุคคลธรรมดา)"}

Please call 'calculate_insurance_breakdown' with these numbers and provide a friendly, itemized breakdown explaining:
1. Base Premium (เบี้ยสุทธิ)
2. Stamp Duty (อากรแสตมป์ 0.4% ปัดเศษขึ้น)
3. Total 1 (รวมเบี้ยและอากร)
4. 7% VAT (ภาษีมูลค่าเพิ่ม 7%)
5. ACT Compulsory Insurance (พ.ร.บ.)
6. ${isCorp ? "Withholding Tax (หัก ณ ที่จ่าย 1% จากยอดรวมที่ 1)" : "No Withholding Tax for individuals"}
7. Final Total Payable Amount (ยอดเงินที่ต้องชำระ)`
            }
          }
        ]
      };
    }
  );
};
