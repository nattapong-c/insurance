import { calculateInvoiceAmounts } from "../../invoice/invoice.model";
import { AIConfigError, createLLMProvider } from "../providers";
import { LLMProvider } from "../providers/types";
import { runChatAgent } from "../ai.service";
import env from "../../../config_env";
import CustomerSchema from "../../../schema/Customer";
import CompanySchema from "../../../schema/Company";
import InvoiceSchema from "../../../schema/Invoice";
import { Invoice } from "../../invoice/invoice.model";

jest.mock("@google/genai", () => ({
    GoogleGenAI: jest.fn().mockImplementation(() => ({
        models: { generateContent: jest.fn() }
    })),
    ThinkingLevel: {
        LOW: "LOW",
        MINIMAL: "MINIMAL"
    }
}));
jest.mock("openai", () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        chat: { completions: { create: jest.fn() } }
    }))
}));
jest.mock("../../../schema/Customer");
jest.mock("../../../schema/Company");
jest.mock("../../../schema/Invoice");
jest.mock("../../../schema/Quotation");

describe("calculateInvoiceAmounts", () => {
    it("calculates VAT 7% without withholding tax for individual customer", () => {
        const res = calculateInvoiceAmounts(10000, 600, 40, false);
        expect(res.total_amount_1).toBe(10640);
        expect(res.vat_7).toBeCloseTo(744.8, 2);
        expect(res.total_amount_2).toBeCloseTo(11384.8, 2);
        expect(res.vat_at_paid).toBe(0);
        expect(res.total_amount_3).toBeCloseTo(11384.8, 2);
    });

    it("calculates VAT 7% and 1% withholding tax for company customer without ACT", () => {
        const res = calculateInvoiceAmounts(10000, undefined, 40, true);
        expect(res.total_amount_1).toBe(10040);
        expect(res.vat_7).toBeCloseTo(702.8, 2);
        expect(res.total_amount_2).toBeCloseTo(10742.8, 2);
        expect(res.vat_at_paid).toBeCloseTo(100.4, 2);
        expect(res.total_amount_3).toBeCloseTo(10642.4, 2);
    });
});

describe("createLLMProvider", () => {
    const originalEnv = { ...env };

    afterEach(() => {
        env.AI_PROVIDER = originalEnv.AI_PROVIDER;
        env.AI_API_KEY = originalEnv.AI_API_KEY;
        env.AI_MODEL = originalEnv.AI_MODEL;
        env.AI_BASE_URL = originalEnv.AI_BASE_URL;
    });

    it("throws AIConfigError when AI_API_KEY is missing", () => {
        env.AI_API_KEY = "";
        expect(() => createLLMProvider()).toThrow(AIConfigError);
    });

    it("creates GeminiProvider when AI_PROVIDER is gemini", () => {
        env.AI_PROVIDER = "gemini";
        env.AI_API_KEY = "test-key";
        const provider = createLLMProvider();
        expect(provider.name).toBe("gemini");
    });

    it("creates OpenAICompatibleProvider when AI_PROVIDER is openai", () => {
        env.AI_PROVIDER = "openai";
        env.AI_API_KEY = "test-key";
        const provider = createLLMProvider();
        expect(provider.name).toBe("openai");
    });

    it("throws AIConfigError for unsupported provider", () => {
        env.AI_PROVIDER = "unknown-provider";
        env.AI_API_KEY = "test-key";
        expect(() => createLLMProvider()).toThrow(AIConfigError);
    });
});

describe("runChatAgent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns direct answer when provider makes no tool calls", async () => {
        const mockProvider: LLMProvider = {
            name: "mock",
            generate: jest.fn().mockResolvedValue({
                text: "สวัสดีครับ มีอะไรให้ช่วยไหมครับ",
                toolCalls: []
            })
        };

        const result = await runChatAgent({
            messages: [{ role: "user", content: "สวัสดี" }],
            providerOverride: mockProvider
        });

        expect(result.message).toBe("สวัสดีครับ มีอะไรให้ช่วยไหมครับ");
        expect(result.pendingAction).toBeUndefined();
        expect(result.toolTrace).toEqual([]);
    });

    it("executes read tool then returns final answer", async () => {
        (CustomerSchema.find as jest.Mock).mockReturnValue({
            sort: () => ({
                limit: () => ({
                    lean: async () => [{ _id: "c1", plate_number: "กข-1234", name: "สมชาย" }]
                })
            })
        });
        (CustomerSchema.countDocuments as jest.Mock).mockResolvedValue(1);

        const generate = jest
            .fn()
            .mockResolvedValueOnce({
                toolCalls: [{ id: "tc1", name: "search_customers", args: { keyword: "กข-1234" } }]
            })
            .mockResolvedValueOnce({
                text: "พบข้อมูลลูกค้าทะเบียน กข-1234 ชื่อ สมชาย ครับ",
                toolCalls: []
            });

        const result = await runChatAgent({
            messages: [{ role: "user", content: "หาลูกค้า กข-1234" }],
            providerOverride: { name: "mock", generate }
        });

        expect(result.toolTrace).toEqual(["search_customers"]);
        expect(result.message).toContain("สมชาย");
        expect(generate).toHaveBeenCalledTimes(2);
    });

    it("stops loop and returns pendingAction with prerequisite when proposing invoice for new customer", async () => {
        jest.spyOn(Invoice, "info").mockResolvedValue({ count: 10, latest_number: 1044 });
        (InvoiceSchema.findOne as jest.Mock).mockReturnValue({ lean: async () => null });
        (CustomerSchema.findOne as jest.Mock).mockReturnValue({ lean: async () => null });
        (CompanySchema.findOne as jest.Mock).mockReturnValue({
            lean: async () => ({
                _id: "comp1",
                id_company: "0107537000882",
                name: "บมจ. วิริยะประกันภัย",
                address: "กรุงเทพฯ"
            })
        });

        const generate = jest.fn().mockResolvedValueOnce({
            text: "กรุณาตรวจสอบข้อมูลใบวางบิลครับ",
            toolCalls: [
                {
                    id: "tc_prop",
                    name: "propose_upsert_invoice",
                    args: {
                        plate_no: "กข-9999",
                        customer_name: "สมหญิง",
                        insurance_receiver_id: "0107537000882",
                        issue_date: "2026-11-20",
                        start_date: "2026-11-20",
                        end_date: "2027-11-20",
                        insurance_type: "ประเภท 1",
                        insurance_amount: "500000",
                        insurance_no: "POL-999",
                        amount: 10000,
                        amount_act: 600,
                        amount_stamp: 40,
                        is_company: false
                    }
                }
            ]
        });

        const result = await runChatAgent({
            messages: [{ role: "user", content: "สร้างใบวางบิล" }],
            providerOverride: { name: "mock", generate }
        });

        expect(result.pendingAction).toBeDefined();
        expect(result.pendingAction?.type).toBe("UPSERT_INVOICE");
        expect(result.pendingAction?.payload.invoice_no).toBe(1045);
        expect(result.pendingAction?.prerequisiteActions).toHaveLength(1);
        expect(result.pendingAction?.prerequisiteActions?.[0].type).toBe("CREATE_CUSTOMER");
        expect(result.pendingAction?.preview.total_amount_1).toBe(10640);
    });
});
