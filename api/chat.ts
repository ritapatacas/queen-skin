// Vercel edge function: proxies chat requests to Gemini so the API key
// (GEMINI_API_KEY env var, set in the Vercel dashboard) never reaches the browser.
// Falls back to safespot's public infer-api (SAFESPOT_API_URL/SAFESPOT_API_KEY,
// see juno-dotfiles/safespotapi/README.md#exposing-v1infer) when Gemini errors,
// times out, or isn't configured.
export const config = { runtime: "edge" };

const MODEL = "gemini-3.8-flash";
const GEMINI_TIMEOUT_MS = 12_000;

type Msg = { role: "user" | "model"; parts: { text: string }[] };

function sseChunk(text: string): string {
  return `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] })}\n\n`;
}

function textStream(text: string): ReadableStream {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(sseChunk(text)));
      controller.close();
    },
  });
}

async function callGemini(apiKey: string, systemPrompt: string, contents: Msg[]): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    return await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt }] }, contents }),
        signal: controller.signal,
      },
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function callSafespot(baseUrl: string, apiKey: string, systemPrompt: string, contents: Msg[]): Promise<string> {
  const messages = [
    { role: "system", content: systemPrompt },
    ...contents.map((m) => ({
      role: m.role === "model" ? "assistant" : "user",
      content: m.parts.map((p) => p.text).join(""),
    })),
  ];

  const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/v1/infer`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "assistant-default", messages, stream: false }),
  });
  if (!res.ok) throw new Error(`safespot error ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text) throw new Error("safespot returned no content");
  return text;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const { systemPrompt, contents } = await req.json();
  if (!Array.isArray(contents) || typeof systemPrompt !== "string") {
    return new Response("Bad request", { status: 400 });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const safespotUrl = process.env.SAFESPOT_API_URL;
  const safespotKey = process.env.SAFESPOT_API_KEY;

  if (geminiKey) {
    try {
      const upstream = await callGemini(geminiKey, systemPrompt, contents);
      if (upstream.ok) {
        return new Response(upstream.body, {
          status: upstream.status,
          headers: { "Content-Type": "text/event-stream" },
        });
      }
    } catch {
      // Gemini timed out or network-failed — fall through to safespot below.
    }
  }

  if (safespotUrl && safespotKey) {
    try {
      const text = await callSafespot(safespotUrl, safespotKey, systemPrompt, contents);
      return new Response(textStream(text), {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      });
    } catch {
      // Both providers failed — report below.
    }
  }

  return new Response("Chat is temporarily unavailable", { status: 503 });
}
