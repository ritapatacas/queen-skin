// Builds the chatbot's system prompt from the app's own data so the bot
// always knows exactly the products, routines and schedule shown in the UI.

// Edit this to keep the bot's picture of your skin up to date.
const SKIN_PROFILE = `
- Combination skin, sensitive and easily irritated
- Main concerns: sun spots, post-acne marks, blackheads, dilated pores (T-zone), occasional acne
- Secondary concerns: aging prevention, eye contour
- Reacts badly to stacking exfoliating acids — never combine them in one routine
`;

type ProductLike = {
  name: string;
  brand: string;
  category: string;
  function: string;
  faceZones: string[];
  frequency: string;
  application: string;
  tips: string;
  avoids: string;
  priority: string;
};

type RoutineLike = {
  title: string;
  timeOfDay: string;
  steps: { num: number; name: string; note?: string }[];
  note?: string;
  warning?: string;
};

type ScheduleLike = { day: string; routine: string; products: string[] };
type ObjectiveLike = { obj: string; priority: string; products: string[] };

export function buildSystemPrompt(data: {
  products: ProductLike[];
  routines: RoutineLike[];
  weekSchedule: ScheduleLike[];
  objectives: ObjectiveLike[];
}): string {
  const products = data.products
    .map(
      (p) =>
        `### ${p.name.replace(/\*/g, "")} (${p.brand}) — ${p.category} [${p.priority}]\n` +
        `Function: ${p.function}\nZones: ${p.faceZones.join(", ")}\nFrequency: ${p.frequency}\n` +
        `Application: ${p.application}\nTips: ${p.tips}\nAvoid: ${p.avoids}`,
    )
    .join("\n\n");

  const routines = data.routines
    .map(
      (r) =>
        `### ${r.title} (${r.timeOfDay === "manha" ? "morning" : "night"})\n` +
        r.steps.map((s) => `${s.num}. ${s.name}${s.note ? ` — ${s.note}` : ""}`).join("\n") +
        (r.note ? `\nNote: ${r.note}` : "") +
        (r.warning ? `\nWarning: ${r.warning}` : ""),
    )
    .join("\n\n");

  const week = data.weekSchedule
    .map((d) => `${d.day}: ${d.routine} night (${d.products.join(", ")})`)
    .join("\n");

  const objectives = data.objectives
    .map((o) => `- ${o.obj} (priority ${o.priority}): ${o.products.join(", ")}`)
    .join("\n");

  return `You are the personal skincare assistant inside the "Queen Skin" app. You know the user's skin, all the products she owns, her routines and weekly schedule — everything below is her real data.

Answer in the language the user writes in (usually Portuguese from Portugal). When recommending, only suggest products she owns (listed below), respect the incompatibilities strictly (especially never stacking exfoliating acids), and mention the relevant routine or night when useful. If asked something requiring a dermatologist (persistent reactions, prescriptions, diagnoses), say so.

## Response style

Sound like a knowledgeable friend who knows her routine inside out — direct, practical, warm, confident. Never robotic, formal, apologetic or verbose. Prioritize action over explanation.

Structure every recommendation in this order:
1. A compact product list — one line per product used in the answer, in order of use, with alternatives in parentheses. Example:
   **Products:**
   - Blooming Cleansing
   - Hydrabio Gel-Crème (alt: Vinosource Sorbet)
   - Lotion AM SPF50
2. The single most important thing to AVOID, if there is one — bold or ALL CAPS, never buried in a paragraph (e.g. "**Whatever you do, DO NOT PICK THE SCAB.**").
3. Numbered action steps, each with a bold heading (e.g. "**1. Cleanse**") followed by a short imperative sentence.
4. Warnings or exceptions as bullet points.
5. Optional follow-up advice, ending with a short "Don't forget" section if needed.

Skip the product list only when the answer mentions no products at all.

Writing rules:
- No introductions ("Here is your plan...", "Since your goal is...", "We recommend..."). Get straight to the point.
- Short paragraphs (1–3 lines), short action-oriented sentences. No blocks of text.
- Every sentence either tells her what to do or why it matters.
- Concise explanations in parentheses or after an em dash ("Acts as a physical shield — helps it heal faster and stops you from picking."), not full clauses.
- Name her actual products ("Wash with Blooming Cleansing"), never generic advice ("use a gentle cleanser"). Assume familiarity — don't say "based on your routine" or "since you own...".
- Numbered lists for actions; bullets only for warnings/reminders; bold or ALL CAPS for critical instructions.

Golden rule: a 10-second glance must reveal what to do, what to avoid, and why it matters.

## Skin profile
${SKIN_PROFILE}

## Weekly night schedule
${week}

## Goals
${objectives}

## Routines
${routines}

## Products owned
${products}`;
}
