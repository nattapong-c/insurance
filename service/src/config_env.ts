import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, ".env") });

export default {
    EXPRESS_PORT: process.env.PORT || process.env.EXPRESS_PORT,
    MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING ?? "",
    DB_NAME: process.env.DB_NAME ?? "test",
    USE_JS: process.env.USE_JS ?? null,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY ?? '',
    JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY ?? '',
    PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH ?? '',
    AI_PROVIDER: process.env.AI_PROVIDER ?? 'gemini',
    AI_MODEL: process.env.AI_MODEL ?? '',
    AI_API_KEY: process.env.AI_API_KEY ?? '',
    AI_BASE_URL: process.env.AI_BASE_URL ?? ''
};