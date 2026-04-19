import { useState, useCallback } from "react";
import Step1Describe from "./components/Step1Describe";
import Step2Questions from "./components/Step2Questions";
import Step3Paste from "./components/Step3Paste";
import Step4Report from "./components/Step4Report";
import ThemeToggle from "./components/ThemeToggle";

const BACKEND_URL = "https://charactergaurd-1.onrender.com";

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [report, setReport] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState("");

  const generateQuestions = useCallback(async (desc) => {
    setLoadingQuestions(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/generate-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to generate questions");
      }
      const data = await res.json();
      setQuestions(data.questions);
      setDescription(desc);
      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  const runEvaluation = useCallback(async (convos) => {
    setLoadingReport(true);
    setError("");
    try {
      const csvRows = ["question,answer", ...convos.map(c =>
        `"${c.question.replace(/"/g, '""')}","${c.answer.replace(/"/g, '""')}"`
      )].join("\n");

      const blob = new Blob([csvRows], { type: "text/csv" });
      const formData = new FormData();
      formData.append("description", description);
      formData.append("conversations", blob, "conversations.csv");

      const res = await fetch(`${BACKEND_URL}/run/production`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Evaluation failed");
      }
      const data = await res.json();
      setReport(data);
      setConversations(convos);
      setStep(4);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingReport(false);
    }
  }, [description]);

  const reset = () => {
    setStep(1);
    setDescription("");
    setQuestions([]);
    setConversations([]);
    setReport(null);
    setError("");
  };

  const isDark = theme === "dark";

  return (
    <div className={`app ${isDark ? "dark" : "light"}`}>
      <div className="bg-layer" />

      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">𖨆</span>
            <span className="logo-text">CharaLab</span>
          </div>
          <div className="header-right">
            <StepIndicator current={step} />
            <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === "dark" ? "light" : "dark")} />
          </div>
        </div>
      </header>

      <main className="main">
        {error && (
          <div className="error-banner">
            <span className="error-icon">!</span>
            <span>{error}</span>
            <button className="error-close" onClick={() => setError("")}>×</button>
          </div>
        )}

        <div className="carousel">
          {step === 1 && (
            <Step1Describe
              onSubmit={generateQuestions}
              loading={loadingQuestions}
              isDark={isDark}
            />
          )}
          {step === 2 && (
            <Step2Questions
              questions={questions}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
              isDark={isDark}
            />
          )}
          {step === 3 && (
            <Step3Paste
              questions={questions}
              onSubmit={runEvaluation}
              onBack={() => setStep(2)}
              loading={loadingReport}
              isDark={isDark}
            />
          )}
          {step === 4 && (
            <Step4Report
              report={report}
              onReset={reset}
              isDark={isDark}
            />
          )}
        </div>
      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;500;600;700&display=swap');

        :root {
          --font-display: 'Syne', sans-serif;
          --font-mono: 'DM Mono', monospace;
          --radius-sm: 6px;
          --radius-md: 10px;
          --radius-lg: 16px;
          --radius-xl: 24px;
          --transition: 0.2s ease;
        }

        .dark {
          --bg: #0c0c0e;
          --bg-layer: #111115;
          --surface: #16161a;
          --surface-2: #1e1e24;
          --surface-3: #26262e;
          --border: rgba(255,255,255,0.07);
          --border-strong: rgba(255,255,255,0.14);
          --text: #f0f0f4;
          --text-muted: rgba(240,240,244,0.45);
          --text-dim: rgba(240,240,244,0.25);
          --accent: #7b6cf0;
          --accent-glow: rgba(123,108,240,0.2);
          --accent-2: #4ecdc4;
          --danger: #ff6b6b;
          --danger-bg: rgba(255,107,107,0.1);
          --warn: #ffa94d;
          --warn-bg: rgba(255,169,77,0.1);
          --success: #69db7c;
          --success-bg: rgba(105,219,124,0.1);
        }

        .light {
          --bg: #f7f7f9;
          --bg-layer: #ffffff;
          --surface: #ffffff;
          --surface-2: #f0f0f4;
          --surface-3: #e8e8ee;
          --border: rgba(0,0,0,0.07);
          --border-strong: rgba(0,0,0,0.14);
          --text: #111118;
          --text-muted: rgba(17,17,24,0.5);
          --text-dim: rgba(17,17,24,0.3);
          --accent: #5b4fd4;
          --accent-glow: rgba(91,79,212,0.12);
          --success-bg: rgba(52, 168, 83, 0.08);
          --accent-2: #2bada5;
          --danger: #d94040;
          --danger-bg: rgba(217,64,64,0.08);
          --warn: #e07b00;
          --warn-bg: rgba(224,123,0,0.08);
          --success: #2e8540;
          --success-bg: rgba(46,133,64,0.08);
        }

        .app {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-mono);
          transition: background var(--transition), color var(--transition);
          position: relative;
        }

        .bg-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .dark .bg-layer {
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(123,108,240,0.08) 0%, transparent 70%);
        }
        .light .bg-layer {
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(91,79,212,0.04) 0%, transparent 70%);
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid var(--border);
          background: var(--bg);
          backdrop-filter: blur(12px);
        }

        .header-inner {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 24px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 17px;
          letter-spacing: -0.02em;
          color: var(--text);
        }

        .logo-icon {
          font-size: 20px;
          color: var(--accent);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .main {
          max-width: 900px;
          margin: 0 auto;
          padding: 48px 24px 80px;
          position: relative;
          z-index: 1;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--danger-bg);
          border: 1px solid var(--danger);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          margin-bottom: 24px;
          font-size: 13px;
          color: var(--danger);
        }

        .error-icon {
          font-weight: 700;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1.5px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 11px;
        }

        .error-close {
          margin-left: auto;
          background: none;
          border: none;
          color: var(--danger);
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          padding: 2px 4px;
        }

        .carousel {
          animation: fadeUp 0.35s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function StepIndicator({ current }) {
  const steps = [
    { n: 1, label: "Describe" },
    { n: 2, label: "Questions" },
    { n: 3, label: "Paste" },
    { n: 4, label: "Report" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: current >= s.n ? "var(--accent)" : "var(--surface-3)",
            border: `1px solid ${current >= s.n ? "var(--accent)" : "var(--border-strong)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 500,
            color: current >= s.n ? "#fff" : "var(--text-dim)",
            transition: "all 0.3s ease",
          }}>
            {current > s.n ? "✓" : s.n}
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 20, height: 1,
              background: current > s.n ? "var(--accent)" : "var(--border-strong)",
              transition: "background 0.3s ease",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}
