import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

// Cabeçalho (rótulo da seção + data) e rodapé (logo + handle), presentes em quase todos os frames de referência.
export const Chrome: React.FC<{
  section: string;
  date: string;
  brand: string;
  handle: string;
}> = ({ section, date, brand, handle }) => {
  const small: React.CSSProperties = {
    fontFamily: theme.fontMono,
    fontSize: 16,
    letterSpacing: 2,
    color: theme.textMuted,
    textTransform: "uppercase",
  };
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 56,
          left: theme.marginX,
          right: theme.marginX,
          display: "flex",
          justifyContent: "space-between",
          ...small,
        }}
      >
        <span>{section}</span>
        <span>{date}</span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 56,
          left: theme.marginX,
          right: theme.marginX,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: theme.fontMono,
          fontSize: 18,
          color: theme.text,
        }}
      >
        <span style={{ fontWeight: 700, letterSpacing: 2 }}>{brand}</span>
        <span style={{ color: theme.textMuted }}>{handle}</span>
      </div>
    </>
  );
};

export const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: theme.bg, color: theme.text, fontFamily: theme.fontSans }}>
    {children}
  </AbsoluteFill>
);
