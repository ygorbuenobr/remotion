import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import type { Header } from "../types";

export const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: theme.bg, color: theme.text, fontFamily: theme.fontSans, overflow: "hidden" }}>
    {children}
  </AbsoluteFill>
);

// Glifo do Instagram (contorno), usado no rodapé e no fechamento.
export const InstaGlyph: React.FC<{ size: number; color?: string }> = ({ size, color = theme.text }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.4" />
    <circle cx="17.6" cy="6.4" r="0.9" fill={color} stroke="none" />
  </svg>
);

// Cabeçalho (rótulos de seção) e rodapé (glifo + handle), presentes na referência.
export const Chrome: React.FC<{ header: Header; handle: string }> = ({ header, handle }) => (
  <>
    <div
      style={{
        position: "absolute",
        top: 56,
        left: theme.marginX,
        right: theme.marginX,
        display: "flex",
        justifyContent: "space-between",
        fontFamily: theme.fontMono,
        fontSize: 16,
        letterSpacing: 2,
        color: theme.textMuted,
        textTransform: "uppercase",
      }}
    >
      <span>{header.left}</span>
      <span>{header.right ?? ""}</span>
    </div>
    <div style={{ position: "absolute", left: theme.marginX, bottom: 92, display: "flex", flexDirection: "column", gap: 8 }}>
      <InstaGlyph size={26} />
      <span style={{ fontFamily: theme.fontMono, fontSize: 14, fontWeight: 700, color: theme.text }}>{handle.toUpperCase()}</span>
    </div>
  </>
);
