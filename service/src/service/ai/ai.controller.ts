import { Request, Response } from "express";
import { Error400 } from "../../utils/error";
import { AIConfigError, LLMAttachment } from "./providers";
import { ChatInputMessage, runChatAgent } from "./ai.service";
import { PendingActionType, PrerequisiteAction, executePendingAction } from "./ai.tools";

const ALLOWED_ACTION_TYPES = new Set<PendingActionType>([
    "CREATE_CUSTOMER",
    "UPDATE_CUSTOMER",
    "CREATE_COMPANY",
    "UPDATE_COMPANY",
    "UPSERT_INVOICE",
    "UPSERT_QUOTATION"
]);

export const chatWithAgent = async (req: Request, res: Response) => {
    let parsedMessages: ChatInputMessage[] = [];
    const rawMessages = req.body?.messages;

    if (typeof rawMessages === "string") {
        try {
            parsedMessages = JSON.parse(rawMessages);
        } catch {
            throw new Error400("invalid messages JSON format");
        }
    } else if (Array.isArray(rawMessages)) {
        parsedMessages = rawMessages;
    }

    if (!Array.isArray(parsedMessages) || parsedMessages.length === 0) {
        throw new Error400("missing messages");
    }

    const sanitizedMessages: ChatInputMessage[] = parsedMessages
        .filter((m) => m && (m.role === "user" || m.role === "assistant"))
        .map((m) => ({
            role: m.role,
            content: typeof m.content === "string" ? m.content : ""
        }));

    if (sanitizedMessages.length === 0) {
        throw new Error400("messages cannot be empty");
    }

    const files = (req.files as Express.Multer.File[]) || [];
    const attachments: LLMAttachment[] = files.map((file) => ({
        mimeType: file.mimetype,
        data: file.buffer,
        fileName: file.originalname
    }));

    try {
        const result = await runChatAgent({
            messages: sanitizedMessages,
            attachments
        });
        return res.send(result);
    } catch (err: any) {
        if (err instanceof AIConfigError) {
            return res.status(503).send({ error: err.message });
        }
        throw err;
    }
};

export const executeAgentAction = async (req: Request, res: Response) => {
    const { type, payload, prerequisiteActions } = req.body as {
        type?: PendingActionType;
        payload?: Record<string, any>;
        prerequisiteActions?: PrerequisiteAction[];
    };

    if (!type || !ALLOWED_ACTION_TYPES.has(type)) {
        throw new Error400("invalid action type");
    }
    if (!payload || typeof payload !== "object") {
        throw new Error400("missing action payload");
    }

    const result = await executePendingAction({
        type,
        payload,
        prerequisiteActions
    });

    return res.send(result);
};
