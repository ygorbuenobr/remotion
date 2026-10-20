import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

export type RulerMarker = { label: string; value: number; highlight?: boolean };

// Régua de ancoragem: marcadores proporcionais ao valor, com o primeiro número
// servindo de referência para julgar os demais.
export const Ruler: React.FC<{ markers: RulerMarker[]; max: number }> = ({ markers, max }) => {
  const frame = useCurrentFrame();
  const x0 = theme.marginX;
  const width = theme.width - theme.marginX * 2;
  const y = 700;
  const progress = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x0,
          top: y,
          width: width * progress,
          height: 1,
          background: theme.line,
        }}
      />
      {markers.map((m) => {
        const x = x0 + (m.value / max) * width;
        const color = m.highlight ? theme.accent : theme.text;
        return (
          <div key={m.label} style={{ position: "absolute", left: x, top: y - 90, transform: "translateX(-50%)", textAlign: "center", opacity: progress }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 18, color: theme.textMuted }}>{m.label}</div>
            <div style={{ width: 1, height: 60, background: color, margin: "6px auto 0" }} />
            <div style={{ width: 8, height: 8, borderRadius: 8, background: color, margin: "-4px auto 0" }} />
          </div>
        );
      })}
    </>
  );
};
