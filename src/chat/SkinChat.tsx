import { useEffect, useRef, useState, type ReactNode } from "react";

const FONT_DISPLAY = "'Brandon Grotesque Bold', sans-serif";
const FONT_LIGHT = "'Brandon Grotesque KIDS Light', sans-serif";

// gemini-flash-latest was retired; Google now points it at this model directly.
const MODEL = "gemini-3.8-flash";

// In production the request goes through /api/chat (Vercel edge function holding
// the real key). A VITE_GEMINI_API_KEY in .env.local (gitignored) switches dev
// builds to calling Gemini directly, since `pnpm dev` has no /api routes.
const DEV_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ?? "";

type Msg = { role: "user" | "model"; text: string };

// Minimal Markdown rendering for Gemini replies: **bold**, *italic*, `code`,
// bullet/numbered lists and ### headings. Anything else stays as plain text.
function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*.+?\*\*|\*.+?\*|`.+?`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2)
      return <code key={i} style={{ fontSize: "0.9em", background: "rgba(0,0,0,0.08)", padding: "0 0.25em" }}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function renderMarkdown(text: string): ReactNode[] {
  return text.split("\n").map((line, i) => {
    const heading = line.match(/^#{1,4}\s+(.*)/);
    if (heading) return <div key={i} style={{ fontWeight: 700, marginTop: i ? "0.4em" : 0 }}>{renderInline(heading[1])}</div>;
    const bullet = line.match(/^\s*[-*]\s+(.*)/);
    if (bullet) return <div key={i} style={{ paddingLeft: "1em", textIndent: "-0.7em" }}>• {renderInline(bullet[1])}</div>;
    const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)/);
    if (numbered) return <div key={i} style={{ paddingLeft: "1.2em", textIndent: "-1.2em" }}>{numbered[1]}. {renderInline(numbered[2])}</div>;
    if (line.trim() === "") return <div key={i} style={{ height: "0.5em" }} />;
    return <div key={i}>{renderInline(line)}</div>;
  });
}

async function streamChat(
  systemPrompt: string,
  history: Msg[],
  onChunk: (fullText: string) => void,
): Promise<string> {
  const contents = history.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
  const res = DEV_KEY
    ? await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${DEV_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt }] }, contents }),
        },
      )
    : await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, contents }),
      });
  if (!res.ok || !res.body) throw new Error(`chat error ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const json = JSON.parse(line.slice(6));
        const text = json.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
        if (text) {
          full += text;
          onChunk(full);
        }
      } catch {
        // ignore malformed keep-alive chunks
      }
    }
  }
  return full;
}

export function SkinChat({ systemPrompt }: { systemPrompt: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setError(null);
    const history: Msg[] = [...messages, { role: "user", text }];
    setMessages([...history, { role: "model", text: "" }]);
    setBusy(true);
    try {
      await streamChat(systemPrompt, history, (full) =>
        setMessages([...history, { role: "model", text: full }]),
      );
    } catch {
      setError("Something went wrong talking to the assistant. Try again.");
      setMessages(history);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Skincare assistant"
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 60,
          width: "3.25rem",
          height: "3.25rem",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "var(--primary)",
          color: "var(--white)",
          fontFamily: FONT_DISPLAY,
          fontSize: "1.3rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          touchAction: "manipulation",
        }}
      >
        {open ? "×" : "✦"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            top: "4.75rem",
            right: "1rem",
            zIndex: 60,
            width: "min(24rem, calc(100vw - 3rem))",
            height: "min(32rem, calc(100dvh - 8rem))",
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-secondary)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          <div style={{ background: "var(--primary)", color: "var(--white)", padding: "0.75rem 1rem", fontFamily: FONT_DISPLAY, fontSize: "0.95rem", letterSpacing: "0.04em" }}>
            Skin Assistant
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {messages.length === 0 && (
              <p style={{ fontFamily: FONT_LIGHT, fontSize: "0.85rem", color: "rgba(0,0,0,0.5)", lineHeight: 1.6 }}>
                Ask me anything about your routine — e.g. "what's tonight's routine?" or "can I use Vinergetic after the peeling?"
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "0.55rem 0.8rem",
                  fontFamily: FONT_LIGHT,
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  whiteSpace: m.role === "user" ? "pre-wrap" : undefined,
                  background: m.role === "user" ? "var(--primary)" : "rgba(0,0,0,0.06)",
                  color: m.role === "user" ? "var(--white)" : "inherit",
                }}
              >
                {m.text ? (m.role === "model" ? renderMarkdown(m.text) : m.text) : "…"}
              </div>
            ))}
            {error && <p style={{ fontFamily: FONT_LIGHT, fontSize: "0.8rem", color: "#c0392b" }}>{error}</p>}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", padding: "0.75rem", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about your skin…"
              style={{ flex: 1, padding: "0.55rem 0.75rem", border: "1px solid rgba(0,0,0,0.2)", fontFamily: FONT_LIGHT, fontSize: "0.85rem", background: "var(--white)" }}
            />
            <button
              onClick={send}
              disabled={busy}
              style={{ padding: "0 1rem", border: "none", cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1, background: "var(--primary)", color: "var(--white)", fontFamily: FONT_DISPLAY, fontSize: "0.85rem" }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
