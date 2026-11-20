import CustomerSchema from "../../schema/Customer";
import CompanySchema from "../../schema/Company";
import InvoiceSchema from "../../schema/Invoice";
import QuotationSchema from "../../schema/Quotation";
import { Customer } from "../customer/customer.model";
import { Company } from "../company/company.model";
import { Invoice, calculateInvoiceAmounts } from "../invoice/invoice.model";
import { Quotation } from "../quotation/quotation.model";
import { Error400 } from "../../utils/error";
import { LLMToolDefinition } from "./providers/types";

export type PendingActionType =
    | "CREATE_CUSTOMER"
    | "UPDATE_CUSTOMER"
    | "CREATE_COMPANY"
    | "UPDATE_COMPANY"
    | "UPSERT_INVOICE"
    | "UPSERT_QUOTATION";

export interface PrerequisiteAction {
    type: "CREATE_CUSTOMER" | "CREATE_COMPANY";
    title: string;
    payload: Record<string, any>;
}

export interface PendingAction {
    type: PendingActionType;
    mode: "create" | "update";
    title: string;
    warnings?: string[];
    prerequisiteActions?: PrerequisiteAction[];
    payload: Record<string, any>;
    preview: Record<string, any>;
}

const escapeRegex = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const clampLimit = (limit?: number, defaultLimit = 20): number => {
    if (!limit || Number.isNaN(limit) || limit < 1) return defaultLimit;
    return Math.min(limit, 50);
};

export const PROPOSAL_TOOL_NAMES = new Set<string>([
    "propose_create_customer",
    "propose_update_customer",
    "propose_create_company",
    "propose_update_company",
    "propose_upsert_invoice",
    "propose_upsert_quotation"
]);

export const AI_TOOL_DEFINITIONS: LLMToolDefinition[] = [
    // ==================== READ TOOLS ====================
    {
        name: "search_customers",
        description:
            "ค้นหาข้อมูลลูกค้าจากชื่อลูกค้าหรือเลขทะเบียนรถ คืนค่ารายการลูกค้าพร้อม _id, plate_number และ name",
        parameters: {
            type: "object",
            properties: {
                keyword: {
                    type: "string",
                    description: "คำค้นหา เช่น เลขทะเบียนรถ หรือ ชื่อลูกค้า (เว้นว่างเพื่อดึงรายการล่าสุด)"
                },
                limit: { type: "number", description: "จำนวนผลลัพธ์สูงสุด (ค่าเริ่มต้น 20, สูงสุด 50)" }
            }
        }
    },
    {
        name: "search_companies",
        description:
            "ค้นหาข้อมูลบริษัทประกันภัยจากชื่อบริษัทหรือเลขประจำตัวผู้เสียภาษี (id_company) คืนค่า _id, id_company, name และ address",
        parameters: {
            type: "object",
            properties: {
                keyword: {
                    type: "string",
                    description: "คำค้นหา เช่น ชื่อบริษัทประกัน หรือ เลขผู้เสียภาษี (เว้นว่างเพื่อดึงทั้งหมด)"
                },
                limit: { type: "number", description: "จำนวนผลลัพธ์สูงสุด (ค่าเริ่มต้น 20, สูงสุด 50)" }
            }
        }
    },
    {
        name: "search_invoices",
        description:
            "ค้นหารายการใบวางบิลในระบบ สามารถกรองตามทะเบียนรถ ชื่อลูกค้า เลขที่ใบวางบิล เลขกรมธรรม์ หรือช่วงวันที่ออกบิลได้",
        parameters: {
            type: "object",
            properties: {
                plate_no: { type: "string", description: "เลขทะเบียนรถ" },
                customer_name: { type: "string", description: "ชื่อลูกค้า" },
                invoice_no: { type: "number", description: "เลขที่ใบวางบิล" },
                insurance_no: { type: "string", description: "เลขที่กรมธรรม์" },
                from_date: { type: "string", description: "วันที่เริ่มต้น (YYYY-MM-DD)" },
                to_date: { type: "string", description: "วันที่สิ้นสุด (YYYY-MM-DD)" },
                limit: { type: "number", description: "จำนวนผลลัพธ์สูงสุด (ค่าเริ่มต้น 20, สูงสุด 50)" }
            }
        }
    },
    {
        name: "get_invoice_detail",
        description: "ดึงรายละเอียดครบทุกฟิลด์ของใบวางบิลตามเลขที่ใบวางบิล (invoice_no)",
        parameters: {
            type: "object",
            properties: {
                invoice_no: { type: "number", description: "เลขที่ใบวางบิล" }
            },
            required: ["invoice_no"]
        }
    },
    {
        name: "get_dashboard_overview",
        description:
            "ดึงข้อมูลภาพรวมของระบบ ได้แก่ จำนวนลูกค้าทั้งหมด จำนวนบริษัทประกัน จำนวนใบวางบิล และเลขที่ใบวางบิลล่าสุด",
        parameters: {
            type: "object",
            properties: {}
        }
    },
    {
        name: "get_next_invoice_no",
        description:
            "ดึงเลขที่ใบวางบิลถัดไปที่ยังไม่ถูกใช้ (latest + 1) ใช้ก่อนเสนอสร้างใบวางบิลใหม่เสมอ",
        parameters: {
            type: "object",
            properties: {}
        }
    },
    {
        name: "search_quotations",
        description: "ค้นหารายการใบเสนอราคาตามปี (ค.ศ.) หรือเลขทะเบียนรถ",
        parameters: {
            type: "object",
            properties: {
                year: { type: "number", description: "ปี ค.ศ. เช่น 2026" },
                plate_number: { type: "string", description: "เลขทะเบียนรถ" },
                limit: { type: "number", description: "จำนวนผลลัพธ์สูงสุด (ค่าเริ่มต้น 15)" }
            }
        }
    },

    // ==================== WRITE PROPOSAL TOOLS ====================
    {
        name: "propose_create_customer",
        description:
            "เสนอสร้างข้อมูลลูกค้าใหม่ (ยังไม่บันทึกลงฐานข้อมูลจนกว่าผู้ใช้จะกดยืนยัน)",
        parameters: {
            type: "object",
            properties: {
                plate_number: { type: "string", description: "เลขทะเบียนรถ (ห้ามซ้ำในระบบ)" },
                name: { type: "string", description: "ชื่อลูกค้า / ผู้เอาประกัน" }
            },
            required: ["plate_number", "name"]
        }
    },
    {
        name: "propose_update_customer",
        description:
            "เสนอแก้ไขข้อมูลลูกค้าที่มีอยู่ (ยังไม่บันทึกลงฐานข้อมูลจนกว่าผู้ใช้จะกดยืนยัน)",
        parameters: {
            type: "object",
            properties: {
                customer_id: { type: "string", description: "MongoDB _id ของลูกค้า" },
                plate_number: { type: "string", description: "เลขทะเบียนรถใหม่ (ถ้าต้องการแก้)" },
                name: { type: "string", description: "ชื่อลูกค้าใหม่ (ถ้าต้องการแก้)" }
            },
            required: ["customer_id"]
        }
    },
    {
        name: "propose_create_company",
        description:
            "เสนอสร้างข้อมูลบริษัทประกันภัยใหม่ (ยังไม่บันทึกลงฐานข้อมูลจนกว่าผู้ใช้จะกดยืนยัน)",
        parameters: {
            type: "object",
            properties: {
                id_company: { type: "string", description: "เลขประจำตัวผู้เสียภาษี / รหัสบริษัท (unique)" },
                name: { type: "string", description: "ชื่อบริษัทประกันภัย" },
                address: { type: "string", description: "ที่อยู่บริษัทประกันภัย" }
            },
            required: ["id_company", "name", "address"]
        }
    },
    {
        name: "propose_update_company",
        description:
            "เสนอแก้ไขข้อมูลบริษัทประกันภัยที่มีอยู่ (ยังไม่บันทึกลงฐานข้อมูลจนกว่าผู้ใช้จะกดยืนยัน)",
        parameters: {
            type: "object",
            properties: {
                company_id: { type: "string", description: "MongoDB _id ของบริษัท" },
                id_company: { type: "string", description: "เลขประจำตัวผู้เสียภาษีใหม่ (ถ้าต้องการแก้)" },
                name: { type: "string", description: "ชื่อบริษัทใหม่ (ถ้าต้องการแก้)" },
                address: { type: "string", description: "ที่อยู่ใหม่ (ถ้าต้องการแก้)" }
            },
            required: ["company_id"]
        }
    },
    {
        name: "propose_upsert_invoice",
        description:
            "เสนอสร้างหรือแก้ไขใบวางบิล พร้อมคำนวณ VAT 7%, หัก ณ ที่จ่าย 1% และยอดสุทธิให้ผู้ใช้ตรวจสอบก่อนบันทึก (หากยังไม่มีข้อมูลลูกค้าหรือบริษัทในระบบ ให้ส่ง customer_name และ company_name/company_address มาด้วยเพื่อเสนอสร้างพร้อมกัน)",
        parameters: {
            type: "object",
            properties: {
                invoice_no: {
                    type: "number",
                    description: "เลขที่ใบวางบิล (ถ้าสร้างใหม่และไม่ระบุ ระบบจะรันเลขถัดไปให้อัตโนมัติ)"
                },
                plate_no: { type: "string", description: "เลขทะเบียนรถ" },
                customer_name: {
                    type: "string",
                    description: "ชื่อลูกค้า (ใช้กรณีสร้างลูกค้าใหม่หากยังไม่มีทะเบียนนี้ในระบบ)"
                },
                insurance_receiver_id: {
                    type: "string",
                    description: "รหัส/เลขผู้เสียภาษีของบริษัทประกัน (id_company)"
                },
                company_name: {
                    type: "string",
                    description: "ชื่อบริษัทประกัน (ใช้กรณีสร้างบริษัทใหม่หากยังไม่มีในระบบ)"
                },
                company_address: {
                    type: "string",
                    description: "ที่อยู่บริษัทประกัน (ใช้กรณีสร้างบริษัทใหม่)"
                },
                issue_date: { type: "string", description: "วันที่ออกใบวางบิล (YYYY-MM-DD ค.ศ.)" },
                start_date: { type: "string", description: "วันเริ่มคุ้มครอง (YYYY-MM-DD ค.ศ.)" },
                end_date: { type: "string", description: "วันสิ้นสุดคุ้มครอง (YYYY-MM-DD ค.ศ.)" },
                insurance_type: { type: "string", description: "ประเภทประกัน เช่น ประเภท 1, ประเภท 2+, ประเภท 3" },
                insurance_amount: { type: "string", description: "ทุนประกัน เช่น 500,000" },
                insurance_no: { type: "string", description: "เลขที่กรมธรรม์" },
                act_no: { type: "string", description: "เลขที่กรมธรรม์ พ.ร.บ. (ถ้ามี)" },
                amount: { type: "number", description: "เบี้ยประกันสุทธิ (ไม่รวม พ.ร.บ. อากร และ VAT)" },
                amount_act: { type: "number", description: "เบี้ย พ.ร.บ. (ถ้ามี, 0 หรือไม่ระบุถ้าไม่มี)" },
                amount_stamp: { type: "number", description: "ค่าอากรแสตมป์" },
                is_company: {
                    type: "boolean",
                    description: "true หากผู้เอาประกันเป็นนิติบุคคล (หัก ณ ที่จ่าย 1%), false หากเป็นบุคคลธรรมดา"
                }
            },
            required: [
                "plate_no",
                "insurance_receiver_id",
                "issue_date",
                "start_date",
                "end_date",
                "insurance_type",
                "insurance_amount",
                "insurance_no",
                "amount",
                "amount_stamp",
                "is_company"
            ]
        }
    },
    {
        name: "propose_upsert_quotation",
        description:
            "เสนอสร้างหรือแก้ไขใบเสนอราคา (ต้องใช้ MongoDB _id ของ customer และ company จาก search_customers / search_companies)",
        parameters: {
            type: "object",
            properties: {
                quotation_id: { type: "string", description: "MongoDB _id ของใบเสนอราคา (ระบุเฉพาะกรณีแก้ไข)" },
                issue_date: { type: "string", description: "วันที่ออกใบเสนอราคา (YYYY-MM-DD ค.ศ.)" },
                customers: {
                    type: "array",
                    description: "รายการรถ/ความคุ้มครองในใบเสนอราคา",
                    items: {
                        type: "object",
                        properties: {
                            company_id: { type: "string", description: "MongoDB _id ของบริษัทประกัน" },
                            customer_id: { type: "string", description: "MongoDB _id ของลูกค้า" },
                            insurance_amount: { type: "string", description: "ทุนประกัน เช่น 500,000" },
                            amount: { type: "number", description: "เบี้ยประกัน" },
                            act_amount: { type: "number", description: "เบี้ย พ.ร.บ. (ถ้ามี)" },
                            end_date: { type: "string", description: "วันสิ้นสุดคุ้มครอง (YYYY-MM-DD ค.ศ.)" }
                        },
                        required: ["company_id", "customer_id", "insurance_amount", "amount", "end_date"]
                    }
                }
            },
            required: ["issue_date", "customers"]
        }
    }
];

export async function runReadTool(name: string, args: Record<string, any>): Promise<unknown> {
    switch (name) {
        case "search_customers": {
            const keyword = (args.keyword || "").trim();
            const limit = clampLimit(args.limit);
            const filter = keyword
                ? {
                      $or: [
                          { plate_number: { $regex: new RegExp(escapeRegex(keyword), "i") } },
                          { name: { $regex: new RegExp(escapeRegex(keyword), "i") } }
                      ]
                  }
                : {};
            const items = await CustomerSchema.find(filter).sort({ plate_number: 1 }).limit(limit).lean();
            const total = await CustomerSchema.countDocuments(filter);
            return { total, items };
        }

        case "search_companies": {
            const keyword = (args.keyword || "").trim();
            const limit = clampLimit(args.limit);
            const filter = keyword
                ? {
                      $or: [
                          { name: { $regex: new RegExp(escapeRegex(keyword), "i") } },
                          { id_company: { $regex: new RegExp(escapeRegex(keyword), "i") } }
                      ]
                  }
                : {};
            const items = await CompanySchema.find(filter).sort({ name: 1 }).limit(limit).lean();
            const total = await CompanySchema.countDocuments(filter);
            return { total, items };
        }

        case "search_invoices": {
            const filter: Record<string, any> = {};
            if (args.plate_no) {
                filter.plate_no = { $regex: new RegExp(escapeRegex(String(args.plate_no).trim()), "i") };
            }
            if (args.customer_name) {
                filter.customer_name = { $regex: new RegExp(escapeRegex(String(args.customer_name).trim()), "i") };
            }
            if (args.invoice_no !== undefined && args.invoice_no !== null) {
                filter.invoice_no = Number(args.invoice_no);
            }
            if (args.insurance_no) {
                filter.insurance_no = { $regex: new RegExp(escapeRegex(String(args.insurance_no).trim()), "i") };
            }
            if (args.from_date || args.to_date) {
                filter.issue_date = {};
                if (args.from_date) filter.issue_date.$gte = new Date(args.from_date);
                if (args.to_date) filter.issue_date.$lte = new Date(args.to_date);
            }
            const limit = clampLimit(args.limit);
            const items = await InvoiceSchema.find(filter).sort({ invoice_no: -1 }).limit(limit).lean();
            const total = await InvoiceSchema.countDocuments(filter);
            return { total, items };
        }

        case "get_invoice_detail": {
            const invoiceNo = Number(args.invoice_no);
            const invoice = await InvoiceSchema.findOne({ invoice_no: invoiceNo }).lean();
            if (!invoice) return { error: `ไม่พบใบวางบิลเลขที่ ${invoiceNo}` };
            return invoice;
        }

        case "get_dashboard_overview": {
            const [customerCount, companyCount, invoiceInfo, quotationCount] = await Promise.all([
                Customer.count(),
                Company.count(),
                Invoice.info(),
                QuotationSchema.countDocuments()
            ]);
            return {
                customer_count: customerCount,
                company_count: companyCount,
                invoice_count: invoiceInfo.count,
                latest_invoice_no: invoiceInfo.latest_number,
                quotation_count: quotationCount
            };
        }

        case "get_next_invoice_no": {
            const info = await Invoice.info();
            const latest = Number(info.latest_number || 100);
            return { latest_invoice_no: latest, next_invoice_no: latest + 1 };
        }

        case "search_quotations": {
            const filter: Record<string, any> = {};
            if (args.year) {
                const y = Number(args.year);
                filter.issue_date = {
                    $gte: new Date(`${y}-01-01T00:00:00.000Z`),
                    $lte: new Date(`${y}-12-31T23:59:59.999Z`)
                };
            }
            if (args.plate_number) {
                filter["customers.plate_number"] = {
                    $regex: new RegExp(escapeRegex(String(args.plate_number).trim()), "i")
                };
            }
            const limit = clampLimit(args.limit, 15);
            const items = await QuotationSchema.find(filter).sort({ issue_date: -1 }).limit(limit).lean();
            return { total: items.length, items };
        }

        default:
            throw new Error400(`Unknown read tool: ${name}`);
    }
}

export async function buildProposalAction(
    name: string,
    args: Record<string, any>
): Promise<PendingAction> {
    switch (name) {
        case "propose_create_customer": {
            const plate_number = String(args.plate_number || "").trim();
            const customerName = String(args.name || "").trim();
            if (!plate_number || !customerName) {
                throw new Error400("กรุณาระบุเลขทะเบียนรถและชื่อลูกค้าให้ครบถ้วน");
            }
            const existing = await CustomerSchema.findOne({ plate_number }).lean();
            const warnings = existing
                ? [`ทะเบียนรถ ${plate_number} มีอยู่ในระบบแล้ว (ชื่อเดิม: ${existing.name})`]
                : undefined;
            return {
                type: "CREATE_CUSTOMER",
                mode: "create",
                title: `สร้างลูกค้าใหม่: ${plate_number}`,
                warnings,
                payload: { plate_number, name: customerName },
                preview: { plate_number, name: customerName }
            };
        }

        case "propose_update_customer": {
            const customerId = String(args.customer_id || "").trim();
            const existing = await CustomerSchema.findById(customerId).lean();
            if (!existing) throw new Error400(`ไม่พบข้อมูลลูกค้า ID: ${customerId}`);

            const nextPlate = args.plate_number ? String(args.plate_number).trim() : existing.plate_number;
            const nextName = args.name ? String(args.name).trim() : existing.name;

            return {
                type: "UPDATE_CUSTOMER",
                mode: "update",
                title: `แก้ไขข้อมูลลูกค้า: ${existing.plate_number}`,
                payload: {
                    customer_id: customerId,
                    plate_number: nextPlate,
                    name: nextName
                },
                preview: {
                    before: { plate_number: existing.plate_number, name: existing.name },
                    after: { plate_number: nextPlate, name: nextName }
                }
            };
        }

        case "propose_create_company": {
            const id_company = String(args.id_company || "").trim();
            const companyName = String(args.name || "").trim();
            const address = String(args.address || "").trim();
            if (!id_company || !companyName || !address) {
                throw new Error400("กรุณาระบุรหัสผู้เสียภาษี ชื่อบริษัท และที่อยู่ให้ครบถ้วน");
            }
            const existing = await CompanySchema.findOne({ id_company }).lean();
            const warnings = existing
                ? [`รหัสบริษัท ${id_company} มีอยู่ในระบบแล้ว (${existing.name})`]
                : undefined;
            return {
                type: "CREATE_COMPANY",
                mode: "create",
                title: `สร้างบริษัทประกันใหม่: ${companyName}`,
                warnings,
                payload: { id_company, name: companyName, address },
                preview: { id_company, name: companyName, address }
            };
        }

        case "propose_update_company": {
            const companyId = String(args.company_id || "").trim();
            const existing = await CompanySchema.findById(companyId).lean();
            if (!existing) throw new Error400(`ไม่พบข้อมูลบริษัท ID: ${companyId}`);

            const nextIdCompany = args.id_company ? String(args.id_company).trim() : existing.id_company;
            const nextName = args.name ? String(args.name).trim() : existing.name;
            const nextAddress = args.address ? String(args.address).trim() : existing.address;

            return {
                type: "UPDATE_COMPANY",
                mode: "update",
                title: `แก้ไขบริษัทประกัน: ${existing.name}`,
                payload: {
                    company_id: companyId,
                    id_company: nextIdCompany,
                    name: nextName,
                    address: nextAddress
                },
                preview: {
                    before: {
                        id_company: existing.id_company,
                        name: existing.name,
                        address: existing.address
                    },
                    after: {
                        id_company: nextIdCompany,
                        name: nextName,
                        address: nextAddress
                    }
                }
            };
        }

        case "propose_upsert_invoice": {
            let invoiceNo = args.invoice_no ? Number(args.invoice_no) : undefined;
            if (!invoiceNo || Number.isNaN(invoiceNo)) {
                const info = await Invoice.info();
                invoiceNo = Number(info.latest_number || 100) + 1;
            }

            const plateNo = String(args.plate_no || "").trim();
            const receiverId = String(args.insurance_receiver_id || "").trim();
            const amount = Number(args.amount);
            const amountAct = args.amount_act !== undefined && args.amount_act !== null ? Number(args.amount_act) : 0;
            const amountStamp = Number(args.amount_stamp);
            const isCompany = Boolean(args.is_company);

            if (Number.isNaN(amount) || Number.isNaN(amountStamp)) {
                throw new Error400("เบี้ยประกันสุทธิและอากรแสตมป์ต้องเป็นตัวเลข");
            }

            const [existingInvoice, customer, company] = await Promise.all([
                InvoiceSchema.findOne({ invoice_no: invoiceNo }).lean(),
                CustomerSchema.findOne({ plate_number: plateNo }).lean(),
                CompanySchema.findOne({ id_company: receiverId }).lean()
            ]);

            const warnings: string[] = [];
            const prerequisiteActions: PrerequisiteAction[] = [];

            if (!customer) {
                const customerName = String(args.customer_name || "").trim();
                if (!customerName) {
                    warnings.push(`ไม่พบทะเบียนรถ ${plateNo} ในระบบ กรุณาระบุชื่อลูกค้าเพื่อสร้างข้อมูลลูกค้าใหม่ด้วย`);
                } else {
                    warnings.push(`ไม่พบทะเบียนรถ ${plateNo} ในระบบ จะสร้างข้อมูลลูกค้า "${customerName}" ให้พร้อมกัน`);
                    prerequisiteActions.push({
                        type: "CREATE_CUSTOMER",
                        title: `สร้างลูกค้าใหม่: ${plateNo}`,
                        payload: { plate_number: plateNo, name: customerName }
                    });
                }
            }

            if (!company) {
                const companyName = String(args.company_name || "").trim();
                const companyAddress = String(args.company_address || "").trim();
                if (!companyName || !companyAddress) {
                    warnings.push(
                        `ไม่พบบริษัทประกันรหัส ${receiverId} ในระบบ กรุณาเลือกบริษัทที่มีอยู่หรือระบุชื่อและที่อยู่บริษัท`
                    );
                } else {
                    warnings.push(`ไม่พบบริษัทประกัน ${receiverId} ในระบบ จะสร้างบริษัท "${companyName}" ให้พร้อมกัน`);
                    prerequisiteActions.push({
                        type: "CREATE_COMPANY",
                        title: `สร้างบริษัทใหม่: ${companyName}`,
                        payload: {
                            id_company: receiverId,
                            name: companyName,
                            address: companyAddress
                        }
                    });
                }
            }

            const amounts = calculateInvoiceAmounts(
                amount,
                amountAct > 0 ? amountAct : undefined,
                amountStamp,
                isCompany
            );

            const mode = existingInvoice ? "update" : "create";
            if (existingInvoice) {
                warnings.push(`ใบวางบิลเลขที่ ${invoiceNo} มีอยู่แล้ว การยืนยันจะเป็นการอัปเดตข้อมูลทับใบเดิม`);
            }

            const payload = {
                invoice_no: invoiceNo,
                plate_no: plateNo,
                insurance_receiver_id: receiverId,
                issue_date: args.issue_date,
                start_date: args.start_date,
                end_date: args.end_date,
                insurance_type: String(args.insurance_type || "").trim(),
                insurance_amount: String(args.insurance_amount || "").trim(),
                insurance_no: String(args.insurance_no || "").trim(),
                act_no: args.act_no ? String(args.act_no).trim() : "",
                amount,
                amount_act: amountAct > 0 ? amountAct : undefined,
                amount_stamp: amountStamp,
                is_company: isCompany
            };

            return {
                type: "UPSERT_INVOICE",
                mode,
                title: `${mode === "create" ? "สร้าง" : "แก้ไข"}ใบวางบิลเลขที่ ${invoiceNo}`,
                warnings: warnings.length > 0 ? warnings : undefined,
                prerequisiteActions: prerequisiteActions.length > 0 ? prerequisiteActions : undefined,
                payload,
                preview: {
                    customer_name: customer?.name || args.customer_name || plateNo,
                    company_name: company?.name || args.company_name || receiverId,
                    ...amounts
                }
            };
        }

        case "propose_upsert_quotation": {
            const quotationId = args.quotation_id ? String(args.quotation_id).trim() : undefined;
            const customersInput = Array.isArray(args.customers) ? args.customers : [];
            if (!args.issue_date || customersInput.length === 0) {
                throw new Error400("กรุณาระบุวันที่ออกใบเสนอราคาและรายการลูกค้าอย่างน้อย 1 รายการ");
            }

            const companyIds = customersInput.map((c: any) => c.company_id);
            const customerIds = customersInput.map((c: any) => c.customer_id);
            const [companies, customers] = await Promise.all([
                CompanySchema.find({ _id: { $in: companyIds } }).lean(),
                CustomerSchema.find({ _id: { $in: customerIds } }).lean()
            ]);

            const companyMap = new Map(companies.map((c) => [String(c._id), c]));
            const customerMap = new Map(customers.map((c) => [String(c._id), c]));

            const previewItems = customersInput.map((c: any) => {
                const comp = companyMap.get(String(c.company_id));
                const cust = customerMap.get(String(c.customer_id));
                if (!comp) throw new Error400(`ไม่พบบริษัทประกัน ID: ${c.company_id}`);
                if (!cust) throw new Error400(`ไม่พบลูกค้า ID: ${c.customer_id}`);
                return {
                    company_name: comp.name,
                    plate_number: cust.plate_number,
                    customer_name: cust.name,
                    insurance_amount: c.insurance_amount,
                    amount: Number(c.amount),
                    act_amount: c.act_amount ? Number(c.act_amount) : undefined,
                    end_date: c.end_date
                };
            });

            const mode = quotationId ? "update" : "create";
            return {
                type: "UPSERT_QUOTATION",
                mode,
                title: `${mode === "create" ? "สร้าง" : "แก้ไข"}ใบเสนอราคา (${previewItems.length} รายการ)`,
                payload: {
                    quotation_id: quotationId,
                    issue_date: args.issue_date,
                    customers: customersInput
                },
                preview: {
                    issue_date: args.issue_date,
                    items: previewItems
                }
            };
        }

        default:
            throw new Error400(`Unknown proposal tool: ${name}`);
    }
}

export async function executePendingAction(input: {
    type: PendingActionType;
    payload: Record<string, any>;
    prerequisiteActions?: PrerequisiteAction[];
}): Promise<{
    message: string;
    type: PendingActionType;
    data: any;
    downloadPdfUrl?: string;
}> {
    // 1. Execute prerequisite customer/company creation if needed
    if (Array.isArray(input.prerequisiteActions)) {
        for (const pre of input.prerequisiteActions) {
            if (pre.type === "CREATE_CUSTOMER") {
                const exists = await CustomerSchema.findOne({ plate_number: pre.payload.plate_number }).lean();
                if (!exists) {
                    await Customer.create({
                        plate_number: pre.payload.plate_number,
                        name: pre.payload.name
                    });
                }
            } else if (pre.type === "CREATE_COMPANY") {
                const exists = await CompanySchema.findOne({ id_company: pre.payload.id_company }).lean();
                if (!exists) {
                    await Company.create({
                        id_company: pre.payload.id_company,
                        name: pre.payload.name,
                        address: pre.payload.address
                    });
                }
            }
        }
    }

    // 2. Execute main action through domain models
    switch (input.type) {
        case "CREATE_CUSTOMER": {
            const res = await Customer.create({
                plate_number: input.payload.plate_number,
                name: input.payload.name
            });
            return {
                message: `สร้างลูกค้า ${input.payload.plate_number} เรียบร้อยแล้ว`,
                type: input.type,
                data: res.data
            };
        }

        case "UPDATE_CUSTOMER": {
            const res = await Customer.update(input.payload.customer_id, {
                plate_number: input.payload.plate_number,
                name: input.payload.name
            });
            return {
                message: `แก้ไขข้อมูลลูกค้า ${input.payload.plate_number} เรียบร้อยแล้ว`,
                type: input.type,
                data: res.data
            };
        }

        case "CREATE_COMPANY": {
            const res = await Company.create({
                id_company: input.payload.id_company,
                name: input.payload.name,
                address: input.payload.address
            });
            return {
                message: `สร้างบริษัทประกัน ${input.payload.name} เรียบร้อยแล้ว`,
                type: input.type,
                data: res.data
            };
        }

        case "UPDATE_COMPANY": {
            const res = await Company.update(input.payload.company_id, {
                id_company: input.payload.id_company,
                name: input.payload.name,
                address: input.payload.address
            });
            return {
                message: `แก้ไขข้อมูลบริษัท ${input.payload.name} เรียบร้อยแล้ว`,
                type: input.type,
                data: res.data
            };
        }

        case "UPSERT_INVOICE": {
            const saved = await Invoice.upsert(input.payload);
            if (!saved) throw new Error400("ไม่สามารถบันทึกใบวางบิลได้");
            return {
                message: `บันทึกใบวางบิลเลขที่ ${saved.invoice_no} เรียบร้อยแล้ว`,
                type: input.type,
                data: saved,
                downloadPdfUrl: `/api/invoice/${saved.invoice_no}/export`
            };
        }

        case "UPSERT_QUOTATION": {
            const saved = await Quotation.upsert(
                {
                    issue_date: input.payload.issue_date,
                    customers: input.payload.customers
                },
                input.payload.quotation_id || undefined
            );
            return {
                message: `บันทึกใบเสนอราคาเรียบร้อยแล้ว`,
                type: input.type,
                data: saved
            };
        }

        default:
            throw new Error400(`Unsupported action type: ${input.type}`);
    }
}
