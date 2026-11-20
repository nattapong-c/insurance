import { GoogleGenAI, Content, Part, ThinkingLevel } from "@google/genai";
import { LLMMessage, LLMProvider, LLMResponse, LLMToolCall, LLMToolDefinition } from "./types";

export class GeminiProvider implements LLMProvider {
    readonly name = "gemini";
    private readonly client: GoogleGenAI;
    private readonly model: string;

    constructor(apiKey: string, model?: string) {
        this.client = new GoogleGenAI({ apiKey });
        this.model = model || "gemini-3.8-flash";
    }

    async generate(params: {
        systemPrompt: string;
        messages: LLMMessage[];
        tools: LLMToolDefinition[];
    }): Promise<LLMResponse> {
        const contents: Content[] = params.messages.map((msg) => this.toGeminiContent(msg));

        const functionDeclarations = params.tools.map((t) => ({
            name: t.name,
            description: t.description,
            parametersJsonSchema: t.parameters
        }));

        const response = await this.client.models.generateContent({
            model: this.model,
            contents,
            config: {
                systemInstruction: params.systemPrompt,
                tools: functionDeclarations.length > 0 ? [{ functionDeclarations }] : undefined,
                temperature: 0.2,
                thinkingConfig: {
                    thinkingLevel: ThinkingLevel.LOW
                }
            }
        });

        const rawParts = response.candidates?.[0]?.content?.parts || [];
        const functionCallParts = rawParts.filter((p) => Boolean(p.functionCall));

        const toolCalls: LLMToolCall[] =
            functionCallParts.length > 0
                ? functionCallParts.map((part, idx) => ({
                      id: part.functionCall?.id || `gemini_call_${Date.now()}_${idx}`,
                      name: part.functionCall?.name || "",
                      args: (part.functionCall?.args as Record<string, any>) || {},
                      thoughtSignature: part.thoughtSignature
                  }))
                : (response.functionCalls || []).map((fc, idx) => ({
                      id: fc.id || `gemini_call_${Date.now()}_${idx}`,
                      name: fc.name || "",
                      args: (fc.args as Record<string, any>) || {}
                  }));

        return {
            text: response.text || undefined,
            toolCalls,
            rawParts: rawParts.length > 0 ? rawParts : undefined
        };
    }

    private toGeminiContent(msg: LLMMessage): Content {
        if (msg.role === "tool" && msg.toolResults) {
            const parts: Part[] = msg.toolResults.map((tr) => ({
                functionResponse: {
                    id: tr.toolCallId,
                    name: tr.name,
                    response: { output: tr.result }
                }
            }));
            return { role: "user", parts };
        }

        if (msg.role === "assistant") {
            if (msg.rawParts && msg.rawParts.length > 0) {
                return { role: "model", parts: msg.rawParts as Part[] };
            }

            const parts: Part[] = [];
            if (msg.content) {
                parts.push({ text: msg.content });
            }
            if (msg.toolCalls && msg.toolCalls.length > 0) {
                for (const tc of msg.toolCalls) {
                    parts.push({
                        functionCall: {
                            id: tc.id,
                            name: tc.name,
                            args: tc.args
                        },
                        ...(tc.thoughtSignature ? { thoughtSignature: tc.thoughtSignature } : {})
                    });
                }
            }
            return { role: "model", parts: parts.length > 0 ? parts : [{ text: "" }] };
        }

        const parts: Part[] = [];
        if (msg.content) {
            parts.push({ text: msg.content });
        }
        if (msg.attachments && msg.attachments.length > 0) {
            for (const att of msg.attachments) {
                parts.push({
                    inlineData: {
                        mimeType: att.mimeType,
                        data: att.data.toString("base64")
                    }
                });
            }
        }
        return { role: "user", parts: parts.length > 0 ? parts : [{ text: "" }] };
    }
}
