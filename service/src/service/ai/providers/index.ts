import env from "../../../config_env";
import { GeminiProvider } from "./gemini.provider";
import { OpenAICompatibleProvider } from "./openai.provider";
import { LLMProvider } from "./types";

export class AIConfigError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AIConfigError";
    }
}

export const createLLMProvider = (): LLMProvider => {
    const provider = (env.AI_PROVIDER || "gemini").trim().toLowerCase();
    const apiKey = (env.AI_API_KEY || "").trim();

    if (!apiKey) {
        throw new AIConfigError(
            "ยังไม่ได้ตั้งค่า AI_API_KEY ในระบบ (กรุณาเพิ่ม AI_PROVIDER, AI_MODEL และ AI_API_KEY ในไฟล์ .env ของ service)"
        );
    }

    if (provider === "gemini") {
        return new GeminiProvider(apiKey, env.AI_MODEL || undefined);
    }

    if (provider === "openai" || provider === "openai-compatible") {
        return new OpenAICompatibleProvider(
            apiKey,
            env.AI_MODEL || undefined,
            env.AI_BASE_URL || undefined
        );
    }

    throw new AIConfigError(
        `ไม่รองรับ AI_PROVIDER="${env.AI_PROVIDER}" (รองรับเฉพาะ "gemini" หรือ "openai")`
    );
};

export * from "./types";
