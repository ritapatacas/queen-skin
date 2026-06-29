import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Toleriane Dermo-Cleanser",
    brand: "La Roche-Posay",
    emoji: "🧴",
    category: "Limpeza",
    url: "https://www.laroche-posay.pt/produto/toleriane-dermo-cleanser",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
    function: "Limpeza suave, remoção de maquilhagem, adequado para pele sensível.",
    zones: ["rosto", "olhos", "pescoço"],
    faceZones: ["forehead", "cheeks", "nose", "chin", "eyes", "neck"],
    frequency: "Manhã e noite — primeiro passo de qualquer rotina.",
    application: "Aplicar durante 30 a 60 segundos com movimentos circulares suaves. Remover com água morna ou algodão húmido.",
    tips: "Pode ser usado como desmaquilhante. Não necessita de espuma para ser eficaz.",
    avoids: "Sem incompatibilidades conhecidas.",
    priority: "essencial",
  },
  {
    id: 2,
    name: "Liftactiv B3 Serum",
    brand: "Vichy",
    emoji: "💛",
    category: "Manchas & Tom",
    url: "https://www.vichy.pt/liftactiv/liftactiv-b3-serum/VP004500.aspx",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
    function: "Uniformização do tom, manchas solares, fotoenvelhecimento.",
    zones: ["rosto", "pescoço"],
    faceZones: ["forehead", "cheeks", "nose", "chin", "neck"],
    frequency: "Manhã — 2.º passo após limpeza. Também pode ser usado na noite de recuperação (quinta) ou nas noites com Collagen Specialist / Blooming Skin, onde não há ativos esfoliantes a competir.",
    application: "Aplicar em toda a face e pescoço. Esperar 1 minuto antes do próximo passo. Evitar zona dos olhos. Não é indicado nas noites com Effaclar Sérum, Effaclar Lotion ou Galénic Peeling — a acumulação de ativos nessas noites não acrescenta benefício e pode sensibilizar.",
    tips: "A niacinamida (B3) não tem incompatibilidades com colagens ou peptídeos — encaixa bem nas noites de recuperação. Resultados visíveis a partir de 4 semanas de uso consistente.",
    avoids: "Não usar na mesma rotina que Galénic Peeling ou Effaclar Lotion.",
    priority: "essencial",
  },
  {
    id: 3,
    name: "Effaclar Sérum Ultra Concentré",
    brand: "La Roche-Posay",
    emoji: "⚗️",
    category: "Acne & Poros",
    url: "https://www.laroche-posay.pt/produto/effaclar-serum-ultra-concentre",
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&q=80",
    function: "Pontos negros, textura irregular, acne, poros dilatados.",
    zones: ["testa", "nariz", "queixo", "bochechas"],
    faceZones: ["forehead", "nose", "chin", "cheeks"],
    frequency: "4 a 5 noites por semana — 2.º passo após limpeza.",
    application: "Aplicar em toda a zona T e bochechas. Evitar a zona periorbital (contorno dos olhos). Esperar 2 a 3 minutos antes do hidratante.",
    tips: "Contém LHA e salicilato. Pode causar ligeira secura inicial — reduzir frequência se necessário.",
    avoids: "Não usar na mesma noite que Galénic Peeling ou Effaclar Lotion. Evitar contorno dos olhos.",
    priority: "essencial",
  },
  {
    id: 4,
    name: "Effaclar Lotion Astringente",
    brand: "La Roche-Posay",
    emoji: "🫧",
    category: "Acne & Poros",
    url: "https://www.laroche-posay.pt/produto/effaclar-lotion-micro-exfoliante",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
    function: "Esfoliação química leve, pontos negros, poros dilatados.",
    zones: ["nariz", "queixo", "bochechas"],
    faceZones: ["nose", "chin", "cheeks"],
    frequency: "1 vez por semana (domingo) — após limpeza.",
    application: "Aplicar com algodão exclusivamente na zona T e bochechas. Evitar testa se não houver pontos negros. Nunca aplicar no contorno dos olhos. Esperar 2 minutos.",
    tips: "Contém ácido glicólico. No dia seguinte, reforçar o SPF50.",
    avoids: "Não combinar com Effaclar Sérum, Galénic Peeling. Não usar em pele irritada.",
    priority: "muito_util",
  },
  {
    id: 5,
    name: "Pureté Sublime Peeling",
    brand: "Galénic",
    emoji: "✨",
    category: "Renovação Celular",
    url: "https://www.galenic.com/pt/purete-sublime",
    image: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80",
    function: "Renovação celular, luminosidade, melhoria de textura.",
    zones: ["testa", "bochechas", "nariz", "queixo"],
    faceZones: ["forehead", "cheeks", "nose", "chin"],
    frequency: "1 vez por semana (quarta) — após limpeza, em rosto seco.",
    application: "Aplicar em rosto completamente seco nas bochechas, testa, nariz e queixo. Massajar com movimentos circulares suaves até os grânulos de enzimas se dissolverem. Aguardar 5 a 10 minutos e remover com água morna. EVITAR: contorno dos olhos (margem mínima de 1 cm), zona dos lábios e narinas, e qualquer borbulha ativa aberta. O Cien Q10 pode ser aplicado normalmente na noite de peeling — zona periorbital não entra em conflito.",
    tips: "Seguir sempre com Cicaplast B5 Spray e depois Hydrabio. Reforçar obrigatoriamente o SPF50 no dia seguinte.",
    avoids: "Não combinar com Effaclar Sérum ou Effaclar Lotion na mesma rotina. Não usar em pele irritada.",
    priority: "muito_util",
  },
  {
    id: 6,
    name: "Cien Q10 Eye Cream",
    brand: "Cien",
    emoji: "👁️",
    category: "Contorno dos Olhos",
    url: "https://www.lidl.pt/cien",
    image: "https://images.unsplash.com/photo-1631390149630-6646aaae3a5f?w=400&q=80",
    function: "Hidratação da zona periorbital, prevenção de linhas finas.",
    zones: ["osso orbital"],
    faceZones: ["eyes"],
    frequency: "Manhã e noite — após séruns faciais. Pode ser incluído em QUALQUER rotina noturna (tratamento, peeling, recuperação, pontos negros) porque é aplicado numa zona que nenhum outro produto cobre.",
    application: "Aplicar APENAS sobre o osso orbital: arco do supercílio e malar abaixo do olho. Nunca na pálpebra móvel. Pequena quantidade — tamanho de um grão de arroz por olho. Esperar 30 segundos. Não há conflito com o Galénic Peeling ou Effaclar Sérum porque essas zonas são sempre evitadas com esses produtos.",
    tips: "Aplicar com batimento suave do dedo mindinho para evitar tração na pele delicada. Por ser numa zona isolada, não interfere com nenhum ativo da rotina.",
    avoids: "Não usar na mesma rotina que Effaclar Sérum, Effaclar Lotion ou Galénic Peeling nessa zona.",
    priority: "complementar",
  },
  {
    id: 7,
    name: "Hydrabio Gel-Crème",
    brand: "Bioderma",
    emoji: "💧",
    category: "Hidratação",
    url: "https://www.bioderma.pt/os-nossos-produtos/hydrabio/hydrabio-gel-creme",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&q=80",
    function: "Hidratação leve, conforto sem oleosidade.",
    zones: ["rosto", "pescoço"],
    faceZones: ["forehead", "cheeks", "nose", "chin", "neck"],
    frequency: "Manhã e noite — penúltimo passo (antes do SPF50 de manhã).",
    application: "Aplicar camada fina em toda a face e pescoço. Pode ser aplicado sobre os olhos (contorno). Esperar 1 a 2 minutos antes do próximo passo.",
    tips: "Textura gel-creme ideal para pele normal a mista. Não sobrecarrega a pele.",
    avoids: "Sem incompatibilidades conhecidas.",
    priority: "essencial",
  },
  {
    id: 8,
    name: "Cicaplast B5 Spray",
    brand: "La Roche-Posay",
    emoji: "🌿",
    category: "Reparação da Barreira",
    url: "https://www.laroche-posay.pt/produto/cicaplast-b5-spray",
    image: "https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=400&q=80",
    function: "Reparação da barreira cutânea, redução de irritação, apoio pós-peeling.",
    zones: ["rosto", "pescoço"],
    faceZones: ["forehead", "cheeks", "nose", "chin", "neck"],
    frequency: "Conforme necessário — especialmente após peelings e pré-maquilhagem.",
    application: "Pulverizar a 20 cm do rosto. Deixar secar 30 a 60 segundos. Não friccionar.",
    tips: "Essencial após a noite de peeling. Pode ser usado como primer calmante antes da maquilhagem.",
    avoids: "Sem incompatibilidades conhecidas.",
    priority: "muito_util",
  },
  {
    id: 9,
    name: "Effaclar A.I.",
    brand: "La Roche-Posay",
    emoji: "🎯",
    category: "Tratamento Localizado",
    url: "https://www.laroche-posay.pt/produto/effaclar-ai",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80",
    function: "Tratamento localizado de borbulhas ativas.",
    zones: ["exclusivamente sobre a lesão"],
    faceZones: ["spot"],
    frequency: "Quando necessário — aplicar diretamente sobre a borbulha.",
    application: "Aplicar APENAS sobre a lesão ativa com a ponteira do produto. Camada fina. Esperar 1 a 2 minutos. Não aplicar em área sã à volta da borbulha.",
    tips: "Mais eficaz quando aplicado precocemente ao sinal de borbulha. Pode ser usado sob maquilhagem.",
    avoids: "Sem incompatibilidades relevantes.",
    priority: "muito_util",
  },
  {
    id: 10,
    name: "Liftactiv Collagen Specialist",
    brand: "Vichy",
    emoji: "🌸",
    category: "Antienvelhecimento",
    url: "https://www.vichy.pt/liftactiv/liftactiv-collagen-specialist",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80",
    function: "Firmeza, elasticidade, prevenção do envelhecimento.",
    zones: ["rosto", "pescoço"],
    faceZones: ["forehead", "cheeks", "chin", "neck"],
    frequency: "Noites de recuperação (quinta) — após limpeza e Cien Q10.",
    application: "Aplicar em toda a face e pescoço com movimentos ascendentes. Esperar 1 minuto antes do hidratante se necessário.",
    tips: "Alternativa ao Blooming Skin Re-Lift. Usar nas noites sem ácidos para recuperação máxima.",
    avoids: "Evitar na mesma rotina que Effaclar Sérum ou Galénic Peeling.",
    priority: "complementar",
  },
  {
    id: 11,
    name: "Blooming Skin Re-Lift com Colagénio",
    brand: "Blooming Skin",
    emoji: "🌺",
    category: "Antienvelhecimento",
    url: "https://www.bloomingskin.pt",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80",
    function: "Nutrição intensa, firmeza, colagénio.",
    zones: ["rosto", "pescoço"],
    faceZones: ["forehead", "cheeks", "chin", "neck"],
    frequency: "Noites de recuperação — alternativa ao Liftactiv Collagen Specialist.",
    application: "Aplicar em toda a face e pescoço com movimentos ascendentes e circulares. Esperar 1 minuto.",
    tips: "Boa opção quando a pele precisa de nutrição extra. Rotação com Liftactiv Collagen Specialist.",
    avoids: "Evitar na mesma rotina que Effaclar Sérum ou Galénic Peeling.",
    priority: "complementar",
  },
  {
    id: 12,
    name: "Normaderm Bruma Matificante",
    brand: "Vichy",
    emoji: "🌫️",
    category: "Controlo de Oleosidade",
    url: "https://www.vichy.pt/normaderm",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80",
    function: "Controlo de oleosidade, acabamento matte.",
    zones: ["zona T", "queixo"],
    faceZones: ["nose", "chin", "forehead"],
    frequency: "Antes da maquilhagem ou quando necessário ao longo do dia.",
    application: "Aplicar exclusivamente na zona T (testa, nariz, queixo) e queixo. Evitar bochechas se estiverem sensibilizadas. Pulverizar e aguardar 30 segundos.",
    tips: "Não aplicar sobre bochechas secas ou irritadas. Ideal como passo de fixação antes da base.",
    avoids: "Pele irritada ou bochechas sensibilizadas.",
    priority: "complementar",
  },
  {
    id: 14,
    name: "Vinergetic C+ Moisturizer",
    brand: "Caudalie",
    emoji: "🍇",
    category: "Hidratação",
    url: "https://www.caudalie.com/pt/rosto/hidratantes/vinergetic-c-hidratante-energizante-3-em-1.html",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&q=80",
    function: "Hidratação, vitamina C (luminosidade e manchas), ácido hialurónico, antioxidante. Substitui o Hydrabio nas rotinas sem ácidos esfoliantes.",
    zones: ["rosto", "pescoço"],
    faceZones: ["forehead", "cheeks", "nose", "chin", "neck"],
    frequency: "Manhã (substitui Hydrabio) · Noite de recuperação (substitui Hydrabio) · Noite de pontos negros se pele não sensibilizada.",
    application: "Aplicar em toda a face e pescoço após séruns. Esperar 1 a 2 minutos antes do SPF50 de manhã. Não usar sobre pele irritada ou após peeling — nessas noites manter o Hydrabio.",
    tips: "Vitamina C de manhã sob SPF50 é uma das combinações mais eficazes para manchas e fotoenvelhecimento. Não usar na noite de peeling nem na noite de tratamento com Effaclar Sérum — a combinação com ácidos pode irritar.",
    avoids: "Não usar na noite de peeling (Galénic). Não recomendado na noite de tratamento com Effaclar Sérum em pele sensível. Não usar em pele irritada — substituir pelo Hydrabio.",
    priority: "muito_util",
  },
  {
    id: 13,
    name: "Facial Moisturising Lotion AM SPF50",
    brand: "CeraVe",
    emoji: "☀️",
    category: "Proteção Solar",
    url: "https://www.cerave.pt/a-nossa-gama/protecao-solar/cerave-facial-moisturising-lotion-spf50",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&q=80",
    function: "Proteção UV, prevenção de manchas e fotoenvelhecimento.",
    zones: ["rosto", "pescoço", "orelhas"],
    faceZones: ["forehead", "cheeks", "nose", "chin", "neck"],
    frequency: "Todas as manhãs — último passo da rotina.",
    application: "Aplicar generosamente em toda a face, pescoço e orelhas. Esperar 2 a 5 minutos antes da maquilhagem. Reaplicar a cada 2h em exposição solar.",
    tips: "O produto mais importante de toda a rotina para manchas e prevenção do envelhecimento. Não escatimar quantidade.",
    avoids: "Não aplicar antes de séruns ou hidratantes — é sempre o último passo da manhã.",
    priority: "essencial",
  },
];

const weekSchedule = [
  { day: "Seg", routine: "Tratamento", products: ["Effaclar Sérum"], color: "#7C6AF7" },
  { day: "Ter", routine: "Tratamento", products: ["Effaclar Sérum"], color: "#7C6AF7" },
  { day: "Qua", routine: "Peeling", products: ["Galénic Peeling"], color: "#E0856A" },
  { day: "Qui", routine: "Recuperação", products: ["Collagen / Re-Lift"], color: "#68B89A" },
  { day: "Sex", routine: "Tratamento", products: ["Effaclar Sérum"], color: "#7C6AF7" },
  { day: "Sáb", routine: "Tratamento", products: ["Effaclar Sérum"], color: "#7C6AF7" },
  { day: "Dom", routine: "Pontos Negros", products: ["Effaclar Lotion"], color: "#C0826B" },
];

const priorities = {
  essencial: { label: "Essencial", color: "#7C6AF7", bg: "#F0EEFF" },
  muito_util: { label: "Muito Útil", color: "#68B89A", bg: "#EAF7F2" },
  complementar: { label: "Complementar", color: "#C0826B", bg: "#FDF2EE" },
};

const faceZoneLabels = {
  forehead: "Testa",
  cheeks: "Bochechas",
  nose: "Nariz",
  chin: "Queixo",
  eyes: "Cont. olhos",
  neck: "Pescoço",
  spot: "Lesão ativa",
};

function FaceDiagram({ activeZones }: { activeZones: string[] }) {
  const zoneColors = {
    forehead: activeZones.includes("forehead") ? "#7C6AF7" : "#E8E4F0",
    cheeks: activeZones.includes("cheeks") ? "#7C6AF7" : "#E8E4F0",
    nose: activeZones.includes("nose") ? "#7C6AF7" : "#E8E4F0",
    chin: activeZones.includes("chin") ? "#7C6AF7" : "#E8E4F0",
    eyes: activeZones.includes("eyes") ? "#E8836A" : "#E8E4F0",
    neck: activeZones.includes("neck") ? "#7C6AF7" : "#E8E4F0",
    spot: activeZones.includes("spot") ? "#E05050" : "#E8E4F0",
  };

  return (
    <svg viewBox="0 0 120 160" width="110" height="146" style={{ display: "block" }}>
      <rect x="44" y="125" width="32" height="28" rx="6" fill={zoneColors.neck} stroke="#ccc" strokeWidth="0.5" />
      <ellipse cx="60" cy="78" rx="42" ry="52" fill="#F9F4F0" stroke="#D8C8BC" strokeWidth="1" />
      <ellipse cx="60" cy="44" rx="30" ry="16" fill={zoneColors.forehead} opacity="0.7" />
      <ellipse cx="28" cy="82" rx="14" ry="18" fill={zoneColors.cheeks} opacity="0.7" />
      <ellipse cx="92" cy="82" rx="14" ry="18" fill={zoneColors.cheeks} opacity="0.7" />
      <ellipse cx="60" cy="83" rx="10" ry="13" fill={zoneColors.nose} opacity="0.75" />
      <ellipse cx="60" cy="112" rx="18" ry="10" fill={zoneColors.chin} opacity="0.7" />
      <ellipse cx="44" cy="66" rx="11" ry="6" fill={zoneColors.eyes} opacity="0.75" />
      <ellipse cx="76" cy="66" rx="11" ry="6" fill={zoneColors.eyes} opacity="0.75" />
      <ellipse cx="44" cy="66" rx="6" ry="3.5" fill="#5A4A6A" opacity="0.4" />
      <ellipse cx="76" cy="66" rx="6" ry="3.5" fill="#5A4A6A" opacity="0.4" />
      {activeZones.includes("spot") && (
        <circle cx="52" cy="74" r="5" fill={zoneColors.spot} opacity="0.9" />
      )}
      <line x1="60" y1="70" x2="60" y2="88" stroke="#C0A090" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<null | typeof products[0]>(null);
  const [activeTab, setActiveTab] = useState("rotinas");
  const [filterCategory, setFilterCategory] = useState("todos");
  const [routineSubTab, setRoutineSubTab] = useState("noite");

  const categories = ["todos", ...new Set(products.map(p => p.category))];

  const filtered = filterCategory === "todos"
    ? products
    : products.filter(p => p.category === filterCategory);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FAF8FF 0%, #FDF6F2 100%)",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      color: "#2D2140",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #7C6AF7 0%, #A896FF 50%, #E0856A 100%)",
        padding: "2.5rem 2rem 2rem",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -20, left: 40, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.85, marginBottom: "0.5rem" }}>Canva de Skincare Personalizado</div>
          <h1 style={{ margin: 0, fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.02em" }}>A Tua Rotina</h1>
          <p style={{ margin: "0.5rem 0 0", opacity: 0.85, fontSize: "0.95rem" }}>34 anos · Pele Normal · Tendência para Acne · 13 produtos</p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.2rem", flexWrap: "wrap" }}>
            {["Cicatrizes Atróficas", "Poros Dilatados", "Manchas Solares", "Pontos Negros"].map(tag => (
              <span key={tag} style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: "999px",
                padding: "0.25rem 0.75rem",
                fontSize: "0.78rem",
                fontWeight: 500,
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", borderBottom: "1px solid #EDE9FF", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", gap: 0 }}>
          {[
            { id: "rotinas", label: "Rotinas" },
            { id: "produtos", label: "Produtos" },
            { id: "calendario", label: "Calendário" },
            { id: "objetivos", label: "Objetivos" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "1rem 1.25rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "0.88rem",
                fontWeight: activeTab === tab.id ? 700 : 400,
                color: activeTab === tab.id ? "#7C6AF7" : "#888",
                borderBottom: activeTab === tab.id ? "2px solid #7C6AF7" : "2px solid transparent",
                transition: "all 0.15s",
              }}
            >{tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>

        {/* PRODUTOS TAB */}
        {activeTab === "produtos" && (
          <div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  style={{
                    padding: "0.35rem 0.9rem",
                    borderRadius: "999px",
                    border: filterCategory === cat ? "none" : "1px solid #DDD",
                    background: filterCategory === cat ? "#7C6AF7" : "white",
                    color: filterCategory === cat ? "white" : "#555",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: filterCategory === cat ? 600 : 400,
                  }}
                >{cat === "todos" ? "Todos" : cat}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
              {filtered.map(product => {
                const p = priorities[product.priority as keyof typeof priorities];
                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      border: "1px solid #EDE9FF",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "transform 0.15s, box-shadow 0.15s",
                      boxShadow: "0 2px 8px rgba(124,106,247,0.06)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(124,106,247,0.15)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(124,106,247,0.06)";
                    }}
                  >
                    <div style={{
                      height: 130,
                      background: `linear-gradient(135deg, ${p.bg} 0%, #FAF8FF 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                      position: "relative",
                    }}>
                      {product.emoji}
                      <span style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: p.color,
                        color: "white",
                        borderRadius: "999px",
                        padding: "0.2rem 0.6rem",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}>{p.label}</span>
                    </div>
                    <div style={{ padding: "1rem" }}>
                      <div style={{ fontSize: "0.7rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>{product.brand}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.3, marginBottom: "0.5rem" }}>{product.name}</div>
                      <div style={{
                        fontSize: "0.75rem",
                        color: "#7C6AF7",
                        background: "#F0EEFF",
                        borderRadius: "6px",
                        padding: "0.2rem 0.5rem",
                        display: "inline-block",
                        marginBottom: "0.6rem",
                      }}>{product.category}</div>
                      <p style={{ fontSize: "0.82rem", color: "#666", margin: 0, lineHeight: 1.5 }}>{product.function}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ROTINAS TAB */}
        {activeTab === "rotinas" && (
          <div>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {[
                { id: "noite", label: "🌙 Noite" },
                { id: "manha", label: "☀️ Manhã" },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setRoutineSubTab(sub.id)}
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "999px",
                    border: routineSubTab === sub.id ? "none" : "1px solid #DDD",
                    background: routineSubTab === sub.id ? "#2D2140" : "white",
                    color: routineSubTab === sub.id ? "white" : "#666",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: routineSubTab === sub.id ? 700 : 400,
                    transition: "all 0.15s",
                  }}
                >{sub.label}</button>
              ))}
            </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            {[
              {
                title: "☀️ Manhã",
                color: "#FFB347",
                bg: "#FFFBF0",
                steps: [
                  { num: 1, name: "Toleriane Dermo-Cleanser", note: "30–60 seg, movimentos circulares" },
                  { num: 2, name: "Liftactiv B3 Serum", note: "Aguardar 1 minuto" },
                  { num: 3, name: "Cicaplast B5 Spray", note: "Opcional — dias sensíveis ou após noite de ácidos · aguardar 30 seg" },
                  { num: 4, name: "Cien Q10", note: "Só no osso orbital · aguardar 30 seg" },
                  { num: 5, name: "Vinergetic C+ Moisturizer", note: "Vitamina C + SPF50 = combinação ideal · aguardar 2 min" },
                  { num: 6, name: "Facial Moisturising Lotion AM SPF50", note: "Generosamente · aguardar 5 min antes da maq." },
                ],
                timeOfDay: "manha",
              },
              {
                title: "🌙 Noite de Tratamento",
                color: "#7C6AF7",
                bg: "#F4F2FF",
                steps: [
                  { num: 1, name: "Toleriane Dermo-Cleanser", note: "Dupla limpeza se usou maquilhagem" },
                  { num: 2, name: "Effaclar Sérum Ultra Concentré", note: "Testa, nariz, queixo, bochechas · aguardar 2–3 min" },
                  { num: 3, name: "Cien Q10", note: "Só no osso orbital · aguardar 30 seg" },
                  { num: 4, name: "Hydrabio Gel-Crème", note: "Face toda e pescoço" },
                  { num: 5, name: "Effaclar A.I.", note: "Opcional — só sobre borbulha ativa" },
                ],
                note: "Rotina enxuta por design — o Effaclar Sérum já é muito ativo. Não acrescentar séruns adicionais.",
                timeOfDay: "noite",
              },
              {
                title: "🌿 Noite de Recuperação",
                color: "#68B89A",
                bg: "#EAF7F2",
                steps: [
                  { num: 1, name: "Toleriane Dermo-Cleanser", note: "" },
                  { num: 2, name: "Liftactiv B3 Serum", note: "Opcional — compatível · aguardar 1 min" },
                  { num: 3, name: "Cien Q10", note: "Só no osso orbital · aguardar 30 seg" },
                  { num: 4, name: "Liftactiv Collagen Specialist", note: "ou Blooming Skin Re-Lift · aguardar 1 min" },
                  { num: 5, name: "Vinergetic C+ Moisturizer", note: "Sem ácidos a competir, vitamina C trabalha bem aqui" },
                ],
                timeOfDay: "noite",
              },
              {
                title: "✨ Noite de Peeling",
                color: "#E0856A",
                bg: "#FDF2EE",
                steps: [
                  { num: 1, name: "Toleriane Dermo-Cleanser", note: "" },
                  { num: 2, name: "Pureté Sublime Peeling", note: "Testa, bochechas, nariz, queixo · evitar 1 cm à volta dos olhos, lábios, narinas e borbulhas abertas" },
                  { num: 3, name: "Cien Q10", note: "Pode aplicar — zona periorbital não conflitua" },
                  { num: 4, name: "Cicaplast B5 Spray", note: "Calmante pós-peeling · pulverizar · aguardar 30–60 seg" },
                  { num: 5, name: "Hydrabio Gel-Crème", note: "Manter Hydrabio — pele esfoliada não precisa de ativos extra" },
                  { num: 6, name: "Effaclar A.I.", note: "Opcional — só sobre borbulha ativa, após hidratante" },
                ],
                warning: "Não usar: Effaclar Sérum Ultra Concentré · Effaclar Lotion Astringente · Liftactiv B3 Serum",
                timeOfDay: "noite",
              },
              {
                title: "🫧 Noite de Pontos Negros",
                color: "#C0826B",
                bg: "#FDF4F2",
                steps: [
                  { num: 1, name: "Toleriane Dermo-Cleanser", note: "" },
                  { num: 2, name: "Effaclar Lotion Astringente", note: "Nariz, queixo, bochechas · evitar olhos e testa limpa · aguardar 2 min" },
                  { num: 3, name: "Liftactiv B3 Serum", note: "Opcional — compatível com a Lotion · face toda · aguardar 1 min" },
                  { num: 4, name: "Cien Q10", note: "Pode aplicar — zona periorbital não conflitua" },
                  { num: 5, name: "Cicaplast B5 Spray", note: "Opcional — se pele sensibilizada pelo ácido glicólico · aguardar 30–60 seg" },
                  { num: 6, name: "Vinergetic C+ Moisturizer", note: "Se pele não sensibilizada · ou substituir por Hydrabio se a Lotion irritou" },
                  { num: 7, name: "Effaclar A.I.", note: "Opcional — só sobre borbulha ativa, após hidratante" },
                ],
                warning: "Não usar: Effaclar Sérum Ultra Concentré · Pureté Sublime Peeling",
                timeOfDay: "noite",
              },
              {
                title: "💄 Pré-Maquilhagem",
                color: "#D4789A",
                bg: "#FDF0F5",
                steps: [
                  { num: 1, name: "Hydrabio Gel-Crème", note: "Aguardar 2 minutos" },
                  { num: 2, name: "Cicaplast B5 Spray", note: "Aguardar 1 minuto" },
                  { num: 3, name: "Cien Q10", note: "Só no osso orbital" },
                  { num: 4, name: "Normaderm Bruma Matificante", note: "Só zona T · aguardar 30 seg" },
                  { num: 5, name: "Effaclar A.I.", note: "Só sobre borbulha · aguardar 2 min" },
                  { num: 6, name: "Maquilhagem", note: "" },
                ],
                note: "Não acrescentar mais passos — cada camada extra aumenta o risco de pilling e má adesão da base.",
                timeOfDay: "manha",
              },
              {
                title: "🔴 Pele Irritada — Manhã",
                color: "#E05050",
                bg: "#FFF0F0",
                steps: [
                  { num: 1, name: "Toleriane Dermo-Cleanser", note: "" },
                  { num: 2, name: "Cien Q10", note: "Só osso orbital" },
                  { num: 3, name: "Cicaplast B5 Spray", note: "Opcional — se muito inflamada · aguardar 30 seg" },
                  { num: 4, name: "Hydrabio Gel-Crème", note: "" },
                  { num: 5, name: "Facial Moisturising Lotion AM SPF50", note: "Obrigatório" },
                ],
                warning: "Suspender: Effaclar Sérum Ultra Concentré · Effaclar Lotion Astringente · Pureté Sublime Peeling · Liftactiv B3 Serum · Vinergetic C+ Moisturizer",
                timeOfDay: "manha",
              },
              {
                title: "🔴 Pele Irritada — Noite",
                color: "#E05050",
                bg: "#FFF0F0",
                steps: [
                  { num: 1, name: "Toleriane Dermo-Cleanser", note: "" },
                  { num: 2, name: "Cien Q10", note: "Só osso orbital" },
                  { num: 3, name: "Cicaplast B5 Spray", note: "Reparação da barreira · aguardar 30–60 seg" },
                  { num: 4, name: "Hydrabio Gel-Crème", note: "" },
                ],
                warning: "Suspender: Effaclar Sérum Ultra Concentré · Effaclar Lotion Astringente · Pureté Sublime Peeling · Liftactiv B3 Serum · Vinergetic C+ Moisturizer",
                timeOfDay: "noite",
              },
              {
                title: "🌋 Surto de Acne — Manhã",
                color: "#C05050",
                bg: "#FFF4F4",
                steps: [
                  { num: 1, name: "Toleriane Dermo-Cleanser", note: "" },
                  { num: 2, name: "Hydrabio Gel-Crème", note: "Usar Hydrabio, não Vinergetic — pele instável" },
                  { num: 3, name: "Cicaplast B5 Spray", note: "Opcional — se inflamação visível · aguardar 30 seg" },
                  { num: 4, name: "Facial Moisturising Lotion AM SPF50", note: "Obrigatório" },
                ],
                warning: "Suspender: Effaclar Lotion Astringente · Pureté Sublime Peeling · Vinergetic C+ Moisturizer",
                timeOfDay: "manha",
              },
              {
                title: "🌋 Surto de Acne — Noite",
                color: "#C05050",
                bg: "#FFF4F4",
                steps: [
                  { num: 1, name: "Toleriane Dermo-Cleanser", note: "" },
                  { num: 2, name: "Effaclar Sérum Ultra Concentré", note: "Aguardar 2–3 min" },
                  { num: 3, name: "Cien Q10", note: "Só osso orbital" },
                  { num: 4, name: "Cicaplast B5 Spray", note: "Opcional — se pele irritada com o surto · aguardar 30 seg" },
                  { num: 5, name: "Effaclar A.I.", note: "Sobre cada lesão ativa" },
                  { num: 6, name: "Hydrabio Gel-Crème", note: "Usar Hydrabio, não Vinergetic" },
                ],
                warning: "Suspender: Effaclar Lotion Astringente · Pureté Sublime Peeling · Vinergetic C+ Moisturizer",
                timeOfDay: "noite",
              },
            ].filter(r => !r.timeOfDay || r.timeOfDay === routineSubTab).map((routine, idx) => (
              <div key={idx} style={{
                background: routine.bg,
                borderRadius: "16px",
                border: `1px solid ${routine.color}30`,
                padding: "1.25rem",
              }}>
                <h3 style={{ margin: "0 0 1rem", fontSize: "1.05rem", color: routine.color }}>{routine.title}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {routine.steps.map(step => (
                    <div key={step.num} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <span style={{
                        minWidth: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: routine.color,
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "0.1rem",
                        flexShrink: 0,
                      }}>{step.num}</span>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                          {(() => {
                            const found = products.find(p =>
                              p.name === step.name ||
                              step.name.includes(p.name) ||
                              p.name.includes(step.name)
                            );
                            return found ? (
                              <span
                                onClick={() => setSelectedProduct(found)}
                                style={{ color: routine.color, cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted" }}
                              >{step.name}</span>
                            ) : step.name;
                          })()}
                        </span>
                        {step.note && <span style={{ fontSize: "0.78rem", color: "#888", marginLeft: "0.5rem" }}>— {step.note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                {routine.warning && (
                  <div style={{
                    marginTop: "0.75rem",
                    padding: "0.5rem 0.75rem",
                    background: "#FFE8E8",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    color: "#C04040",
                    fontWeight: 500,
                  }}>⚠️ {routine.warning}</div>
                )}
                {routine.note && (
                  <div style={{
                    marginTop: "0.75rem",
                    padding: "0.5rem 0.75rem",
                    background: "rgba(0,0,0,0.04)",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    color: "#666",
                    fontStyle: "italic",
                  }}>ℹ️ {routine.note}</div>
                )}
              </div>
            ))}
          </div>
          </div>
        )}

        {/* CALENDÁRIO TAB */}
        {activeTab === "calendario" && (
          <div>
            <p style={{ color: "#888", fontSize: "0.88rem", marginBottom: "1.5rem" }}>Rotina noturna por dia da semana. A rotina da manhã é sempre a mesma.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem" }}>
              {weekSchedule.map((day, idx) => (
                <div key={idx} style={{
                  background: "white",
                  borderRadius: "12px",
                  border: `2px solid ${day.color}40`,
                  padding: "0.75rem 0.5rem",
                  textAlign: "center",
                }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: day.color, marginBottom: "0.4rem" }}>{day.day}</div>
                  <div style={{
                    fontSize: "0.65rem",
                    background: `${day.color}20`,
                    color: day.color,
                    borderRadius: "6px",
                    padding: "0.2rem 0.3rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                  }}>{day.routine}</div>
                  {day.products.map((p, i) => (
                    <div key={i} style={{ fontSize: "0.62rem", color: "#666", lineHeight: 1.4 }}>{p}</div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1.5rem", background: "white", borderRadius: "16px", padding: "1.25rem", border: "1px solid #EDE9FF" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1rem" }}>⏳ Expectativas Realistas</h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {[
                  { period: "2–3 meses", result: "Menos pontos negros · pele mais uniforme · menos acne", color: "#7C6AF7" },
                  { period: "3–6 meses", result: "Redução gradual das manchas · melhoria visual dos poros", color: "#68B89A" },
                  { period: "6–12 meses", result: "Melhor textura global · cicatrizes menos evidentes por melhoria da pele envolvente", color: "#E0856A" },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <span style={{
                      background: item.color,
                      color: "white",
                      borderRadius: "8px",
                      padding: "0.3rem 0.6rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}>{item.period}</span>
                    <span style={{ fontSize: "0.85rem", color: "#555", paddingTop: "0.3rem" }}>{item.result}</span>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: "1rem",
                padding: "0.75rem",
                background: "#FFF8EE",
                borderRadius: "10px",
                fontSize: "0.8rem",
                color: "#8A6A40",
                lineHeight: 1.6,
              }}>
                <strong>Nota:</strong> As cicatrizes deprimidas não são eliminadas com cosmética. Para correção relevante das depressões, são necessários procedimentos médicos como microagulhamento, radiofrequência, laser fracionado ou subcisão.
              </div>
            </div>
          </div>
        )}

        {/* OBJETIVOS TAB */}
        {activeTab === "objetivos" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            {[
              { obj: "Manchas Solares", priority: "Muito Alta", products: ["CeraVe AM SPF50", "Vichy Liftactiv B3 Serum"], color: "#E0856A" },
              { obj: "Marcas Pós-Acne", priority: "Muito Alta", products: ["CeraVe AM SPF50", "Vichy Liftactiv B3 Serum", "La Roche-Posay Effaclar Sérum Ultra Concentré"], color: "#7C6AF7" },
              { obj: "Pontos Negros", priority: "Muito Alta", products: ["La Roche-Posay Effaclar Sérum Ultra Concentré", "La Roche-Posay Effaclar Lotion Astringente"], color: "#5A8AD4" },
              { obj: "Poros Dilatados", priority: "Alta", products: ["La Roche-Posay Effaclar Sérum Ultra Concentré", "La Roche-Posay Effaclar Lotion Astringente", "Galénic Pureté Sublime Peeling"], color: "#68B89A" },
              { obj: "Acne Ocasional", priority: "Alta", products: ["La Roche-Posay Effaclar Sérum Ultra Concentré", "La Roche-Posay Effaclar A.I."], color: "#C0826B" },
              { obj: "Pele Irritada", priority: "Muito Alta", products: ["La Roche-Posay Cicaplast B5 Spray", "Bioderma Hydrabio Gel-Crème"], color: "#D4789A" },
              { obj: "Antienvelhecimento", priority: "Média", products: ["Vichy Liftactiv Collagen Specialist", "Blooming Skin Re-Lift com Colagénio"], color: "#A896FF" },
              { obj: "Contorno dos Olhos", priority: "Baixa", products: ["Cien Q10 Eye Cream"], color: "#888" },
            ].map((item, idx) => (
              <div key={idx} style={{
                background: "white",
                borderRadius: "14px",
                border: "1px solid #EDE9FF",
                padding: "1rem",
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
              }}>
                <div style={{ minWidth: 80 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem" }}>{item.obj}</div>
                  <span style={{
                    fontSize: "0.7rem",
                    background: `${item.color}20`,
                    color: item.color,
                    borderRadius: "999px",
                    padding: "0.15rem 0.5rem",
                    fontWeight: 600,
                  }}>{item.priority}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", paddingTop: "0.1rem" }}>
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
                          background: `${item.color}15`,
                          color: item.color,
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: found ? "pointer" : "default",
                          border: `1px solid ${item.color}30`,
                        }}
                      >{pName}</span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20,10,40,0.55)",
            zIndex: 100,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "24px 24px 0 0",
              width: "100%",
              maxWidth: 600,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "1.75rem",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 40, height: 4, background: "#DDD", borderRadius: 2, margin: "0 auto 1.5rem" }} />

            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div style={{
                width: 70,
                height: 70,
                borderRadius: "16px",
                background: `${priorities[selectedProduct.priority as keyof typeof priorities].bg}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                flexShrink: 0,
              }}>
                {selectedProduct.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.7rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>{selectedProduct.brand}</div>
                <h2 style={{ margin: "0.15rem 0 0.4rem", fontSize: "1.1rem", fontWeight: 800 }}>{selectedProduct.name}</h2>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  <span style={{
                    background: priorities[selectedProduct.priority as keyof typeof priorities].bg,
                    color: priorities[selectedProduct.priority as keyof typeof priorities].color,
                    borderRadius: "999px",
                    padding: "0.2rem 0.6rem",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}>{priorities[selectedProduct.priority as keyof typeof priorities].label}</span>
                  <span style={{
                    background: "#F0EEFF",
                    color: "#7C6AF7",
                    borderRadius: "999px",
                    padding: "0.2rem 0.6rem",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                  }}>{selectedProduct.category}</span>
                </div>
              </div>
            </div>

            <div style={{
              background: "#FAF8FF",
              borderRadius: "16px",
              padding: "1rem",
              marginBottom: "1.25rem",
              display: "flex",
              gap: "1.25rem",
              alignItems: "center",
            }}>
              <FaceDiagram activeZones={selectedProduct.faceZones} />
              <div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7C6AF7", marginBottom: "0.5rem" }}>Zonas de Aplicação</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {Object.entries(faceZoneLabels).map(([key, label]) => {
                    const active = selectedProduct.faceZones.includes(key);
                    return (
                      <span key={key} style={{
                        padding: "0.2rem 0.55rem",
                        borderRadius: "6px",
                        fontSize: "0.72rem",
                        fontWeight: active ? 700 : 400,
                        background: active ? (key === "eyes" ? "#FFE8E0" : "#EDE9FF") : "#F5F5F5",
                        color: active ? (key === "eyes" ? "#E8836A" : "#7C6AF7") : "#BBB",
                      }}>{label}</span>
                    );
                  })}
                </div>
              </div>
            </div>

            {[
              { label: "Função", value: selectedProduct.function },
              { label: "Frequência", value: selectedProduct.frequency },
              { label: "Como Aplicar", value: selectedProduct.application },
              { label: "Dica", value: selectedProduct.tips },
              { label: "Incompatibilidades", value: selectedProduct.avoids },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#AAA", marginBottom: "0.3rem" }}>{item.label}</div>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#333", lineHeight: 1.6 }}>{item.value}</p>
              </div>
            ))}

            <a
              href={selectedProduct.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                background: "linear-gradient(135deg, #7C6AF7, #A896FF)",
                color: "white",
                padding: "0.85rem",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                marginTop: "1rem",
              }}
            >Ver Produto →</a>

            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                display: "block",
                width: "100%",
                marginTop: "0.75rem",
                background: "none",
                border: "1px solid #EEE",
                borderRadius: "12px",
                padding: "0.75rem",
                fontSize: "0.85rem",
                color: "#888",
                cursor: "pointer",
              }}
            >Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
