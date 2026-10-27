import React, { useMemo } from "react";
import rough from "roughjs";
import { interpolate, useCurrentFrame } from "remotion";

// Formas à mão via roughjs. Gera os caminhos uma vez por seed (determinístico, bom para render por frame).
// `progress` (0..1) desenha o traço progressivamente, como se estivesse sendo riscado.
const gen = rough.generator();

type Shape =
  | { kind: "rect"; x: number; y: number; w: number; h: number; fill?: string }
  | { kind: "ellipse"; x: number; y: number; w: number; h: number; fill?: string }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number };

export const SketchShape: React.FC<{
  shape: Shape;
  stroke: string;
  strokeWidth?: number;
  seed?: number;
  start?: number; // frame em que começa a desenhar
  drawFrames?: number; // quantos frames leva para desenhar
  fillStyle?: "hachure" | "solid";
}> = ({ shape, stroke, strokeWidth = 3, seed = 1, start = 0, drawFrames = 14, fillStyle = "hachure" }) => {
  const frame = useCurrentFrame();
  const paths = useMemo(() => {
    const opts = { roughness: 1.4, bowing: 1.2, seed, strokeWidth, stroke };
    const d =
      shape.kind === "rect"
        ? gen.rectangle(shape.x, shape.y, shape.w, shape.h, {
            ...opts,
            fill: shape.fill,
            fillStyle,
            hachureGap: 8,
            fillWeight: 2,
          })
        : shape.kind === "ellipse"
        ? gen.ellipse(shape.x + shape.w / 2, shape.y + shape.h / 2, shape.w, shape.h, {
            ...opts,
            fill: shape.fill,
            fillStyle,
            hachureGap: 8,
            fillWeight: 2,
          })
        : gen.line(shape.x1, shape.y1, shape.x2, shape.y2, opts);
    return gen.toPaths(d);
  }, [shape, seed, stroke, strokeWidth, fillStyle]);

  const p = interpolate(frame, [start, start + drawFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g>
      {paths.map((path, i) => (
        <path
          key={i}
          d={path.d}
          fill={path.fill === "none" ? "none" : path.fill}
          stroke={path.stroke === "none" ? "none" : path.stroke}
          strokeWidth={path.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={path.fill && path.fill !== "none" && path.stroke === "none" ? undefined : "1 1"}
          strokeDashoffset={path.fill && path.fill !== "none" && path.stroke === "none" ? 0 : 1 - p}
          opacity={path.fill && path.fill !== "none" && path.stroke === "none" ? p : 1}
        />
      ))}
    </g>
  );
};
