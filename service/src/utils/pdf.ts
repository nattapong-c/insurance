import fs from "fs";
import puppeteer, { Browser } from "puppeteer-core";
import env from "../config_env";

const DEFAULT_EXECUTABLE_PATHS = [
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
];

let browserPromise: Promise<Browser> | null = null;

const resolveExecutablePath = (): string => {
    if (env.PUPPETEER_EXECUTABLE_PATH) {
        return env.PUPPETEER_EXECUTABLE_PATH;
    }

    const found = DEFAULT_EXECUTABLE_PATHS.find((candidate) => fs.existsSync(candidate));
    if (!found) {
        throw new Error(
            "Chromium executable not found. Set PUPPETEER_EXECUTABLE_PATH environment variable."
        );
    }
    return found;
};

const getBrowser = async (): Promise<Browser> => {
    if (!browserPromise) {
        browserPromise = puppeteer
            .launch({
                executablePath: resolveExecutablePath(),
                headless: true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage"
                ]
            })
            .then((browser) => {
                browser.on("disconnected", () => {
                    browserPromise = null;
                });
                return browser;
            })
            .catch((err) => {
                browserPromise = null;
                throw err;
            });
    }
    return browserPromise;
};

export interface PdfOptions {
    landscape?: boolean;
    scale?: number;
}

/**
 * Render an HTML string into an A4 PDF Buffer using headless Chromium.
 */
export const generatePdfBuffer = async (
    html: string,
    options: PdfOptions = {}
): Promise<Buffer> => {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        await page.setContent(html, { waitUntil: "load" });
        await page.evaluate("document.fonts.ready");
        const pdfBytes = await page.pdf({
            format: "A4",
            landscape: options.landscape ?? false,
            scale: options.scale ?? 1.22,
            printBackground: true
        });
        return Buffer.from(pdfBytes);
    } finally {
        await page.close().catch(() => {});
    }
};
