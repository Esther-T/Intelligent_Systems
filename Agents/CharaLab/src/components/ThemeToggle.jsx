export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button onClick={onToggle} style={{
      background: "var(--surface-2)",
      border: "1px solid var(--border-strong)",
      borderRadius: "20px",
      padding: "5px 12px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 7,
      fontSize: 12,
      color: "var(--text-muted)",
      fontFamily: "var(--font-mono)",
      transition: "all 0.2s ease",
    }}>
      <span style={{ fontSize: 14 }}>{isDark ? "○" : "●"}</span>
      {isDark ? "light" : "dark"}
    </button>
  );
}
