import {
    AI_TOOL_DEFINITIONS,
    PROPOSAL_TOOL_NAMES,
    PendingAction,
    buildProposalAction,
    runReadTool
} from "./ai.tools";
import { LLMAttachment, LLMMessage, LLMProvider, createLLMProvider } from "./providers";

const MAX_AGENT_ITERATIONS = 6;
const MAX_HISTORY_MESSAGES = 20;

const buildSystemPrompt = (): string => {
    const today = new Date().toISOString().slice(0, 10);
    return `คุณคือผู้ช่วย AI อัจฉริยะสำหรับ "ระบบจัดการใบวางบิลและใบเสนอราคาประกันภัย" (Insurance Invoice & Quotation Management System)
วันที่ปัจจุบัน (ค.ศ.): ${today}

หน้าที่ของคุณ:
1. ตอบคำถามเกี่ยวกับข้อมูลลูกค้า บริษัทประกัน ใบวางบิล ใบเสนอราคา และภาพรวมระบบ โดยเรียกใช้ Read Tools เพื่อค้นหาข้อมูลจริงจากฐานข้อมูลเสมอ ห้ามเดาตัวเลขหรือข้อมูลเอง
2. ช่วยสร้างและแก้ไขข้อมูลลูกค้า บริษัทประกัน ใบวางบิล และใบเสนอราคา ผ่าน Proposal Tools เท่านั้น (ผู้ใช้จะเป็นผู้ตรวจสอบและกดยืนยันก่อนบันทึกลงฐานข้อมูล) ไม่มีสิทธิ์ลบข้อมูลใดๆ
3. อ่านรูปภาพหรือไฟล์ PDF กรมธรรม์ประกันภัย / ตารางกรมธรรม์ / เอกสารที่เกี่ยวข้อง เพื่อนำมาสร้างใบวางบิล:
   - แปลงวันที่ พ.ศ. เป็น ค.ศ. รูปแบบ YYYY-MM-DD เสมอ (ลบ 543 จากปี พ.ศ.)
   - แยก "เบี้ยประกันสุทธิ (amount)" ออกจาก "เบี้ย พ.ร.บ. (amount_act)" และ "ค่าอากรแสตมป์ (amount_stamp)" อย่างระมัดระวัง ห้ามนำยอดรวม VAT มาใส่ใน amount
   - ตรวจสอบลูกค้าจากทะเบียนรถ (search_customers) และบริษัทประกันจากชื่อ/รหัส (search_companies) รวมถึงเรียก get_next_invoice_no ก่อนเรียก propose_upsert_invoice
   - หากไม่พบลูกค้าหรือบริษัทประกันในระบบ ให้ส่ง customer_name และ company_name/company_address มาใน propose_upsert_invoice ด้วย เพื่อให้ระบบเสนอสร้างข้อมูลลูกค้า/บริษัทใหม่ควบคู่กัน
   - ระบุ is_company = true เฉพาะกรณีผู้เอาประกันเป็นนิติบุคคล/บริษัท/หจก. (หัก ณ ที่จ่าย 1%) และ false สำหรับบุคคลธรรมดา
   - หากข้อมูลสำคัญในเอกสารไม่ชัดเจนหรือขาดหาย (เช่น เลขกรมธรรม์, ทะเบียนรถ, เบี้ยสุทธิ, อากรแสตมป์) ให้แจ้งผู้ใช้ทราบหรือสอบถามเพิ่มเติมก่อน

รูปแบบการตอบ:
- ตอบเป็นภาษาไทยที่สุภาพ กระชับ ชัดเจน อ่านง่าย
- เมื่อเรียก Proposal Tool สำเร็จ ให้สรุปสั้นๆ ว่าเตรียมข้อมูลพร้อมให้ตรวจสอบใน Preview Card ด้านล่างแล้ว`;
};

export interface ChatInputMessage {
    role: "user" | "assistant";
    content: string;
}

export interface ChatAgentResult {
    message: string;
    pendingAction?: PendingAction;
    toolTrace: string[];
}

export const runChatAgent = async (params: {
    messages: ChatInputMessage[];
    attachments?: LLMAttachment[];
    providerOverride?: LLMProvider;
}): Promise<ChatAgentResult> => {
    const provider = params.providerOverride ?? createLLMProvider();
    const trimmedHistory = params.messages.slice(-MAX_HISTORY_MESSAGES);

    const conversation: LLMMessage[] = trimmedHistory.map((m, idx) => {
        const isLastUserMessage = idx === trimmedHistory.length - 1 && m.role === "user";
        return {
            role: m.role,
            content: m.content,
            attachments: isLastUserMessage && params.attachments?.length ? params.attachments : undefined
        };
    });

    const toolTrace: string[] = [];
    const systemPrompt = buildSystemPrompt();

    for (let step = 0; step < MAX_AGENT_ITERATIONS; step++) {
        const llmStart = Date.now();
        const response = await provider.generate({
            systemPrompt,
            messages: conversation,
            tools: AI_TOOL_DEFINITIONS
        });
        const llmMs = Date.now() - llmStart;
        console.info(
            `[AI] step=${step + 1} provider=${provider.name} llmMs=${llmMs} toolCalls=${
                response.toolCalls?.map((t) => t.name).join(",") || "none"
            }`
        );

        if (!response.toolCalls || response.toolCalls.length === 0) {
            return {
                message: response.text || "ขออภัย ไม่สามารถประมวลผลคำขอได้ในขณะนี้",
                toolTrace
            };
        }

        // Record assistant's tool call turn
        conversation.push({
            role: "assistant",
            content: response.text,
            toolCalls: response.toolCalls,
            rawParts: response.rawParts
        });

        // Check if any tool call is a Write Proposal Tool
        const proposalCall = response.toolCalls.find((tc) => PROPOSAL_TOOL_NAMES.has(tc.name));
        if (proposalCall) {
            toolTrace.push(proposalCall.name);
            const pendingAction = await buildProposalAction(proposalCall.name, proposalCall.args);
            return {
                message:
                    response.text ||
                    `เตรียมข้อมูลสำหรับ "${pendingAction.title}" เรียบร้อยแล้ว กรุณาตรวจสอบรายละเอียดด้านล่างก่อนกดยืนยันครับ`,
                pendingAction,
                toolTrace
            };
        }

        // Execute all Read Tools in this turn
        const toolResults = await Promise.all(
            response.toolCalls.map(async (tc) => {
                toolTrace.push(tc.name);
                try {
                    const result = await runReadTool(tc.name, tc.args);
                    return { toolCallId: tc.id, name: tc.name, result };
                } catch (err: any) {
                    return {
                        toolCallId: tc.id,
                        name: tc.name,
                        result: { error: err?.message || "Tool execution failed" }
                    };
                }
            })
        );

        conversation.push({
            role: "tool",
            toolResults
        });
    }

    return {
        message: "การประมวลผลใช้ขั้นตอนมากเกินกำหนด กรุณาลองระบุคำสั่งให้ชัดเจนขึ้นอีกครั้งครับ",
        toolTrace
    };
};
