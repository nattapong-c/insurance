import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { handleToken } from "../../middleware/authen";
import { chatWithAgent, executeAgentAction } from "./ai.controller";
import { Error400 } from "../../utils/error";

const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf"
]);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 3
    },
    fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
            return cb(new Error400("รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, WebP) หรือ PDF เท่านั้น"));
        }
        cb(null, true);
    }
});

const uploadFilesMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const handler = upload.array("files", 3) as unknown as (
        req: Request,
        res: Response,
        cb: (err?: any) => void
    ) => void;
    handler(req, res, (err?: any) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                return next(new Error400(`อัปโหลดไฟล์ไม่สำเร็จ: ${err.message}`));
            }
            return next(err);
        }
        next();
    });
};

const router = (module.exports = Router());

router.post("/chat", handleToken, uploadFilesMiddleware, chatWithAgent);
router.post("/execute", handleToken, executeAgentAction);
