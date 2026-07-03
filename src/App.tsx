import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useProductGrid } from "./productGrid/useProductGrid";
import { RadialMenu, useRadialMenuItems } from "./components/RadialMenu";

const FONT_DISPLAY = "'Brandon Grotesque Bold', sans-serif";
const FONT_LIGHT = "'Brandon Grotesque KIDS Light', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

// White text/overlay tokens used on top of the saturated routine/modal backgrounds
const TEXT_ON_COLOR_STRONG = "rgba(255,255,255,0.85)";
const TEXT_ON_COLOR_MUTED = "rgba(255,255,255,0.75)";
const OVERLAY_ON_COLOR_STRONG = "rgba(255,255,255,0.2)";
const OVERLAY_ON_COLOR = "rgba(255,255,255,0.15)";
const OVERLAY_ON_COLOR_SOFT = "rgba(255,255,255,0.1)";

const categoryOrder = [
  "Cleanser",
  "Exfoliant",
  "Peeling",
  "Serum",
  "Repair",
  "Anti-Aging",
  "Moisturizer",
  "Mattifying Mist",
];

const products = [
  { id: 15, name: "*Blooming* Cleansing for Sensitive Skin", brand: "Blooming Skin", category: "Cleanser", url: "https://www.bloomingskin.pt", image: "blooming-cleansing-sensitive-skin.png", function: "Gentle cleansing, makeup removal, suitable for sensitive skin.", faceZones: ["forehead", "cheeks", "nose", "chin", "eyes", "neck"], frequency: "Morning and night — first step of any routine.", application: "Apply for 30 to 60 seconds with gentle circular motions. Remove with lukewarm water or a damp cotton pad.", applicationTime: "for 30–60s", tips: "Doesn't need to foam to be effective.", avoids: "No known incompatibilities.", priority: "complementar" },
  { id: 4, name: "*Effaclar* Astringent Lotion", brand: "La Roche-Posay", category: "Exfoliant", url: "https://www.laroche-posay.pt/produto/effaclar-lotion-micro-exfoliante", image: "effaclar-astringent-lotion.png", function: "Light chemical exfoliation, blackheads, enlarged pores.", faceZones: ["nose", "chin", "cheeks"], frequency: "Once a week (Sunday) — after cleansing.", application: "Apply with a cotton pad exclusively on the T-zone and cheeks. Avoid the forehead if there are no blackheads. Never apply on the eye contour. Wait 2 minutes.", applicationTime: "wait 2min", tips: "Contains glycolic acid. Reinforce SPF50 the next day.", avoids: "Do not combine with Effaclar Sérum, Galénic Peeling. Do not use on irritated skin.", priority: "muito_util" },
  { id: 5, name: "Pureté Sublime *Peeling*", brand: "Galénic", category: "Peeling", url: "https://www.galenic.com/pt/purete-sublime", image: "purete-sublime-peeling.png", function: "Cell renewal, radiance, texture improvement.", faceZones: ["forehead", "cheeks", "nose", "chin"], frequency: "Once a week (Wednesday) — after cleansing, on dry skin.", application: "Apply on completely dry skin to the cheeks, forehead, nose and chin. Massage with gentle circular motions until the enzyme granules dissolve. Wait 5 to 10 minutes and remove with lukewarm water. AVOID: eye contour (minimum 1 cm margin), lip area and nostrils, and any open active pimple. Cien Q10 can be applied normally on peeling night — the periorbital area doesn't conflict.", applicationTime: "wait 5–10min", tips: "Always follow with Cicaplast B5 Spray and then Hydrabio. SPF50 must be reinforced the next day.", avoids: "Do not combine with Effaclar Sérum or Effaclar Lotion in the same routine. Do not use on irritated skin.", priority: "muito_util" },
  { id: 2, name: "Liftactiv *B3 Serum*", brand: "Vichy", category: "Serum", url: "https://www.vichy.pt/liftactiv/liftactiv-b3-serum/VP004500.aspx", image: "liftactiv-b3-serum.png", function: "Tone evening, sun spots, photoaging.", faceZones: ["forehead", "cheeks", "nose", "chin", "neck"], frequency: "Morning — 2nd step after cleansing. Can also be used on recovery night (Thursday) or on nights with Collagen Specialist / Blooming Skin, where there are no exfoliating actives competing.", application: "Apply to the entire face and neck. Wait 1 minute before the next step. Avoid the eye area. Not recommended on nights with Effaclar Sérum, Effaclar Lotion or Galénic Peeling — the buildup of actives on those nights adds no benefit and may cause sensitivity.", applicationTime: "wait 1min", tips: "Niacinamide (B3) has no incompatibilities with collagens or peptides — it fits well on recovery nights. Visible results after 4 weeks of consistent use.", avoids: "Do not use in the same routine as Galénic Peeling or Effaclar Lotion.", priority: "essencial" },
  { id: 3, name: "Effaclar *Sérum* Ultra Concentré", brand: "La Roche-Posay", category: "Serum", url: "https://www.laroche-posay.pt/produto/effaclar-serum-ultra-concentre", image: "effaclar-serum-ultra-concentre.png", function: "Blackheads, uneven texture, acne, enlarged pores.", faceZones: ["forehead", "nose", "chin", "cheeks"], frequency: "4 to 5 nights a week — 2nd step after cleansing.", application: "Apply to the entire T-zone and cheeks. Avoid the periorbital area (eye contour). Wait 2 to 3 minutes before the moisturizer.", applicationTime: "wait 2–3min", tips: "Contains LHA and salicylate. May cause slight initial dryness — reduce frequency if needed.", avoids: "Do not use on the same night as Galénic Peeling or Effaclar Lotion. Avoid the eye contour.", priority: "essencial" },
  { id: 9, name: "Effaclar *A.I.*", brand: "La Roche-Posay", category: "Repair", url: "https://www.laroche-posay.pt/produto/effaclar-ai", image: "effaclar-ai.png", function: "Localized treatment of active pimples.", faceZones: ["spot"], frequency: "When needed — apply directly on the pimple.", application: "Apply ONLY on the active lesion with the product's applicator tip. Thin layer. Wait 1 to 2 minutes. Do not apply on healthy skin around the pimple.", applicationTime: "wait 1–2min", tips: "Most effective when applied early at the first sign of a pimple. Can be used under makeup.", avoids: "No relevant incompatibilities.", priority: "muito_util" },
  { id: 8, name: "*Cicaplast* B5 Spray", brand: "La Roche-Posay", category: "Repair", url: "https://www.laroche-posay.pt/produto/cicaplast-b5-spray", image: "cicaplast-b5-spray.png", function: "Skin barrier repair, irritation reduction, post-peeling support.", faceZones: ["forehead", "cheeks", "nose", "chin", "neck"], frequency: "As needed — especially after peelings and before makeup.", application: "Spray from 20 cm away from the face. Let dry for 30 to 60 seconds. Do not rub.", applicationTime: "let dry 30–60s", tips: "Essential after peeling night. Can be used as a soothing primer before makeup.", avoids: "No known incompatibilities.", priority: "muito_util" },
  { id: 6, name: "*Q10* Eye Cream", brand: "Cien", category: "Anti-Aging", url: "https://www.lidl.pt/cien", image: "q10-eye-cream.png", function: "Hydration of the periorbital area, prevention of fine lines.", faceZones: ["eyes"], frequency: "Morning and night — after facial serums. Can be included in ANY night routine (treatment, peeling, recovery, blackheads) because it's applied to an area no other product covers.", application: "Apply ONLY on the orbital bone: brow arch and the cheekbone below the eye. Never on the mobile eyelid. Small amount — the size of a grain of rice per eye. Wait 30 seconds. There's no conflict with Galénic Peeling or Effaclar Sérum because those areas are always avoided with those products.", applicationTime: "wait 30s", tips: "Apply with a gentle tapping motion of the little finger to avoid pulling the delicate skin. Being an isolated area, it doesn't interfere with any active in the routine.", avoids: "Do not use in the same routine as Effaclar Sérum, Effaclar Lotion or Galénic Peeling in that area.", priority: "complementar" },
  { id: 10, name: "*Liftactiv* Collagen Specialist", brand: "Vichy", category: "Anti-Aging", url: "https://www.vichy.pt/liftactiv/liftactiv-collagen-specialist", image: "liftactiv-collagen-specialist.png", function: "Firmness, elasticity, aging prevention.", faceZones: ["forehead", "cheeks", "chin", "neck"], frequency: "Recovery nights (Thursday) — after cleansing and Cien Q10.", application: "Apply to the entire face and neck with upward motions. Wait 1 minute before the moisturizer if needed.", applicationTime: "wait 1min", tips: "Alternative to Blooming Skin Re-Lift. Use on nights without acids for maximum recovery.", avoids: "Avoid in the same routine as Effaclar Sérum or Galénic Peeling.", priority: "complementar" },
  { id: 11, name: "*Re-Lift* with Collagen", brand: "Blooming Skin", category: "Anti-Aging", url: "https://www.bloomingskin.pt", image: "re-lift-collagen.png", function: "Intense nourishment, firmness, collagen.", faceZones: ["forehead", "cheeks", "chin", "neck"], frequency: "Recovery nights — alternative to Liftactiv Collagen Specialist.", application: "Apply to the entire face and neck with upward, circular motions. Wait 1 minute.", applicationTime: "wait 1min", tips: "Good option when skin needs extra nourishment. Rotate with Liftactiv Collagen Specialist.", avoids: "Avoid in the same routine as Effaclar Sérum or Galénic Peeling.", priority: "complementar" },
  { id: 7, name: "*Hydrabio* Gel-Crème", brand: "Bioderma", category: "Moisturizer", url: "https://www.bioderma.pt/os-nossos-produtos/hydrabio/hydrabio-gel-creme", image: "hydrabio-gel-creme.png", function: "Light hydration, comfort without oiliness.", faceZones: ["forehead", "cheeks", "nose", "chin", "neck"], frequency: "Morning and night — second-to-last step (before SPF50 in the morning).", application: "Apply a thin layer to the entire face and neck. Can be applied over the eyes (contour). Wait 1 to 2 minutes before the next step.", applicationTime: "wait 1–2min", tips: "Gel-cream texture ideal for normal to combination skin. Doesn't overload the skin.", avoids: "No known incompatibilities.", priority: "essencial" },
  { id: 14, name: "*Vinergetic* C+ Moisturizer", brand: "Caudalie", category: "Moisturizer", url: "https://www.caudalie.com/pt/rosto/hidratantes/vinergetic-c-hidratante-energizante-3-em-1.html", image: "vinergetic-c-moisturizer.png", function: "Hydration, vitamin C (radiance and spots), hyaluronic acid, antioxidant. Replaces Hydrabio in routines without exfoliating acids.", faceZones: ["forehead", "cheeks", "nose", "chin", "neck"], frequency: "Morning (replaces Hydrabio) · Recovery night (replaces Hydrabio) · Blackheads night if skin is not sensitized.", application: "Apply to the entire face and neck after serums. Wait 1 to 2 minutes before SPF50 in the morning. Do not use on irritated skin or after peeling — keep Hydrabio on those nights.", applicationTime: "wait 1–2min", tips: "Vitamin C in the morning under SPF50 is one of the most effective combinations for spots and photoaging. Do not use on peeling night or on treatment night with Effaclar Sérum — combining with acids may irritate.", avoids: "Do not use on peeling night (Galénic). Not recommended on treatment night with Effaclar Sérum on sensitive skin. Do not use on irritated skin — replace with Hydrabio.", priority: "muito_util" },
  { id: 12, name: "Normaderm Mattifying *Mist*", brand: "Vichy", category: "Mattifying Mist", url: "https://www.vichy.pt/normaderm", image: "normaderm-mattifying-mist.png", function: "Oil control, matte finish.", faceZones: ["nose", "chin", "forehead"], frequency: "Before makeup or as needed throughout the day.", application: "Apply exclusively to the T-zone (forehead, nose, chin) and chin. Avoid cheeks if sensitized. Spray and wait 30 seconds.", applicationTime: "wait 30s", tips: "Do not apply on dry or irritated cheeks. Ideal as a setting step before foundation.", avoids: "Irritated skin or sensitized cheeks.", priority: "complementar" },
  { id: 13, name: "Lotion AM *SPF50*", brand: "CeraVe", category: "Moisturizer", url: "https://www.cerave.pt/a-nossa-gama/protecao-solar/cerave-facial-moisturising-lotion-spf50", image: "lotion-am-spf50.png", function: "UV protection, prevention of spots and photoaging.", faceZones: ["forehead", "cheeks", "nose", "chin", "neck"], frequency: "Every morning — last step of the routine.", application: "Apply generously to the entire face, neck and ears. Wait 2 to 5 minutes before makeup. Reapply every 2h during sun exposure.", applicationTime: "wait 2–5min", tips: "The most important product in the entire routine for spots and aging prevention. Don't skimp on quantity.", avoids: "Do not apply before serums or moisturizers — it's always the last step of the morning.", priority: "essencial" },
].sort((a, b) => {
  const idxA = categoryOrder.indexOf(a.category);
  const idxB = categoryOrder.indexOf(b.category);
  return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
});

const weekSchedule = [
  { day: "Mon", routine: "Treatment", products: ["Effaclar Sérum"], color: "var(--treatment)" },
  { day: "Tue", routine: "Treatment", products: ["Effaclar Sérum"], color: "var(--treatment)" },
  { day: "Wed", routine: "Peeling", products: ["Galénic Peeling"], color: "var(--peeling-lavender)" },
  { day: "Thu", routine: "Recovery", products: ["Collagen / Re-Lift"], color: "var(--recovery)" },
  { day: "Fri", routine: "Treatment", products: ["Effaclar Sérum"], color: "var(--treatment)" },
  { day: "Sat", routine: "Treatment", products: ["Effaclar Sérum"], color: "var(--treatment)" },
  { day: "Sun", routine: "Blackheads", products: ["Effaclar Lotion"], color: "var(--blackheads)" },
];

const cardColors = ["var(--morning)", "var(--recovery)", "var(--peeling-lavender)", "var(--treatment)", "var(--blackheads)", "var(--pre-makeup)", "var(--irritated)", "var(--acne)", "var(--accent)", "var(--peeling)", "var(--acne-breakout)"];

function getProductColor(product: { id: number }) {
  if (product.id === 10) return "var(--shadow-grey)";
  const index = products.findIndex(p => p.id === product.id);
  return cardColors[index % cardColors.length];
}

const NO_INCOMPATIBILITIES = ["No known incompatibilities.", "No relevant incompatibilities."];

const faceZoneLabels: Record<string, string> = {
  forehead: "Forehead",
  cheeks: "Cheeks",
  nose: "Nose",
  chin: "Chin",
  eyes: "Eye contour",
  neck: "Neck",
  spot: "Active lesion",
};

function FaceDiagram({ activeZones }: { activeZones: string[] }) {
  const zoneColors = {
    forehead: activeZones.includes("forehead") ? "var(--recovery)" : "var(--face-inactive)",
    cheeks: activeZones.includes("cheeks") ? "var(--recovery)" : "var(--face-inactive)",
    nose: activeZones.includes("nose") ? "var(--recovery)" : "var(--face-inactive)",
    chin: activeZones.includes("chin") ? "var(--recovery)" : "var(--face-inactive)",
    eyes: activeZones.includes("eyes") ? "var(--peeling-lavender)" : "var(--face-inactive)",
    neck: activeZones.includes("neck") ? "var(--recovery)" : "var(--face-inactive)",
    spot: activeZones.includes("spot") ? "var(--acne)" : "var(--face-inactive)",
  };

  return (
    <svg viewBox="0 0 120 160" width="100" height="133" style={{ display: "block" }}>
      <rect x="44" y="125" width="32" height="28" rx="6" fill={zoneColors.neck} stroke="var(--border-stroke)" strokeWidth="0.5" />
      <ellipse cx="60" cy="78" rx="42" ry="52" fill="var(--face-bg)" stroke="var(--border-stroke)" strokeWidth="1" />
      <ellipse cx="60" cy="44" rx="30" ry="16" fill={zoneColors.forehead} opacity="0.7" />
      <ellipse cx="28" cy="82" rx="14" ry="18" fill={zoneColors.cheeks} opacity="0.7" />
      <ellipse cx="92" cy="82" rx="14" ry="18" fill={zoneColors.cheeks} opacity="0.7" />
      <ellipse cx="60" cy="83" rx="10" ry="13" fill={zoneColors.nose} opacity="0.75" />
      <ellipse cx="60" cy="112" rx="18" ry="10" fill={zoneColors.chin} opacity="0.7" />
      <ellipse cx="44" cy="66" rx="11" ry="6" fill={zoneColors.eyes} opacity="0.75" />
      <ellipse cx="76" cy="66" rx="11" ry="6" fill={zoneColors.eyes} opacity="0.75" />
      <ellipse cx="44" cy="66" rx="6" ry="3.5" fill="var(--face-pupil)" opacity="0.4" />
      <ellipse cx="76" cy="66" rx="6" ry="3.5" fill="var(--face-pupil)" opacity="0.4" />
      {activeZones.includes("spot") && (
        <circle cx="52" cy="74" r="5" fill={zoneColors.spot} opacity="0.9" />
      )}
      <line x1="60" y1="70" x2="60" y2="88" stroke="var(--face-stroke)" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

const TABS = [
  { id: "noite", label: "Night" },
  { id: "manha", label: "Morning" },
  { id: "produtos", label: "Products" },
  { id: "mais", label: "More" },
];

const ROUTINES = [
  {
    title: "Morning",
    color: "var(--morning)",
    textColor: "var(--white)",
    steps: [
      { num: 1, name: "Blooming Cleansing for Sensitive Skin", productId: 15, note: "30–60 sec, circular motions" },
      { num: 2, name: "Liftactiv B3 Serum", productId: 2, note: "wait 1 minute" },
      { num: 3, name: "Cicaplast B5 Spray", productId: 8, note: "optional — sensitive days or after an acid night" },
      { num: 4, name: "Q10", productId: 6, note: "only on the orbital bone" },
      { num: 5, name: "Vinergetic C+ Moisturizer", productId: 14, note: "vitamin C + SPF50" },
      { num: 6, name: "Lotion AM SPF50", productId: 13, note: "generously, wait 5 min" },
    ],
    timeOfDay: "manha",
  },
  {
    title: "Treatment",
    color: "var(--treatment)",
    textColor: "var(--white)",
    steps: [
      { num: 1, name: "Blooming Cleansing for Sensitive Skin", productId: 15, note: "double cleanse if wearing makeup" },
      { num: 2, name: "Effaclar Sérum Ultra Concentré", productId: 3, note: "forehead, nose, chin, cheeks" },
      { num: 3, name: "Q10", productId: 6, note: "only on the orbital bone" },
      { num: 4, name: "Hydrabio Gel-Crème", productId: 7, note: "entire face and neck" },
      { num: 5, name: "Effaclar A.I.", productId: 9, note: "optional — only on active pimples" },
    ],
    note: "lean routine — Effaclar Sérum is already very active. Don't add extra serums.",
    timeOfDay: "noite",
  },
  {
    title: "Recovery",
    color: "var(--recovery)",
    textColor: "var(--white)",
    steps: [
      { num: 1, name: "Blooming Cleansing for Sensitive Skin", productId: 15, note: "" },
      { num: 2, name: "Liftactiv B3 Serum", productId: 2, note: "optional" },
      { num: 3, name: "Q10", productId: 6, note: "only on the orbital bone" },
      { num: 4, name: "Liftactiv Collagen Specialist", productId: 10, note: "or Blooming Skin Re-Lift" },
      { num: 5, name: "Vinergetic C+ Moisturizer", productId: 14, note: "no competing acids" },
    ],
    timeOfDay: "noite",
  },
  {
    title: "Peeling",
    color: "var(--peeling)",
    textColor: "var(--white)",
    steps: [
      { num: 1, name: "Blooming Cleansing for Sensitive Skin", productId: 15, note: "" },
      { num: 2, name: "Pureté Sublime Peeling", productId: 5, note: "avoid 1 cm around the eyes, lips and nostrils" },
      { num: 3, name: "Q10", productId: 6, note: "can apply — no conflict" },
      { num: 4, name: "Cicaplast B5 Spray", productId: 8, note: "soothing post-peeling" },
      { num: 5, name: "Hydrabio Gel-Crème", productId: 7, note: "keep Hydrabio" },
      { num: 6, name: "Effaclar A.I.", productId: 9, note: "optional" },
    ],
    warning: "Avoid: Effaclar Sérum · Effaclar Lotion · Liftactiv B3 Serum",
    timeOfDay: "noite",
  },
  {
    title: "Blackheads",
    color: "var(--blackheads)",
    textColor: "var(--white)",
    steps: [
      { num: 1, name: "Blooming Cleansing for Sensitive Skin", productId: 15, note: "" },
      { num: 2, name: "Effaclar Astringent Lotion", productId: 4, note: "nose, chin, cheeks" },
      { num: 3, name: "Liftactiv B3 Serum", productId: 2, note: "optional" },
      { num: 4, name: "Q10", productId: 6, note: "no conflict" },
      { num: 5, name: "Cicaplast B5 Spray", productId: 8, note: "optional" },
      { num: 6, name: "Vinergetic C+ Moisturizer", productId: 14, note: "if skin is not sensitized" },
      { num: 7, name: "Effaclar A.I.", productId: 9, note: "optional" },
    ],
    warning: "Avoid: Effaclar Sérum · Pureté Sublime Peeling",
    timeOfDay: "noite",
  },
  {
    title: "Pre-Makeup",
    color: "var(--blackheads)",
    textColor: "var(--white)",
    steps: [
      { num: 1, name: "Hydrabio Gel-Crème", productId: 7, note: "" },
      { num: 2, name: "Cicaplast B5 Spray", productId: 8, note: "" },
      { num: 3, name: "Q10", productId: 6, note: "only on the orbital bone" },
      { num: 4, name: "Normaderm Mattifying Mist", productId: 12, note: "t-zone only" },
      { num: 5, name: "Effaclar A.I.", productId: 9, note: "only on pimples" },
      { num: 6, name: "Makeup", note: "" },
    ],
    note: "don't add more steps — each extra layer increases the risk of pilling.",
    timeOfDay: "manha",
  },
  {
    title: "Irritated Skin",
    color: "var(--peeling-lavender)",
    textColor: "var(--white)",
    steps: [
      { num: 1, name: "Blooming Cleansing for Sensitive Skin", productId: 15, note: "" },
      { num: 2, name: "Q10", productId: 6, note: "orbital bone only" },
      { num: 3, name: "Cicaplast B5 Spray", productId: 8, note: "optional" },
      { num: 4, name: "Hydrabio Gel-Crème", productId: 7, note: "" },
      { num: 5, name: "Lotion AM SPF50", productId: 13, note: "required" },
    ],
    warning: "Suspend all actives: Effaclar Sérum · Effaclar Lotion · Peeling · B3 · Vinergetic C+",
    timeOfDay: "manha",
  },
  {
    title: "Irritated Skin",
    color: "var(--peeling-lavender)",
    textColor: "var(--white)",
    steps: [
      { num: 1, name: "Blooming Cleansing for Sensitive Skin", productId: 15, note: "" },
      { num: 2, name: "Q10", productId: 6, note: "orbital bone only" },
      { num: 3, name: "Cicaplast B5 Spray", productId: 8, note: "barrier repair" },
      { num: 4, name: "Hydrabio Gel-Crème", productId: 7, note: "" },
    ],
    warning: "Suspend all actives: Effaclar Sérum · Effaclar Lotion · Peeling · B3 · Vinergetic C+",
    timeOfDay: "noite",
  },
  {
    title: "Acne Breakout",
    color: "var(--acne-breakout)",
    textColor: "var(--white)",
    steps: [
      { num: 1, name: "Blooming Cleansing for Sensitive Skin", productId: 15, note: "" },
      { num: 2, name: "Hydrabio Gel-Crème", productId: 7, note: "use Hydrabio, not Vinergetic" },
      { num: 3, name: "Cicaplast B5 Spray", productId: 8, note: "optional" },
      { num: 4, name: "Lotion AM SPF50", productId: 13, note: "required" },
    ],
    warning: "Suspend: Effaclar Lotion · Peeling · Vinergetic C+",
    timeOfDay: "manha",
  },
  {
    title: "Acne Breakout",
    color: "var(--acne-breakout)",
    textColor: "var(--white)",
    steps: [
      { num: 1, name: "Blooming Cleansing for Sensitive Skin", productId: 15, note: "" },
      { num: 2, name: "Effaclar Sérum Ultra Concentré", productId: 3, note: "" },
      { num: 3, name: "Q10", productId: 6, note: "orbital bone only" },
      { num: 4, name: "Cicaplast B5 Spray", productId: 8, note: "optional" },
      { num: 5, name: "Effaclar A.I.", productId: 9, note: "on each active lesion" },
      { num: 6, name: "Hydrabio Gel-Crème", productId: 7, note: "use Hydrabio, not Vinergetic" },
    ],
    warning: "Suspend: Effaclar Lotion · Peeling · Vinergetic C+",
    timeOfDay: "noite",
  },
];

const OBJECTIVES = [
  { obj: "Sun Spots", priority: "Very High", products: ["CeraVe Lotion AM SPF50", "Vichy Liftactiv B3 Serum"], color: "var(--accent)" },
  { obj: "Post-Acne Marks", priority: "Very High", products: ["CeraVe Lotion AM SPF50", "Vichy Liftactiv B3 Serum", "La Roche-Posay Effaclar Sérum Ultra Concentré"], color: "var(--acne)" },
  { obj: "Blackheads", priority: "Very High", products: ["La Roche-Posay Effaclar Sérum Ultra Concentré", "La Roche-Posay Effaclar Astringent Lotion"], color: "var(--blackheads)" },
  { obj: "Dilated Pores", priority: "High", products: ["La Roche-Posay Effaclar Sérum Ultra Concentré", "La Roche-Posay Effaclar Astringent Lotion", "Galénic Pureté Sublime Peeling"], color: "var(--blackheads)" },
  { obj: "Occasional Acne", priority: "High", products: ["La Roche-Posay Effaclar Sérum Ultra Concentré", "La Roche-Posay Effaclar A.I."], color: "var(--acne)" },
  { obj: "Irritated Skin", priority: "Very High", products: ["La Roche-Posay Cicaplast B5 Spray", "Bioderma Hydrabio Gel-Crème"], color: "var(--irritated)" },
  { obj: "Anti-Aging", priority: "Medium", products: ["Vichy Liftactiv Collagen Specialist", "Blooming Skin Re-Lift with Collagen"], color: "var(--pre-makeup)" },
  { obj: "Eye Contour", priority: "Low", products: ["Cien Q10 Eye Cream"], color: "var(--peeling-lavender)" },
];

const EXPECTATIONS = [
  { period: "2–3 months", result: "Fewer blackheads · more even skin · less acne", color: "var(--treatment)" },
  { period: "3–6 months", result: "Gradual fading of spots · visible improvement of pores", color: "var(--acne)" },
  { period: "6–12 months", result: "Better overall texture · less visible scarring", color: "var(--recovery)" },
];

// Wrap a word in *asterisks* inside a product's `name` field (e.g. "*Toleriane* Dermo-Cleanser")
// to render it larger than the rest of the title wherever this helper is used.
function renderEmphasizedName(name: string) {
  return name.split(/\*(.+?)\*/g).map((part, i) =>
    i % 2 === 1 ? <span key={i} style={{ fontSize: "1.81em", display: "inline-block" }}>{part}</span> : part
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.15rem 0.6rem",
        fontSize: "0.68rem",
        fontWeight: 600,
        letterSpacing: "0.02em",
        background: bg,
        color: color,
      }}
    >
      {label}
    </span>
  );
}

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<null | typeof products[0]>(null);
  const [activeTab, setActiveTab] = useState("noite");
  const [activeRoutine, setActiveRoutine] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("todos");
  const gridRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const subNavRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  const [stickyOffset, setStickyOffset] = useState(0);

  // Radial menu handlers
  const handleNight = useCallback(() => {
    setActiveTab("noite");
    setActiveRoutine(null);
    console.log("Night routine selected");
  }, []);

  const handleMorning = useCallback(() => {
    setActiveTab("manha");
    setActiveRoutine(null);
    console.log("Morning routine selected");
  }, []);

  const handleProducts = useCallback(() => {
    setActiveTab("produtos");
    setFilterCategory("todos");
    console.log("Products selected");
  }, []);

  // Create menu items using the convenience hook
  const menuItems = useRadialMenuItems({
    onNight: handleNight,
    onMorning: handleMorning,
    onProducts: handleProducts,
  });

  const filtered = useMemo(
    () =>
      filterCategory === "todos"
        ? products
        : products.filter((p) => p.category === filterCategory),
    [filterCategory],
  );

  const filteredProductIds = useMemo(
    () => filtered.map((p) => p.id),
    [filtered],
  );

  const productById = new Map(products.map(p => [p.id, p]));

  const { state: gridState, hoveredIndex, handleMouseMove, handleMouseLeave } = useProductGrid(
    filteredProductIds,
    gridRef,
    activeTab === "produtos",
  );

  useEffect(() => {
    const measure = () => {
      const navH = navRef.current?.getBoundingClientRect().height ?? 0;
      const subNavH = subNavRef.current?.getBoundingClientRect().height ?? 0;
      setNavHeight(navH);
      setStickyOffset(navH + subNavH);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (navRef.current) observer.observe(navRef.current);
    if (subNavRef.current) observer.observe(subNavRef.current);
    return () => observer.disconnect();
  }, [activeTab]);

  useEffect(() => {
    if (!selectedProduct) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProduct(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedProduct]);

  const categories = ["todos", ...new Set(products.map(p => p.category))];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      <header
        style={{
          background: "var(--primary)",
          padding: "4rem 1.5rem 3rem",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: activeTab === "noite" || activeTab === "manha" || activeTab === "produtos"
            ? "calc(100dvh - 7rem)"
            : "calc(100dvh - 2.5rem)",
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            width: "100%",
            padding: "2rem 1.5rem",
            position: "relative",
            zIndex: 1,
          }}
        >

          <h1
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: "normal",
              fontSize: "clamp(4.4rem, 12vw, 10rem)",
              lineHeight: 1,
              color: "var(--white)",
              letterSpacing: "0.02em",
              margin: 0,
              marginTop: "9rem",
            }}
          >
            Queen Skin
          </h1>
          <p
            style={{
              fontFamily: FONT_LIGHT,
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginTop: "1.5rem",
            }}
          >
            skin care guide
          </p>
          <p
            style={{
              fontFamily: FONT_LIGHT,
              fontWeight: 100,
              fontSize: "1rem",
              color: TEXT_ON_COLOR_STRONG,
              marginTop: "1rem",
              lineHeight: 1.6,
              maxWidth: "100%",
              wordBreak: "break-word",
            }}
          >
            34y · normal skin · prone to acne<br />
            atrophic scars · enlarged pores · sunspots · black spots
          </p>
        </div>
      </header>

      <nav
        ref={navRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "var(--primary)",
          borderBottom: `1px solid ${OVERLAY_ON_COLOR}`,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            rowGap: 0,
            padding: "0 1.5rem",
          }}
        >
          {TABS.filter(tab => tab.id !== "mais").map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActiveRoutine(null); }}
              style={{
                padding: "1rem 0",
                marginRight: "2rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "0.82rem",
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: "var(--white)",
                letterSpacing: "0.03em",
                borderBottom: activeTab === tab.id ? "2px solid var(--hero-highlight)" : "2px solid transparent",
                transition: "all 0.15s",
                fontFamily: FONT_BODY,
              }}
            >
              {tab.id === "mais" ? <i className="fa-solid fa-ellipsis" /> : tab.label}
            </button>
          ))}
        </div>
      </nav>

      {(activeTab === "noite" || activeTab === "manha") && (
        <div
          ref={subNavRef}
          style={{
            position: "sticky",
            top: navHeight,
            zIndex: 10,
            background: "var(--white)",
            borderBottom: "1px solid var(--border-light)",
          }}
        >
          <div style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "1.5rem 1.5rem 1rem",
            display: "flex",
            gap: "0.75rem",
            overflowX: "auto",
            whiteSpace: "nowrap",
            WebkitOverflowScrolling: "touch",
          }}
          >
            {ROUTINES.filter(r => r.timeOfDay === activeTab).flatMap((r, i) => [
              ...(i > 0 ? [<span key={`sep-${r.title}`} style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}> · </span>] : []),
              <button
                key={r.title}
                onClick={() => {
                  setActiveRoutine(r.title);
                  document.getElementById(`routine-${r.title}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontWeight: activeRoutine === r.title ? 600 : 400,
                  color: "var(--text-secondary)",
                  letterSpacing: "0.03em",
                  borderBottom: activeRoutine === r.title ? "2px solid var(--primary)" : "2px solid transparent",
                  transition: "all 0.15s",
                  fontFamily: FONT_BODY,
                  padding: "0 0 0.4rem",
                }}
              >
                {r.title}
              </button>,
            ])}
          </div>
        </div>
      )}

      {activeTab === "produtos" && (
        <div
          style={{
            position: "sticky",
            top: navHeight,
            zIndex: 10,
            background: "var(--white)",
            borderBottom: "1px solid var(--border-light)",
          }}
        >
          <div style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "1.5rem 1.5rem 1rem",
            display: "flex",
            gap: "0.75rem",
            overflowX: "auto",
            whiteSpace: "nowrap",
            WebkitOverflowScrolling: "touch",
          }}
          >
            {categories.flatMap((cat, i) => [
              ...(i > 0 ? [<span key={`sep-${cat}`} style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}> · </span>] : []),
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontWeight: filterCategory === cat ? 600 : 400,
                  color: "var(--text-secondary)",
                  letterSpacing: "0.03em",
                  borderBottom: filterCategory === cat ? "2px solid var(--primary)" : "2px solid transparent",
                  transition: "all 0.15s",
                  fontFamily: FONT_BODY,
                  padding: "0 0 0.4rem",
                }}
              >
                {cat === "todos" ? "All" : cat}
              </button>,
            ])}
          </div>
        </div>
      )}

      <main style={{ padding: 0 }}>
        {activeTab === "produtos" && (
          <section style={{ padding: 0 }}>
            <div style={{ maxWidth: 960, margin: "0 auto", width: "100%", padding: "2rem 1.5rem" }}>
            <div
              ref={gridRef}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 0 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {gridState.occupancy.map((productId, i) => {
                  const isVacancy = productId === null;
                  const isImageCell = i === gridState.imageCellIndex;
                  const imageProduct =
                    isImageCell && gridState.imageProductId !== null
                      ? productById.get(gridState.imageProductId)
                      : null;
                  const product = productId !== null ? productById.get(productId) : null;
                  const isHovered = i === hoveredIndex;

                  if (isVacancy && !isImageCell) {
                    return (
                      <div
                        key={`cell-${i}`}
                        style={{
                          aspectRatio: "1",
                          background: "var(--bg-primary)",
                          pointerEvents: "none",
                        }}
                      />
                    );
                  }

                  if (isVacancy && isImageCell && imageProduct) {
                    return (
                      <article
                        key={`cell-${i}`}
                        onClick={() => setSelectedProduct(imageProduct)}
                        style={{
                          overflow: "hidden",
                          cursor: "pointer",
                          aspectRatio: "1",
                          position: "relative",
                          zIndex: isHovered ? 2 : 1,
                          background: getProductColor(imageProduct),
                        }}
                      >
                        <img
                          src={import.meta.env.BASE_URL + "products/square/" + imageProduct.image}
                          alt={imageProduct.name}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            pointerEvents: "none",
                          }}
                        />
                      </article>
                    );
                  }

                  if (!product) return null;

                  const color = getProductColor(product);

                  return (
                    <article
                      key={`cell-${i}`}
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        background: color,
                        overflow: "hidden",
                        cursor: "pointer",
                        aspectRatio: "1",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: isHovered ? 2 : 1,
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: FONT_DISPLAY,
                          fontWeight: "normal",
                          fontSize: "clamp(1.6rem, 6vw, 2.8rem)",
                          color: "var(--white)",
                          lineHeight: 0.94,
                          letterSpacing: "-0.01em",
                          textTransform: "lowercase",
                          textAlign: "left",
                          hyphens: "auto",
                          overflowWrap: "break-word",
                          padding: "0 1rem",
                          position: "relative",
                          zIndex: 1,
                          margin: 0,
                        }}
                      >
                        {renderEmphasizedName(product.name)}
                      </h3>
                      <span
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          background: "rgba(0,0,0,0.25)",
                          color: "var(--white)",
                          padding: "0.15rem 0.65rem",
                          fontSize: "0.55rem",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          zIndex: 1,
                          opacity: isHovered ? 1 : 0,
                          transition: "opacity 0.3s",
                        }}
                      >
                        {product.category}
                      </span>
                    </article>
                  );
              })}
            </div>
            </div>
          </section>
        )}

        {(activeTab === "noite" || activeTab === "manha") && (
          <div style={{ display: "flex", flexDirection: "column" }}>
              {ROUTINES.filter(r => r.timeOfDay === activeTab).map((routine, idx) => (
                <div
                  id={`routine-${routine.title}`}
                  key={idx}
                  style={{
                    background: routine.color,
                    minHeight: `calc(100dvh - ${stickyOffset}px)`,
                    scrollMarginTop: stickyOffset,
                    scrollSnapAlign: "start",
                    scrollSnapStop: "always",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ maxWidth: 960, margin: "0 auto", width: "100%", padding: "2rem 1.5rem" }}>
                  <h3
                    style={{
                      fontFamily: FONT_DISPLAY,
                      margin: "0 0 1.25rem",
                      fontSize: "clamp(4.2rem, 8vw, 6rem)",
                      fontWeight: "normal",
                      color: routine.textColor,
                      letterSpacing: "-0.01em",
                      textTransform: "lowercase",
                    }}
                  >
                    {routine.title}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: 600 }}>
                    {routine.steps.map(step => (
                      <div key={step.num} style={{ display: "flex", flexDirection: "column" }}>
                        {(() => {
                          const found = products.find(p => p.id === step.productId);
                          return (
                            <>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span
                                  style={{
                                    minWidth: 26,
                                    height: 26,
                                    borderRadius: "0%",
                                    background: OVERLAY_ON_COLOR_SOFT,
                                    color: routine.textColor,
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  {step.num}
                                </span>
                                <span style={{ fontFamily: FONT_DISPLAY, fontSize: "1.4rem", fontWeight: 900, color: routine.textColor, textTransform: "lowercase", paddingBottom: "0.1rem" }}>
                                  {found ? (
                                    <span
                                      onClick={() => setSelectedProduct(found)}
                                      className="product-link"
                                      style={{ color: routine.textColor, cursor: "pointer" }}
                                    >
                                      {step.name}
                                    </span>
                                  ) : step.name}
                                </span>
                              </div>
                              {(step.note || found?.applicationTime) && (
                                <span style={{ fontFamily: FONT_LIGHT, fontSize: "0.78rem", color: "rgba(235,235,245,0.7)", marginTop: "-0.25rem", paddingLeft: "calc(26px + 0.75rem)" }}>
                                  {[step.note, found?.applicationTime].filter(Boolean).join(" · ")}
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                  {routine.warning && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.5rem 0.75rem",
                        background: OVERLAY_ON_COLOR,
                        borderRadius: "1px",
                        fontSize: "0.75rem",
                        color: routine.textColor,
                        fontWeight: 500,
                        lineHeight: 1.5,
                      }}
                    >
                      <i className="fa-solid fa-triangle-exclamation fa" style={{ color: "var(--white)", marginRight: "0.6rem" }}></i>{routine.warning}
                    </div>
                  )}
                  {routine.note && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.5rem 0.75rem",
                        background: OVERLAY_ON_COLOR_SOFT,
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        color: "rgba(235,235,245,0.85)",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                      }}
                    >
                      <i className="fa-solid fa-info" style={{ color: "var(--white)", marginRight: "0.6rem" }}></i>{routine.note}
                    </div>
                  )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === "mais" && (<>
          <section style={{ padding: "1.25rem 1.5rem" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              Night routine by day of the week. The morning routine is always the same.
            </p>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem", minWidth: 560 }}>
                {weekSchedule.map((day, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "var(--white)",
                      borderRadius: "12px",
                      border: `1px solid ${day.color}30`,
                      padding: "0.75rem 0.4rem",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: day.color, marginBottom: "0.35rem", fontFamily: FONT_BODY }}>
                      {day.day}
                    </div>
                    <div
                      style={{
                        fontSize: "0.6rem",
                        background: `${day.color}15`,
                        color: day.color,
                        borderRadius: "6px",
                        padding: "0.2rem 0.3rem",
                        fontWeight: 600,
                        marginBottom: "0.4rem",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {day.routine}
                    </div>
                    {day.products.map((p, i) => (
                      <div key={i} style={{ fontSize: "0.58rem", color: "var(--text-secondary)", lineHeight: 1.5, wordBreak: "break-word" }}>
                        {p}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: "2rem",
                background: "var(--sandy-beige)",
                borderRadius: "16px",
                padding: "1.5rem",
                border: "1px solid var(--border-light)",
              }}
            >
              <h3
                style={{
                  fontFamily: FONT_BODY,
                  margin: "0 0 1.25rem",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                Realistic Expectations
              </h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {EXPECTATIONS.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <span
                      style={{
                        background: item.color,
                        color: "var(--white)",
                        borderRadius: "8px",
                        padding: "0.25rem 0.65rem",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {item.period}
                    </span>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", paddingTop: "0.2rem", lineHeight: 1.5 }}>
                      {item.result}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem 1rem",
                  background: "var(--bg-secondary)",
                  borderRadius: "10px",
                  fontSize: "0.78rem",
                  color: "var(--text-note)",
                  lineHeight: 1.6,
                  border: "1px solid var(--border-light)",
                }}
              >
                <strong>Note:</strong> Depressed scars cannot be eliminated with cosmetics. For relevant
                correction of depressions, medical procedures such as microneedling,
                radiofrequency, fractional laser or subcision are required.
              </div>
            </div>
          </section>

          <section style={{ display: "grid", gap: "0.75rem", marginTop: "2rem", padding: "0 1.5rem 5rem" }}>
            {OBJECTIVES.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--white)",
                  borderRadius: "14px",
                  border: "1px solid var(--border-light)",
                  padding: "1.25rem",
                  display: "flex",
                  gap: "1.25rem",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ minWidth: 120 }}>
                  <div
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "var(--text-primary)",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {item.obj}
                  </div>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      background: `${item.color}15`,
                      color: item.color,
                      borderRadius: "999px",
                      padding: "0.15rem 0.5rem",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item.priority}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", paddingTop: "0.15rem" }}>
                  {item.products.map((pName, i) => {
                    const found = products.find(p => `${p.brand} ${p.name}` === pName || p.name === pName);
                    return (
                      <span
                        key={i}
                        onClick={() => {
                          if (found) {
                            setSelectedProduct(found);
                            setActiveTab("produtos");
                          }
                        }}
                        style={{
                          padding: "0.3rem 0.7rem",
                          borderRadius: "8px",
                          background: `${item.color}10`,
                          color: item.color,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: found ? "pointer" : "default",
                          border: `1px solid ${item.color}25`,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => {
                          if (found) e.currentTarget.style.background = `${item.color}20`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = `${item.color}10`;
                        }}
                      >
                        {pName}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        </>)}
      </main>

      {/* Radial Menu - Always visible in top-right corner */}
      <RadialMenu
        items={menuItems}
        radius={38}
        closeDelay={300}
        animationDuration={400}
      />

      {selectedProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(21,8,17,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <button
            onClick={() => setSelectedProduct(null)}
            aria-label="Close"
            style={{
              position: "fixed",
              top: "1.25rem",
              right: "1.25rem",
              zIndex: 101,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: OVERLAY_ON_COLOR_STRONG,
              border: "none",
              color: "var(--white)",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
          <div
            style={{
              background: getProductColor(selectedProduct),
              width: "100%",
              height: "100dvh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "2rem 1.5rem",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ maxWidth: 600, margin: "0 auto", width: "100%" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: FONT_LIGHT,
                      fontSize: "0.65rem",
                      color: TEXT_ON_COLOR_MUTED,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      marginBottom: "0.15rem",
                      fontWeight: 500,
                    }}
                  >
                    {selectedProduct.brand}
                  </div>
                  <h2
                    style={{
                      fontFamily: FONT_DISPLAY,
                      margin: "0 0 0.6rem",
                      fontSize: "clamp(2.4rem, 8vw, 4.5rem)",
                      fontWeight: "normal",
                      color: "var(--white)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.01em",
                      textTransform: "lowercase",
                    }}
                  >
                    {renderEmphasizedName(selectedProduct.name)}
                  </h2>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    <Badge label={selectedProduct.category} color="var(--white)" bg={OVERLAY_ON_COLOR_STRONG} />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "2rem", alignItems: "center", marginBottom: "1.25rem" }}>
                <img
                  src={import.meta.env.BASE_URL + "products/cropped/" + selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{
                    maxWidth: 170,
                    width: "auto",
                    maxHeight: 215,
                    objectFit: "contain",
                    flexShrink: 0,
                    borderRadius: "8px",
                  }}
                />
                <div
                  style={{
                    background: OVERLAY_ON_COLOR_SOFT,
                    borderRadius: "8px",
                    padding: "1rem",
                    flex: 1,
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <FaceDiagram activeZones={selectedProduct.faceZones} />
                  <div>
                    <div
                      style={{
                        fontFamily: FONT_LIGHT,
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: TEXT_ON_COLOR_MUTED,
                        marginBottom: "0.5rem",
                      }}
                    >
                      Application Zones
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                      {Object.entries(faceZoneLabels).map(([key, label]) => {
                        const active = selectedProduct.faceZones.includes(key);
                        return (
                          <span
                            key={key}
                            style={{
                              padding: "0.2rem 0.5rem",
                              fontSize: "0.68rem",
                              fontWeight: active ? 700 : 400,
                              background: active ? OVERLAY_ON_COLOR_STRONG : "rgba(0,0,0,0.1)",
                              color: "var(--white)",
                            }}
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    fontFamily: FONT_LIGHT,
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: TEXT_ON_COLOR_MUTED,
                    marginBottom: "0.25rem",
                  }}
                >
                  Apply
                </div>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--white)", lineHeight: 1.7, fontFamily: FONT_LIGHT }}>
                  {selectedProduct.application}
                </p>
              </div>

              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--white)", lineHeight: 1.7, fontFamily: FONT_LIGHT }}>
                {[
                  { label: "Function", value: selectedProduct.function },
                  { label: "Frequency", value: selectedProduct.frequency },
                  { label: "Tip", value: selectedProduct.tips },
                  { label: "Incompatibilities", value: selectedProduct.avoids },
                ]
                  .filter(item => !NO_INCOMPATIBILITIES.includes(item.value))
                  .map((item, i, arr) => (
                    <span key={item.label}>
                      <span style={{ fontFamily: FONT_LIGHT, fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: TEXT_ON_COLOR_MUTED }}>
                        {item.label}:
                      </span>{" "}
                      {item.value}
                      {i < arr.length - 1 ? "  ·  " : ""}
                    </span>
                  ))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
