import { useState } from "react";
import { theme } from "../theme";
import { inputAreaContainer, inputAreaTextarea } from "../styles/inputArea";
import CodeArtifact from "./CodeArtifact";
import CopyBlock from "./CopyBlock";
import { sendMessage } from "../api/chat";
import { MODELS } from "../models";

const LYRICS_INSTRUCTION =
  "Write song lyrics based on the following request. " +
  "Return ONLY the lyrics — no explanations, no title headers in brackets, " +
  "no commentary. Request: ";

const CODE_INSTRUCTION =
  "You are a code generator. Output ONE complete, self-contained HTML document " +
  "with inline <style> and <script> (HTML + CSS + JS in a single file). " +
  "Return ONLY the raw code — no explanation, no markdown fences. " +
  "IMPORTANT: if you already produced code earlier in this conversation, " +
  "MODIFY that existing code to satisfy the new request — keep everything else intact. " +
  "Do NOT rebuild from scratch unless the request explicitly asks for it. " +
  "Default to a black or near-black page background unless the request specifies otherwise. Request: ";

const scrollbarStyle = `
  .artifacts-scroll::-webkit-scrollbar { width: 6px; }
  .artifacts-scroll::-webkit-scrollbar-track { background: transparent; }
  .artifacts-scroll::-webkit-scrollbar-thumb {
    background: ${theme.textFaint}55;
    border-radius: 99px;
    transition: background 0.2s;
  }
  .artifacts-scroll::-webkit-scrollbar-thumb:hover {
    background: ${theme.textFaint}99;
  }
`;

function extractCode(text) {
  if (!text) return "";
  const fence = text.match(/```(?:html|js|javascript)?\s*([\s\S]*?)```/i);
  if (fence) return fence[1].trim();
  const tagIdx = text.search(/<!doctype|<html|<body|<div|<section/i);
  if (tagIdx >= 0) return text.slice(tagIdx).trim();
  return text.trim();
}

export default function Artifacts() {
  const [mode, setMode] = useState("code"); // "code" | "lyrics"
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null); // { type, code|text }
  const [error, setError] = useState("");
  // Each mode maintains its own session so neither bleeds into the other
  // or into the Chat Bot's module-level sessionId.
  const [artifactsSessionId, setArtifactsSessionId] = useState(null);
  const [lyricsSessionId, setLyricsSessionId] = useState(null);
  const [selectedModel, setSelectedModel] = useState("gemini");

  const C = {
    red: "#bb0e0e",
    muted: "#8a8a90",
    border: "rgba(255,255,255,0.08)",
    panel: "#141417",
    bg: "#0d0d10",
  };

  const switchMode = (next) => {
    setMode(next);
    setOutput(null);
    setError("");
    setArtifactsSessionId(null);
    setLyricsSessionId(null);
  };

  const handleGenerate = async () => {
    const p = prompt.trim();
    if (!p || loading) return;
    setLoading(true);
    setError("");
    setOutput(null);
    try {
      if (mode === "code") {
        const { answer, sessionId: newSid } = await sendMessage(
          CODE_INSTRUCTION + p,
          "auto",
          { sessionId: artifactsSessionId, model: selectedModel }
        );
        setArtifactsSessionId(newSid);
        setOutput({ type: "code", code: extractCode(answer) });
      } else {
        const { answer, sessionId: newSid } = await sendMessage(
          LYRICS_INSTRUCTION + p,
          "auto",
          { sessionId: lyricsSessionId, model: selectedModel }
        );
        setLyricsSessionId(newSid);
        setOutput({ type: "lyrics", text: answer });
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const tab = (active) => ({
    padding: "6px 14px",
    fontSize: 13,
    borderRadius: 8,
    cursor: "pointer",
    border: "none",
    fontWeight: active ? 700 : 500,
    background: active ? theme.accentDeep : "transparent",
    color: active ? "#0a0a0b" : theme.textDim,
  });

  return (
    // Fills the area below the top zone, as its own flex column
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 1,
        fontFamily: theme.inter,
        color: theme.text,
      }}
    >
      {/* MIDDLE — fills remaining height (top zone & input are fixed) */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            maxWidth: 700,
            width: "100%",
            margin: "0 auto",
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {error && (
            <p style={{ color: C.red, fontSize: 14, marginBottom: 14 }}>
              {error}
            </p>
          )}
          {output?.type === "code" && (
            <CodeArtifact initialCode={output.code} />
          )}
          {output?.type === "lyrics" && (
            <div
              className="artifacts-scroll"
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: `${theme.textFaint}55 transparent`,
              }}
            >
              <style>{scrollbarStyle}</style>
              <CopyBlock content={output.text} label="Lyrics" />
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM — fixed input: toggle (left) + generate (right) */}
      <div
        style={{
          flexShrink: 0,
          padding: "12px 20px 16px",
          borderTop: `1px solid ${C.border}`,
          background: theme.bg,
        }}
      >
        <div style={inputAreaContainer}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              mode === "code"
                ? "Describe the UI — e.g. a glowing pricing card with a hover effect"
                : "Genre / mood — e.g. hindi romantic, anchor: a fading evening"
            }
            style={inputAreaTextarea}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 6,
                background: theme.bgSoft,
                border: `1px solid ${theme.line}`,
                borderRadius: 10,
                padding: 4,
              }}
            >
              <button
                type="button"
                style={tab(mode === "code")}
                onClick={() => switchMode("code")}
              >
                Code
              </button>
              <button
                type="button"
                style={tab(mode === "lyrics")}
                onClick={() => switchMode("lyrics")}
              >
                Lyrics
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select
                aria-label="Model"
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  setArtifactsSessionId(null);
                }}
                title="Select model"
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: `1.5px solid ${theme.line}`,
                  background: theme.bgSoft,
                  color: theme.text,
                  fontFamily: theme.sora,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                style={{
                  padding: "13px 30px",
                  background: loading ? "#5a3a2a" : "#c70505",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: 15,
                  fontWeight: 700,
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
              >
                {loading
                  ? "Generating…"
                  : mode === "code"
                    ? "Generate code →"
                    : "Write lyrics →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
