module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/categorize/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$azure$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/openai/azure.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)"); // 推荐使用 NextResponse
;
;
;
// 1. 把 Client 变量放在外面，但不要初始化
let client = null;
const categorySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    categoryId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('The ID of the most appropriate category'),
    confidence: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0).max(1).describe('Confidence score between 0 and 1'),
    reasoning: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('Brief explanation for the categorization')
});
// 2. 这里的 Log 可能会在编译时出现，运行时不一定每次都出
console.log('[v0] Route file loaded');
async function POST(req) {
    console.log('[v0] API POST request received'); // 这一行现在应该能看到了
    try {
        // 3. 在函数内部检查环境变量
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
        // 4. 安全检查：如果有变量缺失，显式抛出错误，而不是让 Node 进程崩溃
        if (!apiKey || !endpoint || !apiVersion || !deployment) {
            console.error('[v0] Missing Azure OpenAI Environment Variables:', {
                hasKey: !!apiKey,
                hasEndpoint: !!endpoint,
                hasVersion: !!apiVersion,
                hasDeployment: !!deployment
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Server configuration error: Missing Azure environment variables'
            }, {
                status: 500
            });
        }
        // 5. 延迟初始化 Client (单例模式)
        if (!client) {
            client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$azure$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AzureOpenAI"]({
                endpoint,
                apiKey,
                deployment,
                apiVersion,
                dangerouslyAllowBrowser: true
            });
        }
        const { message, categories } = await req.json();
        console.log('[v0] Categories received:', categories);
        const categoriesText = categories.map((cat)=>`${cat.id}: ${cat.name}${cat.description ? ' - ' + cat.description : ''}`).join('\n');
        const prompt = `You are an AI assistant that categorizes messages in a team communication platform.

Available categories:
${categoriesText}

Message to categorize:
"${message}"

Analyze the message and determine which category best fits. Consider the content, intent, and tone of the message.

Respond with a JSON object matching this schema:
{
  "categoryId": "string (The ID of the most appropriate category)",
  "confidence": "number between 0 and 1",
  "reasoning": "string (Brief explanation for the categorization)"
}`;
        console.log('[v0] Calling Azure OpenAI with deployment:', deployment);
        console.log('[v0] Azure OpenAI response start 2');
        // 注意：这里的 model 参数在 Azure 中通常对应 deployment name
        const completion = await client.chat.completions.create({
            model: deployment,
            messages: [
                {
                    role: 'system',
                    content: 'You are an AI assistant that categorizes messages. Always respond with valid JSON.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_completion_tokens: 500
        });
        console.log('[v0] Azure OpenAI response received');
        // ... (后续解析逻辑保持不变) ...
        const content = completion.choices[0].message.content;
        if (!content) throw new Error('No content in response');
        const parsed = JSON.parse(content);
        console.log('[v0] Categorization result:', parsed);
        const object = categorySchema.parse(parsed);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(object);
    } catch (error) {
        // 6. 详细打印错误
        console.error('[v0] Error detail:', error);
        // 如果是 OpenAI 的特定错误，打印更多信息
        if (error.response) {
            console.error(error.response.status);
            console.error(error.response.data);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to categorize message',
            details: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cfd510e7._.js.map