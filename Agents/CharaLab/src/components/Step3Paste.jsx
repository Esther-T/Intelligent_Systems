import { useState } from "react";

function parseConversation(raw) {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
  const pairs = [];
  let currentQ = null;
  let collectingA = false;
  let answerLines = [];

  const isUserLine = (l) => /^(you|user|me|human|i said|i:|you:)[\s:>]/i.test(l) || l.startsWith("> ");
  const isCharLine = (l) => /^(ai|bot|character|assistant|char|they|them|it|response|[a-z]+:)/i.test(l) && !isUserLine(l);

  const stripPrefix = (line) => {
    return line.replace(/^(you|user|me|human|ai|bot|character|assistant|char|they|them|it|response|[a-z]+)[\s:>]+/i, "").trim();
  };

  for (const line of lines) {
    if (isUserLine(line)) {
      if (currentQ && answerLines.length > 0) {
        pairs.push({ question: currentQ, answer: answerLines.join(" ") });
        answerLines = [];
      }
      currentQ = stripPrefix(line) || line;
      collectingA = false;
    } else if (isCharLine(line) && currentQ) {
      if (collectingA) {
        answerLines.push(stripPrefix(line) || line);
      } else {
        collectingA = true;
        answerLines = [stripPrefix(line) || line];
      }
    } else if (collectingA) {
      answerLines.push(line);
    }
  }

  if (currentQ && answerLines.length > 0) {
    pairs.push({ question: currentQ, answer: answerLines.join(" ") });
  }

  return pairs;
}

export default function Step3Paste({ questions, onSubmit, onBack, loading, isDark }) {
  const [slots, setSlots] = useState(questions.map(q => ({ question: q.question, answer: "", raw: "", parsed: false })));
  const [activeSlot, setActiveSlot] = useState(0);
  const [pasteMode, setPasteMode] = useState("manual");

  const updateSlot = (idx, field, value) => {
    setSlots(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handlePaste = (idx, raw) => {
    updateSlot(idx, "raw", raw);
    const pairs = parseConversation(raw);
    if (pairs.length > 0) {
      setSlots(prev => prev.map((s, i) => i === idx ? {
        ...s,
        raw,
        question: pairs[0].question || s.question,
        answer: pairs[0].answer,
        parsed: true,
      } : s));
    } else {
      updateSlot(idx, "raw", raw);
    }
  };

  const completedCount = slots.filter(s => s.answer.trim().length > 0).length;
  const canSubmit = completedCount > 0;

  const handleSubmit = () => {
    const convos = slots
      .filter(s => s.answer.trim().length > 0)
      .map(s => ({ question: s.question, answer: s.answer }));
    onSubmit(convos);
  };

  const currentSlot = slots[activeSlot];

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--accent)", marginBottom: 16, fontWeight: 500,
        }}>
          <span style={{ width: 20, height: 1, background: "var(--accent)", display: "inline-block" }} />
          Step 3 of 4
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15,
          color: "var(--text)", marginBottom: 12,
        }}>
          Paste the conversations
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 520 }}>
          For each question, paste the full conversation from your AI platform.
          We'll auto-detect the format and extract the response.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["paste", "manual"].map(mode => (
          <button
            key={mode}
            onClick={() => setPasteMode(mode)}
            style={{
              background: pasteMode === mode ? "var(--accent)" : "var(--surface)",
              color: pasteMode === mode ? "#fff" : "var(--text-muted)",
              border: `1px solid ${pasteMode === mode ? "var(--accent)" : "var(--border-strong)"}`,
              borderRadius: "var(--radius-sm)",
              padding: "6px 16px",
              fontSize: 12, cursor: "pointer",
              fontFamily: "var(--font-mono)",
              transition: "all 0.15s",
            }}
          >
            {mode === "paste" ? "auto-parse paste" : "manual entry"}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 48 }}>
          {slots.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSlot(i)}
              style={{
                width: 36, height: 36,
                borderRadius: "var(--radius-sm)",
                background: activeSlot === i ? "var(--accent)" : "var(--surface)",
                border: `1px solid ${activeSlot === i ? "var(--accent)" : s.answer ? "var(--success)" : "var(--border)"}`,
                color: activeSlot === i ? "#fff" : s.answer ? "var(--success)" : "var(--text-dim)",
                fontSize: 12, cursor: "pointer",
                fontFamily: "var(--font-mono)",
                transition: "all 0.15s",
              }}
            >
              {s.answer ? "✓" : i + 1}
            </button>
          ))}
        </div>

        <div style={{
          flex: 1,
          background: "var(--surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface-2)",
          }}>
            <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>
              Question {activeSlot + 1} of {slots.length}
            </p>
            <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
              {currentSlot.question}
            </p>
          </div>

          <div style={{ padding: "16px 18px" }}>
            {pasteMode === "paste" ? (
              <>
                <label style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                  Paste the full chat log
                </label>
                <textarea
                  value={currentSlot.raw}
                  onChange={e => handlePaste(activeSlot, e.target.value)}
                  placeholder={"You: Can you help me...\nCharacter: Of course! Here's what I suggest...\n\n(any format works — we'll extract the response)"}
                  rows={7}
                  style={{
                    width: "100%", background: "var(--surface-2)",
                    border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
                    padding: "12px 14px", fontSize: 13, lineHeight: 1.6,
                    color: "var(--text)", fontFamily: "var(--font-mono)",
                    resize: "vertical", outline: "none",
                  }}
                />
                {currentSlot.parsed && currentSlot.answer && (
                  <div style={{
                    marginTop: 12, padding: "12px 14px",
                    background: "var(--success-bg)",
                    border: "1px solid var(--success)",
                    borderRadius: "var(--radius-md)",
                  }}>
                    <p style={{ fontSize: 11, color: "var(--success)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      ✓ response extracted
                    </p>
                    <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
                      {currentSlot.answer.length > 200 ? currentSlot.answer.slice(0, 200) + "..." : currentSlot.answer}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <label style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                  Character's response
                </label>
                <textarea
                  value={currentSlot.answer}
                  onChange={e => updateSlot(activeSlot, "answer", e.target.value)}
                  placeholder="Paste or type the character's response here..."
                  rows={6}
                  style={{
                    width: "100%", background: "var(--surface-2)",
                    border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
                    padding: "12px 14px", fontSize: 13, lineHeight: 1.6,
                    color: "var(--text)", fontFamily: "var(--font-mono)",
                    resize: "vertical", outline: "none",
                  }}
                />
              </>
            )}
          </div>

          <div style={{
            padding: "12px 18px",
            borderTop: "1px solid var(--border)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
              {completedCount}/{slots.length} questions answered
            </span>
            {activeSlot < slots.length - 1 && (
              <button
                onClick={() => setActiveSlot(i => i + 1)}
                disabled={!currentSlot.answer}
                style={{
                  background: "none",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius-sm)",
                  padding: "6px 14px", fontSize: 12,
                  color: currentSlot.answer ? "var(--text)" : "var(--text-dim)",
                  cursor: currentSlot.answer ? "pointer" : "not-allowed",
                  fontFamily: "var(--font-mono)",
                }}
              >
                next question →
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-md)", padding: "12px 22px",
            fontSize: 14, color: "var(--text-muted)", cursor: "pointer",
            fontFamily: "var(--font-mono)",
          }}
        >
          ← back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          style={{
            background: canSubmit && !loading ? "var(--accent)" : "var(--surface-3)",
            border: "none", borderRadius: "var(--radius-md)", padding: "12px 28px",
            fontSize: 14, color: canSubmit && !loading ? "#fff" : "var(--text-dim)",
            cursor: canSubmit && !loading ? "pointer" : "not-allowed",
            fontFamily: "var(--font-mono)", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          {loading ? (
            <>
              <Spinner />
              Running evaluation...
            </>
          ) : (
            `Run safety evaluation (${completedCount} conversation${completedCount !== 1 ? "s" : ""}) →`
          )}
        </button>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 14, height: 14,
      border: "2px solid rgba(255,255,255,0.3)",
      borderTop: "2px solid #fff",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
