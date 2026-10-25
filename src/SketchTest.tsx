import React from "react";
import { AbsoluteFill } from "remotion";
import { SketchShape } from "./components/Sketch";

// Cena de teste no estilo do vídeo de referência: fundo creme, traço escuro e destaque verde.
export const SketchTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#F4F1E6", fontFamily: "Inter, Helvetica, Arial, sans-serif" }}>
    <svg width={720} height={1280} style={{ position: "absolute", left: 0, top: 0 }}>
      <SketchShape shape={{ kind: "rect", x: 120, y: 420, w: 480, h: 180, fill: "#A3CC4A" }} stroke="#1B1B1B" seed={7} start={0} />
      <SketchShape shape={{ kind: "ellipse", x: 470, y: 180, w: 150, h: 150 }} stroke="#1B1B1B" seed={3} start={14} />
      <SketchShape shape={{ kind: "line", x1: 150, y1: 760, x2: 560, y2: 760 }} stroke="#1B1B1B" seed={5} start={28} drawFrames={20} />
    </svg>
    <div style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center", fontSize: 58, fontWeight: 800, color: "#111" }}>
      um negócio
    </div>
  </AbsoluteFill>
);
