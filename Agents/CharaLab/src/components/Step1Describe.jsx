import { useState } from "react";

const EXAMPLES = [
  "A mysterious ancient vampire who gives life advice from centuries of experience. They're charming, witty, and slightly morbid.",
  "A street-smart AI assistant living in a cyberpunk city. Knows how to navigate the underground economy.",
  "A flirtatious barista at a cozy café who remembers every customer's order and personal secrets.",
];

export default function Step1Describe({ onSubmit, loading, isDark }) {
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    if (desc.trim().length >= 20) onSubmit(desc.trim());
  };

  const tooShort = desc.trim().length > 0 && desc.trim().length < 20;
  const ready = desc.trim().length >= 20;

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: 16,
          fontWeight: 500,
        }}>
          <span style={{ width: 20, height: 1, background: "var(--accent)", display: "inline-block" }} />
          Step 1 of 4
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "var(--text)",
          marginBottom: 12,
        }}>
          Describe your<br />AI character
        </h1>
        <p style={{
          fontSize: 14,
          color: "var(--text-muted)",
          lineHeight: 1.7,
          maxWidth: 520,
        }}>
          Paste the persona or system prompt for your character. We'll generate safety probe questions and evaluate how it responds to edge cases.
        </p>
      </div>

      <div style={{ position: "relative", marginBottom: 12 }}>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="e.g. A sarcastic therapist who gives unconventional advice and isn't afraid to push boundaries..."
          rows={7}
          style={{
            width: "100%",
            background: "var(--surface)",
            border: `1px solid ${ready ? "var(--accent)" : "var(--border-strong)"}`,
            borderRadius: "var(--radius-lg)",
            padding: "18px 20px",
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
            resize: "vertical",
            outline: "none",
            transition: "border-color 0.2s ease",
          }}
        />
        <div style={{
          position: "absolute",
          bottom: 14,
          right: 16,
          fontSize: 11,
          color: tooShort ? "var(--danger)" : "var(--text-dim)",
          fontFamily: "var(--font-mono)",
        }}>
          {desc.trim().length} / 20 min
        </div>
      </div>

      {tooShort && (
        <p style={{ fontSize: 12, color: "var(--danger)", marginBottom: 12 }}>
          Add a few more words to describe the character
        </p>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 40 }}>
        <button
          onClick={handleSubmit}
          disabled={!ready || loading}
          style={{
            background: ready && !loading ? "var(--accent)" : "var(--surface-3)",
            color: ready && !loading ? "#fff" : "var(--text-dim)",
            border: "none",
            borderRadius: "var(--radius-md)",
            padding: "13px 28px",
            fontSize: 14,
            fontFamily: "var(--font-mono)",
            cursor: ready && !loading ? "pointer" : "not-allowed",
            fontWeight: 500,
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <Spinner />
              Generating questions...
            </>
          ) : (
            <>Generate safety questions →</>
          )}
        </button>

        {loading && (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            This takes ~5 seconds
          </span>
        )}
      </div>

      <div>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-dim)", marginBottom: 14 }}>
          Try an example
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setDesc(ex)}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 13,
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                lineHeight: 1.5,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => {
                e.target.style.borderColor = "var(--border-strong)";
                e.target.style.color = "var(--text)";
              }}
              onMouseLeave={e => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.color = "var(--text-muted)";
              }}
            >
              "{ex.length > 90 ? ex.slice(0, 90) + "..." : ex}"
            </button>
          ))}
        </div>
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
