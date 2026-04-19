import { useState } from "react";

const SEVERITY_COLORS = {
  major: { bg: "var(--danger-bg)", text: "var(--danger)", dot: "var(--danger)" },
  minor: { bg: "var(--warn-bg)", text: "var(--warn)", dot: "var(--warn)" },
};

const PLATFORM_LINKS = [
  { name: "Character.AI", url: "https://character.ai" },
  { name: "Janitor AI", url: "https://janitorai.com" },
  { name: "Chai AI", url: "https://chai.ml" },
];

export default function Step2Questions({ questions, onNext, onBack, isDark }) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const copy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  const copyAll = () => {
    const allText = questions.map((q, i) => `${i + 1}. ${q.question}`).join("\n\n");
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1800);
  };

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--accent)", marginBottom: 16, fontWeight: 500,
        }}>
          <span style={{ width: 20, height: 1, background: "var(--accent)", display: "inline-block" }} />
          Step 2 of 4
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15,
          color: "var(--text)", marginBottom: 12,
        }}>
          Your safety probe<br />questions are ready
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 520 }}>
          Test these questions on your character externally, then paste the conversations back in the next step. Each question targets a different vulnerability.
        </p>
      </div>

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "16px 20px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div style={{ display: "flex", gap: 10 }}>
          {PLATFORM_LINKS.map(p => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 12,
                color: "var(--accent)",
                textDecoration: "none",
                border: "1px solid var(--accent)",
                borderRadius: "var(--radius-sm)",
                padding: "5px 10px",
                opacity: 0.8,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.target.style.opacity = 1}
              onMouseLeave={e => e.target.style.opacity = 0.8}
            >
              {p.name} ↗
            </a>
          ))}
        </div>
        <button
          onClick={copyAll}
          style={{
            background: "none", border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)", padding: "6px 14px",
            fontSize: 12, color: "var(--text-muted)", cursor: "pointer",
            fontFamily: "var(--font-mono)", transition: "all 0.15s",
          }}
        >
          {copiedAll ? "✓ copied all" : "copy all questions"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        {questions.map((q, i) => {
          const sev = SEVERITY_COLORS[q.severity] || SEVERITY_COLORS.minor;
          const isCopied = copiedIdx === i;
          return (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 500,
                      background: sev.bg, color: sev.text,
                      borderRadius: "20px", padding: "3px 10px",
                      letterSpacing: "0.05em",
                    }}>
                      {q.severity?.toUpperCase()}
                    </span>
                    <span style={{
                      fontSize: 11, color: "var(--text-dim)",
                      letterSpacing: "0.04em",
                    }}>
                      {q.category}
                    </span>
                  </div>
                  <button
                    onClick={() => copy(q.question, i)}
                    style={{
                      background: "none", border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)", padding: "4px 10px",
                      fontSize: 11, color: isCopied ? "var(--success)" : "var(--text-dim)",
                      cursor: "pointer", fontFamily: "var(--font-mono)",
                      flexShrink: 0, transition: "color 0.15s",
                    }}
                  >
                    {isCopied ? "✓ copied" : "copy"}
                  </button>
                </div>
                <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, margin: 0 }}>
                  {q.question}
                </p>
              </div>
              <div style={{
                padding: "10px 20px",
                borderTop: "1px solid var(--border)",
                background: "var(--surface-2)",
              }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                  <span style={{ color: "var(--text-dim)" }}>why: </span>
                  {q.rationale}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
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
          onClick={onNext}
          style={{
            background: "var(--accent)", border: "none",
            borderRadius: "var(--radius-md)", padding: "12px 28px",
            fontSize: 14, color: "#fff", cursor: "pointer",
            fontFamily: "var(--font-mono)", fontWeight: 500,
          }}
        >
          I've tested my character →
        </button>
      </div>
    </div>
  );
}
