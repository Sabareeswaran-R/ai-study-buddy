import { useState, useRef, useEffect, useCallback } from "react";

const API_KEY = "lAQ.Ab8RN6ILyZsJWIUWyhnago1vae0IJ4gp2IadkJE_RzRxVBIBlg";

const LANGUAGES = {
  en: { flag: "🇬🇧", name: "English", dir: "ltr", voice: "en-US",
    labels: { appName: "AI Study Buddy", explain: "Explain", quiz: "Quiz", flash: "Flashcard", mindmap: "Mind Map", eli5: "ELI5",
      send: "Send", copy: "Copy", listen: "Listen", placeholder: "Ask anything...", welcome: "Hello! I'm your AI Study Buddy 🎓",
      submit: "Submit Quiz", next: "Next", flip: "Flip", gotit: "✅ Got it", review: "🔁 Review", score: "Your Score",
      recent: "Recent Topics", suggest: "Try:", gotItCount: "Got it", reviewCount: "To review" } },
  ta: { flag: "🇮🇳", name: "தமிழ்", dir: "ltr", voice: "ta-IN",
    labels: { appName: "AI படிப்பு நண்பன்", explain: "விளக்கு", quiz: "வினாடி வினா", flash: "Flash Card", mindmap: "மனத்திட்டம்", eli5: "எளிதாக",
      send: "அனுப்பு", copy: "நகலெடு", listen: "கேள்", placeholder: "எதுவும் கேளுங்கள்...", welcome: "வணக்கம்! நான் உங்கள் AI படிப்பு நண்பன் 🎓",
      submit: "சமர்ப்பி", next: "அடுத்து", flip: "திருப்பு", gotit: "✅ புரிந்தது", review: "🔁 மீண்டும்", score: "உங்கள் மதிப்பெண்",
      recent: "சமீபத்திய தலைப்புகள்", suggest: "முயற்சிக்கவும்:", gotItCount: "புரிந்தது", reviewCount: "மீண்டும் பார்க்க" } },
  hi: { flag: "🇮🇳", name: "हिन्दी", dir: "ltr", voice: "hi-IN",
    labels: { appName: "AI स्टडी बडी", explain: "समझाएं", quiz: "क्विज़", flash: "फ्लैशकार्ड", mindmap: "माइंड मैप", eli5: "आसान भाषा",
      send: "भेजें", copy: "कॉपी", listen: "सुनें", placeholder: "कुछ भी पूछें...", welcome: "नमस्ते! मैं आपका AI स्टडी बडी हूँ 🎓",
      submit: "जमा करें", next: "अगला", flip: "पलटें", gotit: "✅ समझ गया", review: "🔁 दोबारा", score: "आपका स्कोर",
      recent: "हाल के विषय", suggest: "कोशिश करें:", gotItCount: "समझ गया", reviewCount: "दोबारा देखें" } },
  te: { flag: "🇮🇳", name: "తెలుగు", dir: "ltr", voice: "te-IN",
    labels: { appName: "AI చదువు మిత్రుడు", explain: "వివరించు", quiz: "క్విజ్", flash: "ఫ్లాష్‌కార్డ్", mindmap: "మైండ్ మ్యాప్", eli5: "సులభంగా",
      send: "పంపు", copy: "కాపీ", listen: "వినండి", placeholder: "ఏదైనా అడగండి...", welcome: "నమస్కారం! నేను మీ AI చదువు మిత్రుడు 🎓",
      submit: "సమర్పించు", next: "తదుపరి", flip: "తిప్పు", gotit: "✅ అర్థమైంది", review: "🔁 మళ్ళీ", score: "మీ స్కోర్",
      recent: "ఇటీవలి అంశాలు", suggest: "ప్రయత్నించండి:", gotItCount: "అర్థమైంది", reviewCount: "మళ్ళీ చదవండి" } },
  ml: { flag: "🇮🇳", name: "മലയാളം", dir: "ltr", voice: "ml-IN",
    labels: { appName: "AI പഠന സഹായി", explain: "വിശദീകരിക്കുക", quiz: "ക്വിസ്", flash: "ഫ്ലാഷ്കാർഡ്", mindmap: "മൈൻഡ് മാപ്", eli5: "ലളിതം",
      send: "അയക്കുക", copy: "പകർത്തുക", listen: "കേൾക്കുക", placeholder: "എന്തും ചോദിക്കൂ...", welcome: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI പഠന സഹായി ആണ് 🎓",
      submit: "സമർപ്പിക്കുക", next: "അടുത്തത്", flip: "മറിക്കുക", gotit: "✅ മനസ്സിലായി", review: "🔁 വീണ്ടും", score: "നിങ്ങളുടെ സ്കോർ",
      recent: "സമീപകാല വിഷയങ്ങൾ", suggest: "ശ്രമിക്കൂ:", gotItCount: "മനസ്സിലായി", reviewCount: "വീണ്ടും കാണുക" } },
  kn: { flag: "🇮🇳", name: "ಕನ್ನಡ", dir: "ltr", voice: "kn-IN",
    labels: { appName: "AI ಅಧ್ಯಯನ ಸ್ನೇಹಿತ", explain: "ವಿವರಿಸಿ", quiz: "ಕ್ವಿಜ್", flash: "ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್", mindmap: "ಮೈಂಡ್ ಮ್ಯಾಪ್", eli5: "ಸರಳವಾಗಿ",
      send: "ಕಳುಹಿಸಿ", copy: "ನಕಲಿಸಿ", listen: "ಕೇಳಿ", placeholder: "ಏನಾದರೂ ಕೇಳಿ...", welcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಅಧ್ಯಯನ ಸ್ನೇಹಿತ 🎓",
      submit: "ಸಲ್ಲಿಸಿ", next: "ಮುಂದಿನದು", flip: "ತಿರುಗಿಸಿ", gotit: "✅ ಅರ್ಥವಾಯಿತು", review: "🔁 ಮತ್ತೆ", score: "ನಿಮ್ಮ ಅಂಕ",
      recent: "ಇತ್ತೀಚಿನ ವಿಷಯಗಳು", suggest: "ಪ್ರಯತ್ನಿಸಿ:", gotItCount: "ಅರ್ಥವಾಯಿತು", reviewCount: "ಮತ್ತೆ ನೋಡಿ" } },
  fr: { flag: "🇫🇷", name: "Français", dir: "ltr", voice: "fr-FR",
    labels: { appName: "Compagnon IA", explain: "Expliquer", quiz: "Quiz", flash: "Flashcard", mindmap: "Carte Mentale", eli5: "Simple",
      send: "Envoyer", copy: "Copier", listen: "Écouter", placeholder: "Posez n'importe quelle question...", welcome: "Bonjour! Je suis votre compagnon d'étude IA 🎓",
      submit: "Soumettre", next: "Suivant", flip: "Retourner", gotit: "✅ Compris", review: "🔁 Revoir", score: "Votre Score",
      recent: "Sujets récents", suggest: "Essayez:", gotItCount: "Compris", reviewCount: "À revoir" } },
  de: { flag: "🇩🇪", name: "Deutsch", dir: "ltr", voice: "de-DE",
    labels: { appName: "KI-Lernpartner", explain: "Erklären", quiz: "Quiz", flash: "Lernkarte", mindmap: "Mindmap", eli5: "Einfach",
      send: "Senden", copy: "Kopieren", listen: "Anhören", placeholder: "Stell eine Frage...", welcome: "Hallo! Ich bin dein KI-Lernpartner 🎓",
      submit: "Abgeben", next: "Weiter", flip: "Umdrehen", gotit: "✅ Verstanden", review: "🔁 Wiederholen", score: "Dein Ergebnis",
      recent: "Letzte Themen", suggest: "Versuche:", gotItCount: "Verstanden", reviewCount: "Noch mal" } },
  es: { flag: "🇪🇸", name: "Español", dir: "ltr", voice: "es-ES",
    labels: { appName: "Compañero IA", explain: "Explicar", quiz: "Quiz", flash: "Flashcard", mindmap: "Mapa Mental", eli5: "Simple",
      send: "Enviar", copy: "Copiar", listen: "Escuchar", placeholder: "Haz una pregunta...", welcome: "¡Hola! Soy tu compañero de estudio IA 🎓",
      submit: "Enviar", next: "Siguiente", flip: "Voltear", gotit: "✅ Entendido", review: "🔁 Repasar", score: "Tu Puntuación",
      recent: "Temas recientes", suggest: "Intenta:", gotItCount: "Entendido", reviewCount: "Repasar" } },
  ja: { flag: "🇯🇵", name: "日本語", dir: "ltr", voice: "ja-JP",
    labels: { appName: "AI学習バディ", explain: "説明", quiz: "クイズ", flash: "フラッシュカード", mindmap: "マインドマップ", eli5: "簡単に",
      send: "送信", copy: "コピー", listen: "聴く", placeholder: "何でも聞いてください...", welcome: "こんにちは！私はあなたのAI学習バディです🎓",
      submit: "提出", next: "次へ", flip: "裏返す", gotit: "✅ わかった", review: "🔁 復習", score: "あなたのスコア",
      recent: "最近のトピック", suggest: "試してみて:", gotItCount: "わかった", reviewCount: "要復習" } },
  zh: { flag: "🇨🇳", name: "中文", dir: "ltr", voice: "zh-CN",
    labels: { appName: "AI学习伙伴", explain: "解释", quiz: "测验", flash: "闪卡", mindmap: "思维导图", eli5: "简单说",
      send: "发送", copy: "复制", listen: "听", placeholder: "随便问...", welcome: "你好！我是你的AI学习伙伴🎓",
      submit: "提交", next: "下一个", flip: "翻转", gotit: "✅ 明白了", review: "🔁 再看看", score: "你的分数",
      recent: "最近话题", suggest: "试试:", gotItCount: "明白了", reviewCount: "需复习" } },
  ar: { flag: "🇸🇦", name: "العربية", dir: "rtl", voice: "ar-SA",
    labels: { appName: "مساعد الدراسة", explain: "اشرح", quiz: "اختبار", flash: "بطاقة تعليمية", mindmap: "خريطة ذهنية", eli5: "بسهولة",
      send: "أرسل", copy: "نسخ", listen: "استمع", placeholder: "اسأل أي شيء...", welcome: "مرحبًا! أنا مساعد الدراسة بالذكاء الاصطناعي 🎓",
      submit: "أرسل الإجابات", next: "التالي", flip: "اقلب", gotit: "✅ فهمت", review: "🔁 مراجعة", score: "نتيجتك",
      recent: "المواضيع الأخيرة", suggest: "جرب:", gotItCount: "فهمت", reviewCount: "للمراجعة" } },
};

const SUGGESTIONS = {
  explain: ["Photosynthesis", "Newton's Laws", "World War II", "Pythagorean Theorem"],
  quiz: ["Solar System", "Human Body", "French Revolution", "Chemical Bonding"],
  flash: ["Periodic Table", "Algebra Formulas", "World Capitals", "Programming Concepts"],
  mindmap: ["Climate Change", "Machine Learning", "Democracy", "Cell Biology"],
  eli5: ["Quantum Physics", "Stock Market", "DNA", "Electricity"],
};

function buildPrompt(mode, lang, topic) {
  const langName = LANGUAGES[lang].name;
  const base = `You are an expert educational AI assistant. ALWAYS respond in ${langName} language only.`;
  if (mode === "explain") return `${base}\n\nExplain "${topic}" clearly with:\n- Simple introduction\n- Key concepts (start with "**Did you know:** " for a fascinating fact — wrap it)\n- Real-world examples\n- **Bottom line:** one sentence summary (mark it)\nUse clear paragraphs. Respond in ${langName}.`;
  if (mode === "eli5") return `${base}\n\nExplain "${topic}" like I'm 5 years old. Use fun analogies, simple words, and relatable examples a child would understand. Keep it engaging and short. Respond in ${langName}.`;
  if (mode === "quiz") return `${base}\n\nCreate a 5-question multiple choice quiz about "${topic}". MUST return valid JSON only, no extra text:\n{"questions":[{"q":"question text","options":["A) opt","B) opt","C) opt","D) opt"],"answer":"A"}]}\nMake questions educational and varied in difficulty. Answer must be "A", "B", "C" or "D".`;
  if (mode === "flash") return `${base}\n\nCreate 6 flashcards about "${topic}". Return valid JSON only:\n{"cards":[{"front":"Question or term","back":"Answer or definition"}]}\nMake cards educational, concise, and useful for memorization.`;
  if (mode === "mindmap") return `${base}\n\nCreate a mind map for "${topic}". Return valid JSON only:\n{"center":"${topic}","branches":[{"label":"Branch 1","children":["item1","item2","item3"]},{"label":"Branch 2","children":["item1","item2","item3"]},{"label":"Branch 3","children":["item1","item2","item3"]},{"label":"Branch 4","children":["item1","item2"]}]}\nRespond in ${langName} for all text.`;
  return base;
}

async function callClaude(mode, lang, topic) {
  const systemPrompt = buildPrompt(mode, lang, topic);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: topic }], system: systemPrompt })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content.map(b => b.text || "").join("");
}

function speak(text, voiceLang) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, "").slice(0, 500));
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang.startsWith(voiceLang.split("-")[0]));
  if (match) utt.voice = match;
  utt.lang = voiceLang;
  window.speechSynthesis.speak(utt);
}

function copyText(text) {
  navigator.clipboard?.writeText(text.replace(/<[^>]+>/g, ""));
}

function formatExplain(text) {
  return text
    .replace(/\*\*Did you know:?\*\*:? ?(.*?)(?=\n|$)/gi, '<span class="fact-glow">💡 Did you know: $1</span>')
    .replace(/\*\*Bottom line:?\*\*:? ?(.*?)(?=\n|$)/gi, '<span class="bottom-glow">🎯 Bottom line: $1</span>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

// ── Mind Map ──
function MindMap({ data }) {
  const colors = ["#6366f1","#ec4899","#10b981","#f59e0b","#ef4444","#8b5cf6"];
  return (
    <div className="mindmap-wrap">
      <div className="mm-center">{data.center}</div>
      <div className="mm-branches">
        {data.branches.map((b, i) => (
          <div key={i} className="mm-branch">
            <div className="mm-branch-label" style={{ background: colors[i % colors.length] }}>{b.label}</div>
            <div className="mm-children">
              {b.children.map((c, j) => (
                <div key={j} className="mm-child">{c}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Quiz ──
function QuizView({ data, lang }) {
  const L = LANGUAGES[lang].labels;
  const [sel, setSel] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? data.questions.filter((q, i) => sel[i] === q.answer).length : 0;
  const emoji = score === 5 ? "🏆" : score >= 3 ? "😊" : "📚";
  return (
    <div className="quiz-wrap">
      {data.questions.map((q, i) => (
        <div key={i} className="quiz-q">
          <div className="quiz-q-text">{i + 1}. {q.q}</div>
          <div className="quiz-opts">
            {q.options.map((opt, j) => {
              const letter = ["A","B","C","D"][j];
              let cls = "quiz-opt";
              if (submitted) {
                if (letter === q.answer) cls += " correct";
                else if (sel[i] === letter) cls += " wrong";
              } else if (sel[i] === letter) cls += " selected";
              return (
                <button key={j} className={cls} onClick={() => !submitted && setSel(s => ({ ...s, [i]: letter }))}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted ? (
        <button className="submit-btn" onClick={() => setSubmitted(true)}>{L.submit} ({Object.keys(sel).length}/5)</button>
      ) : (
        <div className="score-card">
          <div className="score-emoji">{emoji}</div>
          <div className="score-text">{L.score}: {score}/5</div>
          <div className="score-bar"><div style={{ width: `${score * 20}%`, background: score >= 4 ? "#10b981" : score >= 2 ? "#f59e0b" : "#ef4444", height: "100%", borderRadius: "999px", transition: "width 0.8s" }} /></div>
        </div>
      )}
    </div>
  );
}

// ── Flashcards ──
function FlashCards({ data, lang }) {
  const L = LANGUAGES[lang].labels;
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus] = useState({});
  const done = Object.keys(status).length;
  const gotIt = Object.values(status).filter(v => v === "got").length;
  const review = Object.values(status).filter(v => v === "review").length;
  const finished = done === data.cards.length;

  function mark(s) {
    setStatus(prev => ({ ...prev, [idx]: s }));
    setFlipped(false);
    if (idx < data.cards.length - 1) setIdx(idx + 1);
  }

  if (finished) {
    return (
      <div className="flash-done">
        <div style={{ fontSize: "2.5rem" }}>{gotIt === data.cards.length ? "🏆" : "📚"}</div>
        <div className="score-text">{L.gotItCount}: {gotIt} | {L.reviewCount}: {review}</div>
        <div className="score-bar"><div style={{ width: `${(gotIt / data.cards.length) * 100}%`, background: "#10b981", height: "100%", borderRadius: "999px" }} /></div>
        <button className="submit-btn" onClick={() => { setIdx(0); setFlipped(false); setStatus({}); }}>🔁 Restart</button>
      </div>
    );
  }

  return (
    <div className="flash-wrap">
      <div className="flash-progress-bar">
        <div style={{ width: `${(done / data.cards.length) * 100}%`, background: "#6366f1", height: "100%", borderRadius: "999px", transition: "width 0.4s" }} />
      </div>
      <div className="flash-counter">{idx + 1} / {data.cards.length}</div>
      <div className={`flash-card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
        <div className="flash-inner">
          <div className="flash-front"><span className="flash-label">Q</span>{data.cards[idx].front}</div>
          <div className="flash-back"><span className="flash-label">A</span>{data.cards[idx].back}</div>
        </div>
      </div>
      <div className="flash-hint">{L.flip} to reveal</div>
      {flipped && (
        <div className="flash-actions">
          <button className="flash-btn got" onClick={() => mark("got")}>{L.gotit}</button>
          <button className="flash-btn rev" onClick={() => mark("review")}>{L.review}</button>
        </div>
      )}
    </div>
  );
}

// ── Message Bubble ──
function Bubble({ msg, lang, voiceLang }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";
  if (isUser) return <div className="bubble user">{msg.content}</div>;

  const rawText = typeof msg.content === "string" ? msg.content : "";

  return (
    <div className="bubble ai">
      {msg.type === "explain" || msg.type === "eli5" ? (
        <div dangerouslySetInnerHTML={{ __html: formatExplain(rawText) }} />
      ) : msg.type === "quiz" ? (
        <QuizView data={msg.parsed} lang={lang} />
      ) : msg.type === "flash" ? (
        <FlashCards data={msg.parsed} lang={lang} />
      ) : msg.type === "mindmap" ? (
        <MindMap data={msg.parsed} />
      ) : (
        <div>{rawText}</div>
      )}
      {(msg.type === "explain" || msg.type === "eli5") && (
        <div className="bubble-actions">
          <button className="action-btn" onClick={() => { copyText(rawText); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
            {copied ? "✅" : "📋"} {LANGUAGES[lang].labels.copy}
          </button>
          <button className="action-btn" onClick={() => speak(rawText, voiceLang)}>
            🔊 {LANGUAGES[lang].labels.listen}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Language Picker ──
function LangPicker({ lang, setLang, open, setOpen }) {
  return (
    <div style={{ position: "relative" }}>
      <button className="lang-btn" onClick={() => setOpen(!open)}>{LANGUAGES[lang].flag} {LANGUAGES[lang].name} ▾</button>
      {open && (
        <div className="lang-dropdown">
          {Object.entries(LANGUAGES).map(([code, l]) => (
            <button key={code} className={`lang-opt ${code === lang ? "active" : ""}`}
              onClick={() => { setLang(code); setOpen(false); }}>
              {l.flag} {l.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main App ──
export default function App() {
  const [lang, setLang] = useState("en");
  const [mode, setMode] = useState("explain");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentTopics, setRecentTopics] = useState([]);
  const [langOpen, setLangOpen] = useState(false);
  const bottomRef = useRef(null);
  const L = LANGUAGES[lang].labels;
  const dir = LANGUAGES[lang].dir;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = useCallback(async (topic) => {
    const q = (topic || input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);
    if (!recentTopics.includes(q)) setRecentTopics(prev => [q, ...prev].slice(0, 6));
    try {
      const raw = await callClaude(mode, lang, q);
      let parsed = null;
      let content = raw;
      if (mode === "quiz" || mode === "flash" || mode === "mindmap") {
        try {
          const clean = raw.replace(/```json\n?|```/g, "").trim();
          parsed = JSON.parse(clean);
        } catch { content = raw; }
      }
      setMessages(prev => [...prev, { role: "ai", type: mode, content: raw, parsed }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", type: "explain", content: "❌ Error: " + e.message }]);
    }
    setLoading(false);
  }, [input, loading, mode, lang, recentTopics]);

  const modes = [
    { key: "explain", icon: "🗣️", label: L.explain },
    { key: "eli5", icon: "🧒", label: L.eli5 },
    { key: "quiz", icon: "❓", label: L.quiz },
    { key: "flash", icon: "🃏", label: L.flash },
    { key: "mindmap", icon: "🗺️", label: L.mindmap },
  ];

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)", fontFamily: "system-ui,sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .header { background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .app-title { font-size: 1.3rem; font-weight: 800; background: linear-gradient(90deg,#818cf8,#c084fc,#fb7185); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .lang-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; }
        .lang-dropdown { position: absolute; right: 0; top: 110%; background: #1e1b4b; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; width: 280px; z-index: 200; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
        .lang-opt { background: transparent; border: none; color: #cbd5e1; padding: 8px 10px; border-radius: 8px; cursor: pointer; text-align: left; font-size: 0.85rem; }
        .lang-opt:hover, .lang-opt.active { background: rgba(99,102,241,0.3); color: #fff; }
        .mode-bar { display: flex; gap: 8px; padding: 12px 16px; overflow-x: auto; background: rgba(0,0,0,0.2); scrollbar-width: none; }
        .mode-bar::-webkit-scrollbar { display: none; }
        .mode-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 8px 14px; border-radius: 999px; cursor: pointer; font-size: 0.82rem; white-space: nowrap; transition: all 0.2s; }
        .mode-btn.active { background: linear-gradient(135deg,#6366f1,#8b5cf6); border-color: transparent; color: #fff; font-weight: 700; box-shadow: 0 4px 15px rgba(99,102,241,0.4); }
        .suggest-strip { padding: 6px 16px; display: flex; gap: 8px; flex-wrap: wrap; }
        .suggest-label { color: #64748b; font-size: 0.78rem; align-self: center; }
        .suggest-chip { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #a5b4fc; padding: 4px 12px; border-radius: 999px; font-size: 0.78rem; cursor: pointer; }
        .suggest-chip:hover { background: rgba(99,102,241,0.3); }
        .recent-strip { padding: 4px 16px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .recent-label { color: #64748b; font-size: 0.75rem; }
        .recent-chip { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); color: #6ee7b7; padding: 3px 10px; border-radius: 999px; font-size: 0.75rem; cursor: pointer; }
        .chat-area { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .welcome { text-align: center; color: #64748b; padding: 40px 16px; }
        .welcome-icon { font-size: 3rem; margin-bottom: 12px; }
        .welcome-text { font-size: 1.1rem; color: #94a3b8; }
        .bubble { max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 0.92rem; line-height: 1.6; }
        .bubble.user { background: linear-gradient(135deg,#6366f1,#8b5cf6); color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
        .bubble.ai { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0; align-self: flex-start; border-bottom-left-radius: 4px; width: 100%; max-width: 100%; }
        .bubble-actions { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
        .action-btn { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #a5b4fc; padding: 4px 12px; border-radius: 8px; cursor: pointer; font-size: 0.78rem; }
        .action-btn:hover { background: rgba(99,102,241,0.3); }
        .fact-glow { display: block; background: rgba(16,185,129,0.1); border-left: 3px solid #10b981; padding: 8px 12px; border-radius: 8px; color: #6ee7b7; margin: 8px 0; }
        .bottom-glow { display: block; background: rgba(139,92,246,0.12); border-left: 3px solid #8b5cf6; padding: 8px 12px; border-radius: 8px; color: #c4b5fd; margin: 8px 0; }
        .input-area { padding: 12px 16px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.08); display: flex; gap: 10px; }
        .input-box { flex: 1; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.15); color: #e2e8f0; padding: 10px 14px; border-radius: 12px; font-size: 0.9rem; outline: none; }
        .input-box::placeholder { color: #475569; }
        .input-box:focus { border-color: #6366f1; }
        .send-btn { background: linear-gradient(135deg,#6366f1,#8b5cf6); border: none; color: #fff; padding: 10px 18px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 0.9rem; }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .loading-dot { display: inline-block; width: 8px; height: 8px; background: #6366f1; border-radius: 50%; animation: bounce 0.8s infinite; margin: 0 2px; }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        /* Quiz */
        .quiz-wrap { display: flex; flex-direction: column; gap: 16px; }
        .quiz-q { background: rgba(255,255,255,0.04); border-radius: 12px; padding: 14px; }
        .quiz-q-text { font-weight: 600; color: #e2e8f0; margin-bottom: 10px; font-size: 0.9rem; }
        .quiz-opts { display: flex; flex-direction: column; gap: 6px; }
        .quiz-opt { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; padding: 8px 12px; border-radius: 8px; cursor: pointer; text-align: left; font-size: 0.85rem; transition: all 0.15s; }
        .quiz-opt:hover { background: rgba(99,102,241,0.2); border-color: #6366f1; }
        .quiz-opt.selected { background: rgba(99,102,241,0.25); border-color: #6366f1; color: #fff; }
        .quiz-opt.correct { background: rgba(16,185,129,0.25); border-color: #10b981; color: #6ee7b7; }
        .quiz-opt.wrong { background: rgba(239,68,68,0.2); border-color: #ef4444; color: #fca5a5; }
        .submit-btn { background: linear-gradient(135deg,#6366f1,#8b5cf6); border: none; color: #fff; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 0.9rem; margin-top: 8px; }
        .score-card { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 20px; text-align: center; }
        .score-emoji { font-size: 2.5rem; margin-bottom: 8px; }
        .score-text { color: #e2e8f0; font-weight: 700; font-size: 1.1rem; margin-bottom: 10px; }
        .score-bar { background: rgba(255,255,255,0.1); border-radius: 999px; height: 8px; overflow: hidden; }
        /* Flashcards */
        .flash-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .flash-progress-bar { width: 100%; background: rgba(255,255,255,0.1); border-radius: 999px; height: 6px; overflow: hidden; }
        .flash-counter { color: #94a3b8; font-size: 0.82rem; }
        .flash-card { width: 100%; max-width: 420px; height: 160px; perspective: 800px; cursor: pointer; }
        .flash-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.5s; }
        .flash-card.flipped .flash-inner { transform: rotateY(180deg); }
        .flash-front, .flash-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center; font-size: 0.95rem; }
        .flash-front { background: linear-gradient(135deg,#1e1b4b,#312e81); border: 1px solid rgba(99,102,241,0.4); color: #e2e8f0; }
        .flash-back { background: linear-gradient(135deg,#064e3b,#065f46); border: 1px solid rgba(16,185,129,0.4); color: #d1fae5; transform: rotateY(180deg); }
        .flash-label { font-size: 0.75rem; font-weight: 700; opacity: 0.6; margin-bottom: 8px; letter-spacing: 2px; }
        .flash-hint { color: #475569; font-size: 0.78rem; }
        .flash-actions { display: flex; gap: 12px; }
        .flash-btn { padding: 10px 24px; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 0.88rem; }
        .flash-btn.got { background: linear-gradient(135deg,#059669,#10b981); color: #fff; }
        .flash-btn.rev { background: linear-gradient(135deg,#d97706,#f59e0b); color: #fff; }
        .flash-done { text-align: center; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        /* Mind Map */
        .mindmap-wrap { padding: 8px 0; }
        .mm-center { background: linear-gradient(135deg,#6366f1,#8b5cf6); color: #fff; border-radius: 50px; padding: 10px 24px; font-weight: 800; font-size: 1rem; display: inline-block; margin-bottom: 16px; }
        .mm-branches { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .mm-branch { background: rgba(255,255,255,0.04); border-radius: 12px; padding: 12px; border: 1px solid rgba(255,255,255,0.08); }
        .mm-branch-label { color: #fff; font-weight: 700; font-size: 0.88rem; padding: 4px 10px; border-radius: 999px; display: inline-block; margin-bottom: 8px; }
        .mm-child { color: #cbd5e1; font-size: 0.82rem; padding: 3px 0 3px 12px; border-left: 2px solid rgba(255,255,255,0.15); margin: 3px 0; }
      `}</style>

      {/* Header */}
      <div className="header">
        <div className="app-title">🎓 {L.appName}</div>
        <LangPicker lang={lang} setLang={setLang} open={langOpen} setOpen={setLangOpen} />
      </div>

      {/* Mode Tabs */}
      <div className="mode-bar">
        {modes.map(m => (
          <button key={m.key} className={`mode-btn ${mode === m.key ? "active" : ""}`} onClick={() => setMode(m.key)}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Suggestions */}
      <div className="suggest-strip">
        <span className="suggest-label">{L.suggest}</span>
        {SUGGESTIONS[mode]?.map(s => (
          <button key={s} className="suggest-chip" onClick={() => send(s)}>{s}</button>
        ))}
      </div>

      {/* Recent Topics */}
      {recentTopics.length > 0 && (
        <div className="recent-strip">
          <span className="recent-label">🕐 {L.recent}:</span>
          {recentTopics.map(t => (
            <button key={t} className="recent-chip" onClick={() => send(t)}>{t}</button>
          ))}
        </div>
      )}

      {/* Chat */}
      <div className="chat-area">
        {messages.length === 0 && (
          <div className="welcome">
            <div className="welcome-icon">🎓</div>
            <div className="welcome-text">{L.welcome}</div>
            <div style={{ color: "#475569", fontSize: "0.82rem", marginTop: 8 }}>Select a mode above and ask anything!</div>
          </div>
        )}
        {messages.map((m, i) => (
          <Bubble key={i} msg={m} lang={lang} voiceLang={LANGUAGES[lang].voice} />
        ))}
        {loading && (
          <div className="bubble ai" style={{ padding: "16px" }}>
            <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="input-area">
        <input
          className="input-box"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder={L.placeholder}
          dir={dir}
        />
        <button className="send-btn" onClick={() => send()} disabled={loading || !input.trim()}>
          {loading ? "..." : L.send}
        </button>
      </div>
    </div>
  );
}
