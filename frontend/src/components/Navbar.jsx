import { theme } from "../theme";

const styles = {
  navbar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "14vh",
    textAlign: "center",
  },
  logo: {
    fontFamily: theme.sora,
    fontWeight: 800,
    fontSize: "54px",
    letterSpacing: "-0.03em",
    lineHeight: 1,
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "2px",
    userSelect: "none",
  },
  a: { color: theme.primary },
  b: { color: theme.accent },
  m: { color: theme.text },
  tagline: {
    fontFamily: theme.mono,
    fontSize: "12px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: theme.textFaint,
    marginBottom: "38px",
  },
  taglineBold: {
    color: theme.primary,
    fontWeight: 500,
  },
  newChatBtn: {
    fontFamily: theme.sora,
    fontWeight: 600,
    fontSize: "14px",
    padding: "12px 20px",
    border: `1.5px solid ${theme.line}`,
    borderRadius: "12px",
    background: theme.bgSoft,
    color: theme.textDim,
    cursor: "pointer",
    marginBottom: "16px",
    transition: "border-color 0.2s, color 0.2s",
  },
};

export default function Navbar({ onNewChat }) {
  return (
    <div style={styles.navbar}>
      {/* Logo: ABM + hexagon AI chip */}
      <div style={styles.logo}>
        <span style={styles.a}>A</span>
        <span style={styles.b}>B</span>
        <span style={styles.m}>M</span>
        <span style={{ width: "12px" }}></span>

        {/* Hexagon AI SVG */}
        <svg
          width="62"
          height="62"
          viewBox="0 0 58 58"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: "-6px" }}
        >
          <polygon
            points="29,7 50,18.5 50,39.5 29,51 8,39.5 8,18.5"
            fill="none"
            stroke={theme.accent}
            strokeWidth="2.5"
          />
          <text
            x="29"
            y="36.5"
            fontFamily="Sora, sans-serif"
            fontWeight="700"
            fontSize="22"
            fill={theme.accent}
            textAnchor="middle"
          >
            AI
          </text>
          <g stroke={theme.primary} strokeWidth="2" strokeLinecap="round">
            <line x1="8" y1="25" x2="1" y2="25" />
            <line x1="8" y1="33" x2="1" y2="33" />
            <line x1="50" y1="25" x2="57" y2="25" />
            <line x1="50" y1="33" x2="57" y2="33" />
          </g>
        </svg>
      </div>

      {/* Tagline */}
      <div style={styles.tagline}>
        · Accelerating with{" "}
        <b style={styles.taglineBold}>Artificial Intelligence</b> ·
      </div>

      {/* New Chat */}
      <button style={styles.newChatBtn} onClick={onNewChat}>
        + New Chat
      </button>
    </div>
  );
}
