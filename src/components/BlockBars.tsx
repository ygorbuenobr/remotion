import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

export type BarItem = {
  label: string;
  sublabel?: string;
  value: number; // valor real, ex: 250000
  valueLabel: string; // texto exibido, ex: "US$ 250 mil"
  highlight?: boolean;
};

// Barras feitas de quadradinhos: cada bloco representa `unitValue` (ex: 10000).
// É o recurso que torna a diferença de preço visível sem precisar ler números.
export const BlockBars: React.FC<{
  items: BarItem[];
  unitValue: number;
  columns?: number;
}> = ({ items, unitValue, columns = 5 }) => {
  const frame = useCurrentFrame();
  const cell = 26;
  const gap = 6;
  const baseY = 760;
  const colWidth = (theme.width - theme.marginX * 2) / items.length;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: theme.marginX,
          right: theme.marginX,
          top: baseY + 40,
          height: 1,
          background: theme.line,
        }}
      />
      {items.map((item, i) => {
        const blocks = Math.max(1, Math.round(item.value / unitValue));
        const x = theme.marginX + i * colWidth;
        const appear = interpolate(frame, [i * 6, i * 6 + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const color = item.highlight ? theme.accent : theme.textMuted;
        return (
          <div key={item.label} style={{ position: "absolute", left: x, top: 0, width: colWidth - 16 }}>
            <div
              style={{
                position: "absolute",
                top: baseY - Math.ceil(blocks / columns) * (cell + gap) + 0,
                left: 0,
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, ${cell}px)`,
                gap,
                opacity: appear,
              }}
            >
              {Array.from({ length: blocks }).map((_, b) => (
                <div key={b} style={{ width: cell, height: cell, background: color }} />
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                top: baseY + 60,
                left: 0,
                fontFamily: theme.fontMono,
                fontSize: 20,
                color: theme.text,
                opacity: appear,
              }}
            >
              {item.valueLabel}
            </div>
            <div
              style={{
                position: "absolute",
                top: baseY + 92,
                left: 0,
                fontSize: 26,
                fontWeight: 700,
                color: item.highlight ? theme.accent : theme.text,
                opacity: appear,
              }}
            >
              {item.label}
            </div>
            {item.sublabel && (
              <div
                style={{
                  position: "absolute",
                  top: baseY + 126,
                  left: 0,
                  fontSize: 18,
                  color: theme.textMuted,
                  opacity: appear,
                }}
              >
                {item.sublabel}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
