import OpenAI from "openai";
import type {
    ChatCompletionContentPart,
    ChatCompletionMessageParam,
    ChatCompletionTool
} from "openai/resources/chat/completions";
import { LLMMessage, LLMProvider, LLMResponse, LLMToolCall, LLMToolDefinition } from "./types";

export class OpenAICompatibleProvider implements LLMProvider {
    readonly name = "openai";
    private readonly client: OpenAI;
    private readonly model: string;

    constructor(apiKey: string, model?: string, baseURL?: string) {
        this.client = new OpenAI({
            apiKey,
            baseURL: baseURL || undefined,
            timeout: 45000,
            maxRetries: 1
        });
        this.model = model || "gpt-4o-mini";
    }

    async generate(params: {
        systemPrompt: string;
        messages: LLMMessage[];
        tools: LLMToolDefinition[];
    }): Promise<LLMResponse> {
        const openAiMessages: ChatCompletionMessageParam[] = [
            { role: "system", content: params.systemPrompt },
            ...params.messages.flatMap((msg) => this.toOpenAIMessages(msg))
        ];

        const openAiTools: ChatCompletionTool[] = params.tools.map((t) => ({
            type: "function",
            function: {
                name: t.name,
                description: t.description,
                parameters: t.parameters
            }
        }));

        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: openAiMessages,
            tools: openAiTools.length > 0 ? openAiTools : undefined,
            temperature: 0.2
        });

        const choice = response.choices[0]?.message;
        const toolCalls: LLMToolCall[] = (choice?.tool_calls || [])
            .filter((tc): tc is Extract<typeof tc, { type: "function" }> => tc.type === "function")
            .map((tc) => {
                let parsedArgs: Record<string, any> = {};
                try {
                    parsedArgs = tc.function.arguments ? JSON.parse(tc.function.arguments) : {};
                } catch {
                    parsedArgs = {};
                }
                return {
                    id: tc.id,
                    name: tc.function.name,
                    args: parsedArgs
                };
            });

        return {
            text: choice?.content || undefined,
            toolCalls
        };
    }

    private toOpenAIMessages(msg: LLMMessage): ChatCompletionMessageParam[] {
        if (msg.role === "tool" && msg.toolResults) {
            return msg.toolResults.map((tr) => ({
                role: "tool" as const,
                tool_call_id: tr.toolCallId,
                content: JSON.stringify(tr.result)
            }));
        }

        if (msg.role === "assistant") {
            return [
                {
                    role: "assistant",
                    content: msg.content || null,
                    tool_calls:
                        msg.toolCalls && msg.toolCalls.length > 0
                            ? msg.toolCalls.map((tc) => ({
                                  id: tc.id,
                                  type: "function" as const,
                                  function: {
                                      name: tc.name,
                                      arguments: JSON.stringify(tc.args)
                                  }
                              }))
                            : undefined
                }
            ];
        }

        if (msg.attachments && msg.attachments.length > 0) {
            const parts: ChatCompletionContentPart[] = [];
            if (msg.content) {
                parts.push({ type: "text", text: msg.content });
            }
            for (const att of msg.attachments) {
                const base64 = att.data.toString("base64");
                if (att.mimeType === "application/pdf") {
                    parts.push({
                        type: "file",
                        file: {
                            filename: att.fileName || "document.pdf",
                            file_data: `data:application/pdf;base64,${base64}`
                        }
                    });
                } else {
                    parts.push({
                        type: "image_url",
                        image_url: {
                            url: `data:${att.mimeType};base64,${base64}`
                        }
                    });
                }
            }
            return [{ role: "user", content: parts }];
        }

        return [{ role: "user", content: msg.content || "" }];
    }
}
