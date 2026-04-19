import { useState } from "react";

const SCORE_LABELS = {
  1: { label: "clean", color: "var(--success)", bg: "var(--success-bg)" },
  2: { label: "low risk", color: "var(--success)", bg: "var(--success-bg)" },
  3: { label: "moderate", color: "var(--warn)", bg: "var(--warn-bg)" },
  4: { label: "high risk", color: "var(--danger)", bg: "var(--danger-bg)" },
  5: { label: "critical", color: "var(--danger)", bg: "var(--danger-bg)" },
};

function getScoreInfo(score) {
  const rounded = Math.round(score);
  return SCORE_LABELS[Math.max(1, Math.min(5, rounded))] || SCORE_LABELS[3];
}

function ScoreGauge({ score, label }) {
  const pct = ((score - 1) / 4) * 100;
  const info = getScoreInfo(score);
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "18px 20px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </span>
        <span style={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--font-display)", color: info.color }}>
          {score.toFixed(1)}
        </span>
      </div>
      <div style={{ height: 4, background: "var(--surface-3)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: info.color,
          borderRadius: 2,
          transition: "width 0.8s ease",
        }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <span style={{
          fontSize: 11, background: info.bg, color: info.color,
          borderRadius: "20px", padding: "2px 10px",
        }}>
          {info.label}
        </span>
      </div>
    </div>
  );
}

function VerdictBadge({ verdict }) {
  const colors = {
    safe: { color: "var(--success)", bg: "var(--success-bg)" },
    unsafe: { color: "var(--danger)", bg: "var(--danger-bg)" },
    ambiguous: { color: "var(--warn)", bg: "var(--warn-bg)" },
  };
  const c = colors[verdict] || colors.ambiguous;
  return (
    <span style={{
      fontSize: 11, fontWeight: 500,
      background: c.bg, color: c.color,
      borderRadius: "20px", padding: "3px 10px",
      letterSpacing: "0.05em", textTransform: "uppercase",
    }}>
      {verdict}
    </span>
  );
}

export default function Step4Report({ report, onReset, isDark }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  if (!report) return null;

  const { aggregate_scores, row_results, remediation_tips, unsafe_count, total_rows, nsfw_count } = report;
  const overallInfo = getScoreInfo(aggregate_scores.overall);
  const safeCount = total_rows - unsafe_count;

  const TABS = ["overview", "conversations", "tips"];

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--accent)", marginBottom: 16, fontWeight: 500,
        }}>
          <span style={{ width: 20, height: 1, background: "var(--accent)", display: "inline-block" }} />
          Step 4 of 4 — Safety Report
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15,
              color: "var(--text)", marginBottom: 8,
            }}>
              {overallInfo.label === "clean" || overallInfo.label === "low risk"
                ? "Your character looks safe"
                : overallInfo.label === "moderate"
                ? "Some concerns found"
                : "Safety issues detected"}
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
              {safeCount}/{total_rows} responses passed ·{" "}
              {nsfw_count > 0 && `${nsfw_count} NSFW · `}
              Overall score: {aggregate_scores.overall.toFixed(1)}/5
            </p>
          </div>
          <button
            onClick={onReset}
            style={{
              background: "none", border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-md)", padding: "10px 18px",
              fontSize: 13, color: "var(--text-muted)", cursor: "pointer",
              fontFamily: "var(--font-mono)",
            }}
          >
            ↺ new evaluation
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              borderBottom: `2px solid ${activeTab === tab ? "var(--accent)" : "transparent"}`,
              padding: "8px 16px",
              fontSize: 13,
              color: activeTab === tab ? "var(--accent)" : "var(--text-muted)",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              transition: "color 0.15s",
              marginBottom: -1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
            <ScoreGauge score={aggregate_scores.overall} label="overall" />
            <ScoreGauge score={aggregate_scores.toxicity} label="toxicity" />
            <ScoreGauge score={aggregate_scores.severity} label="severity" />
            <ScoreGauge score={aggregate_scores.nsfw_likelihood} label="nsfw" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
            {[
              { label: "total tested", value: total_rows },
              { label: "passed", value: safeCount, color: "var(--success)" },
              { label: "flagged", value: unsafe_count, color: unsafe_count > 0 ? "var(--danger)" : "var(--text)" },
            ].map(s => (
              <div key={s.label} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)", padding: "18px 20px",
              }}>
                <p style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                  {s.label}
                </p>
                <p style={{ fontSize: 28, fontWeight: 600, fontFamily: "var(--font-display)", color: s.color || "var(--text)" }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {(() => {
            const cats = {};
            row_results.forEach(r => {
              (r.all_categories || []).forEach(c => {
                if (c && c !== "SAFE") cats[c] = (cats[c] || 0) + 1;
              });
            });
            const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]);
            if (!sorted.length) return null;
            return (
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)", padding: "18px 20px",
              }}>
                <p style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                  violation categories
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {sorted.map(([cat, count]) => (
                    <span key={cat} style={{
                      background: "var(--danger-bg)", color: "var(--danger)",
                      borderRadius: "20px", padding: "4px 12px", fontSize: 12,
                    }}>
                      {cat} ({count})
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === "conversations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {row_results.map((r, i) => {
            const isExpanded = expandedRow === i;
            const verdict = r.rule_flags?.length > 0 ? "unsafe" : r.llm_judge_verdict;
            return (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${verdict === "unsafe" ? "var(--danger)" : verdict === "ambiguous" ? "var(--warn)" : "var(--border)"}`,
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setExpandedRow(isExpanded ? null : i)}
                  style={{
                    width: "100%", background: "none", border: "none",
                    padding: "14px 18px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                    <VerdictBadge verdict={verdict || "safe"} />
                    <span style={{
                      fontSize: 13, color: "var(--text)", textAlign: "left",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {r.question}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    {r.judge_category && r.judge_category !== "SAFE" && (
                      <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                        {r.judge_category?.split(":")[0]}
                      </span>
                    )}
                    <span style={{ color: "var(--text-dim)", fontSize: 13 }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div style={{ borderTop: "1px solid var(--border)", padding: "16px 18px" }}>
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: 6 }}>
                        Question
                      </p>
                      <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{r.question}</p>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: 6 }}>
                        Response
                      </p>
                      <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{r.answer}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {r.scores && Object.entries(r.scores).map(([k, v]) => (
                        <span key={k} style={{
                          fontSize: 11, background: "var(--surface-2)",
                          border: "1px solid var(--border)", borderRadius: "20px",
                          padding: "3px 10px", color: "var(--text-muted)",
                        }}>
                          {k}: {typeof v === "number" ? v.toFixed(1) : v}
                        </span>
                      ))}
                      {r.severity && (
                        <span style={{
                          fontSize: 11, background: r.severity === "major" ? "var(--danger-bg)" : "var(--warn-bg)",
                          color: r.severity === "major" ? "var(--danger)" : "var(--warn)",
                          borderRadius: "20px", padding: "3px 10px",
                        }}>
                          {r.severity} severity
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "tips" && (
        <div>
          {remediation_tips?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {remediation_tips.map((tip, i) => (
                <div key={i} style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "18px 20px",
                  display: "flex",
                  gap: 14,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "var(--accent-glow)", border: "1px solid var(--accent)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, color: "var(--accent)", flexShrink: 0, fontWeight: 500,
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7, margin: 0 }}>
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: "var(--success-bg)", border: "1px solid var(--success)",
              borderRadius: "var(--radius-lg)", padding: "24px",
              textAlign: "center",
            }}>
              <p style={{ fontSize: 14, color: "var(--success)" }}>
                No major issues found. Your character appears safe to deploy.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
