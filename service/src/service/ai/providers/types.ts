export interface LLMAttachment {
    mimeType: string;
    data: Buffer;
    fileName?: string;
}

export interface LLMToolCall {
    id: string;
    name: string;
    args: Record<string, any>;
    thoughtSignature?: string;
}

export interface LLMToolResult {
    toolCallId: string;
    name: string;
    result: unknown;
}

export interface LLMMessage {
    role: "user" | "assistant" | "tool";
    content?: string;
    attachments?: LLMAttachment[];
    toolCalls?: LLMToolCall[];
    toolResults?: LLMToolResult[];
    rawParts?: unknown[];
}

export interface LLMToolDefinition {
    name: string;
    description: string;
    parameters: Record<string, any>;
}

export interface LLMResponse {
    text?: string;
    toolCalls: LLMToolCall[];
    rawParts?: unknown[];
}

export interface LLMProvider {
    readonly name: string;
    generate(params: {
        systemPrompt: string;
        messages: LLMMessage[];
        tools: LLMToolDefinition[];
    }): Promise<LLMResponse>;
}
