import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { SketchShape } from "../components/Sketch";
import { E } from "./theme";
import type { EScene, ERoteiro } from "./types";

const fadeIn = (f: number, s = 0, l = 8) =>
  interpolate(f, [s, s + l], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Fundo creme com grade discreta e handle no topo (como no vídeo de referência).
const Backdrop: React.FC<{ handle: string }> = ({ handle }) => (
  <>
    <AbsoluteFill
      style={{
        background: E.bg,
        backgroundImage:
          "linear-gradient(rgba(20,20,20,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,20,0.045) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
    <div style={{ position: "absolute", top: 44, right: 40, fontFamily: E.mono, fontSize: 18, color: E.muted }}>
      {handle}
    </div>
  </>
);

// Legenda palavra por palavra. *palavra* ganha fundo verde.
const KaraokeCaption: React.FC<{ text: string; total: number }> = ({ text, total }) => {
  const f = useCurrentFrame();
  const words = text.split(/\s+/).filter(Boolean).map((w) => ({
    hl: w.startsWith("*") || w.endsWith("*"),
    t: w.replace(/\*/g, ""),
  }));
  const span = Math.max(total * 0.62, words.length);
  const step = span / words.length;
  return (
    <div
      style={{
        position: "absolute",
        left: 36,
        right: 36,
        bottom: 190,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px 8px",
        fontFamily: E.sans,
        fontWeight: 800,
        fontSize: 40,
        lineHeight: 1.1,
      }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            opacity: fadeIn(f, 4 + i * step, 5),
            background: w.hl ? E.green : E.white,
            color: E.ink,
            padding: "4px 12px",
            border: `2.5px solid ${E.ink}`,
            transform: `translateY(${(1 - fadeIn(f, 4 + i * step, 5)) * 10}px)`,
          }}
        >
          {w.t}
        </span>
      ))}
    </div>
  );
};

const H: React.FC<{ children: React.ReactNode; size?: number; top: number; center?: boolean }> = ({
  children,
  size = 60,
  top,
  center = true,
}) => (
  <div
    style={{
      position: "absolute",
      left: 40,
      right: 40,
      top,
      textAlign: center ? "center" : "left",
      fontFamily: E.sans,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.05,
      color: E.ink,
    }}
  >
    {children}
  </div>
);

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={E.w} height={E.h} style={{ position: "absolute", left: 0, top: 0 }}>
    {children}
  </svg>
);

// Seta à mão entre dois pontos (linha + duas pontas).
const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; start: number; seed: number }> = ({
  x1,
  y1,
  x2,
  y2,
  start,
  seed,
}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const L = 18;
  const hx = (ang: number) => x2 - L * Math.cos(a + ang);
  const hy = (ang: number) => y2 - L * Math.sin(a + ang);
  return (
    <>
      <SketchShape shape={{ kind: "line", x1, y1, x2, y2 }} stroke={E.ink} seed={seed} start={start} drawFrames={10} />
      <SketchShape shape={{ kind: "line", x1: x2, y1: y2, x2: hx(0.5), y2: hy(0.5) }} stroke={E.ink} seed={seed + 1} start={start + 8} drawFrames={5} />
      <SketchShape shape={{ kind: "line", x1: x2, y1: y2, x2: hx(-0.5), y2: hy(-0.5) }} stroke={E.ink} seed={seed + 2} start={start + 8} drawFrames={5} />
    </>
  );
};

const Hero: React.FC<{ s: Extract<EScene, { type: "hero" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Svg>
        <SketchShape shape={{ kind: "rect", x: 70, y: 330, w: 580, h: 150, fill: E.green }} fillStyle="solid" stroke={E.ink} seed={11} drawFrames={16} />
        {/* ícone de clipe de vídeo */}
        <SketchShape shape={{ kind: "rect", x: 220, y: 580, w: 280, h: 190 }} stroke={E.ink} seed={4} start={14} drawFrames={16} />
        <SketchShape shape={{ kind: "line", x1: 330, y1: 625, x2: 330, y2: 725 }} stroke={E.ink} seed={5} start={26} drawFrames={8} />
        <SketchShape shape={{ kind: "line", x1: 330, y1: 625, x2: 410, y2: 675 }} stroke={E.ink} seed={6} start={30} drawFrames={8} />
        <SketchShape shape={{ kind: "line", x1: 410, y1: 675, x2: 330, y2: 725 }} stroke={E.ink} seed={7} start={34} drawFrames={8} />
      </Svg>
      <div style={{ opacity: fadeIn(f, 6), position: "absolute", left: 0, right: 0, top: 352, textAlign: "center", fontFamily: E.sans, fontWeight: 900, fontSize: 96, color: E.ink }}>
        {s.title}
      </div>
      {s.sub && (
        <div style={{ opacity: fadeIn(f, 14), position: "absolute", left: 40, right: 40, top: 500, textAlign: "center", fontFamily: E.mono, fontSize: 28, color: E.muted }}>
          {s.sub}
        </div>
      )}
    </>
  );
};

const Flow: React.FC<{ s: Extract<EScene, { type: "flow" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const n = s.nodes.length;
  const boxH = 96;
  const gap = 62;
  const top = 230;
  return (
    <>
      {s.title && <H top={150} size={52}>{s.title}</H>}
      <Svg>
        {s.nodes.map((_, i) => {
          const y = top + i * (boxH + gap);
          const st = i * 16;
          return (
            <React.Fragment key={i}>
              <SketchShape shape={{ kind: "rect", x: 90, y, w: 540, h: boxH, fill: i === n - 1 ? E.green : E.white }} fillStyle="solid" stroke={E.ink} seed={20 + i} start={st} drawFrames={12} />
              {i < n - 1 && <Arrow x1={360} y1={y + boxH + 6} x2={360} y2={y + boxH + gap - 6} start={st + 10} seed={60 + i * 3} />}
            </React.Fragment>
          );
        })}
      </Svg>
      {s.nodes.map((t, i) => (
        <div key={i} style={{ opacity: fadeIn(f, i * 16 + 6), position: "absolute", left: 90, width: 540, top: top + i * (boxH + gap), height: boxH, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: E.sans, fontWeight: 800, fontSize: 34, color: E.ink, textAlign: "center" }}>
          {t}
        </div>
      ))}
    </>
  );
};

const Steps: React.FC<{ s: Extract<EScene, { type: "steps" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const top = 300;
  const row = 128;
  return (
    <>
      <H top={150} size={56}>{s.title}</H>
      <Svg>
        <SketchShape shape={{ kind: "line", x1: 150, y1: 240, x2: 570, y2: 240 }} stroke={E.ink} seed={9} drawFrames={12} />
        {s.items.map((_, i) => (
          <SketchShape key={i} shape={{ kind: "ellipse", x: 50, y: top + i * row, w: 64, h: 64, fill: E.green }} fillStyle="solid" stroke={E.ink} seed={30 + i} start={10 + i * 12} drawFrames={10} />
        ))}
      </Svg>
      {s.items.map((t, i) => (
        <React.Fragment key={i}>
          <div style={{ opacity: fadeIn(f, 14 + i * 12), position: "absolute", left: 50, top: top + i * row, width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: E.sans, fontWeight: 900, fontSize: 34, color: E.ink }}>
            {i + 1}
          </div>
          <div style={{ opacity: fadeIn(f, 14 + i * 12), position: "absolute", left: 138, right: 40, top: top + i * row - 4, height: 72, display: "flex", alignItems: "center", fontFamily: E.sans, fontWeight: 700, fontSize: 31, lineHeight: 1.12, color: E.ink }}>
            {t}
          </div>
        </React.Fragment>
      ))}
    </>
  );
};

const Tree: React.FC<{ s: Extract<EScene, { type: "tree" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const top = 250;
  const row = 62;
  return (
    <>
      {s.title && <H top={150} size={50}>{s.title}</H>}
      <Svg>
        <SketchShape shape={{ kind: "rect", x: 30, y: top - 24, w: 660, h: s.lines.length * row + 36, fill: E.white }} fillStyle="solid" stroke={E.ink} seed={41} drawFrames={14} />
        {s.lines.map((l, i) =>
          l.score ? (
            <SketchShape key={i} shape={{ kind: "ellipse", x: 612, y: top + i * row - 2, w: 56, h: 44, fill: E.green }} fillStyle="solid" stroke={E.ink} seed={50 + i} start={20 + i * 8} drawFrames={8} />
          ) : null
        )}
      </Svg>
      {s.lines.map((l, i) => (
        <React.Fragment key={i}>
          <div style={{ opacity: fadeIn(f, 12 + i * 8), position: "absolute", left: 56 + l.depth * 30, top: top + i * row, right: 90, fontFamily: E.mono, fontSize: l.score ? 21 : 24, fontWeight: l.score ? 500 : 700, color: E.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {l.score ? "• " : "▸ "}
            {l.text}
          </div>
          {l.score && (
            <div style={{ opacity: fadeIn(f, 20 + i * 8), position: "absolute", left: 612, top: top + i * row - 2, width: 56, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: E.sans, fontWeight: 900, fontSize: 24, color: E.ink }}>
              {l.score}
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

const List: React.FC<{ s: Extract<EScene, { type: "list" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const top = 280;
  const row = 190;
  return (
    <>
      <H top={150} size={56}>{s.title}</H>
      <Svg>
        {s.items.map((it, i) => (
          <SketchShape key={i} shape={{ kind: "rect", x: 50, y: top + i * row, w: 620, h: 150, fill: E.white }} fillStyle="solid" stroke={it.warn ? E.red : E.ink} seed={70 + i} start={i * 14} drawFrames={14} />
        ))}
      </Svg>
      {s.items.map((it, i) => (
        <div key={i} style={{ opacity: fadeIn(f, i * 14 + 8), position: "absolute", left: 76, right: 76, top: top + i * row, height: 150, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          <div style={{ fontFamily: E.sans, fontWeight: 800, fontSize: 32, lineHeight: 1.12, color: it.warn ? E.red : E.ink }}>{it.text}</div>
          {it.note && <div style={{ fontFamily: E.mono, fontSize: 20, color: E.muted }}>{it.note}</div>}
        </div>
      ))}
    </>
  );
};

const Code: React.FC<{ s: Extract<EScene, { type: "code" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const top = 240;
  const row = 62;
  return (
    <>
      {s.title && <H top={150} size={50}>{s.title}</H>}
      <Svg>
        <SketchShape shape={{ kind: "rect", x: 30, y: top - 24, w: 660, h: s.lines.length * row + 40, fill: E.ink }} fillStyle="solid" stroke={E.ink} seed={80} drawFrames={14} />
      </Svg>
      {s.lines.map((l, i) => (
        <div key={i} style={{ opacity: fadeIn(f, 12 + i * 9), position: "absolute", left: 56, right: 50, top: top + i * row, fontFamily: E.mono, fontSize: 20, color: "#EDEDE4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          <span style={{ color: E.green }}>$ </span>
          {l}
        </div>
      ))}
    </>
  );
};

const Cta: React.FC<{ s: Extract<EScene, { type: "cta" }>; handle: string }> = ({ s, handle }) => {
  const f = useCurrentFrame();
  return (
    <>
      <H top={300} size={64}>{s.title}</H>
      <Svg>
        <SketchShape shape={{ kind: "rect", x: 110, y: 560, w: 500, h: 110, fill: E.green }} fillStyle="solid" stroke={E.ink} seed={90} start={10} drawFrames={14} />
        <Arrow x1={360} y1={780} x2={360} y2={700} start={26} seed={95} />
      </Svg>
      <div style={{ opacity: fadeIn(f, 16), position: "absolute", left: 0, right: 0, top: 584, textAlign: "center", fontFamily: E.sans, fontWeight: 900, fontSize: 48, color: E.ink }}>
        {handle}
      </div>
    </>
  );
};

const View: React.FC<{ scene: EScene; handle: string }> = ({ scene, handle }) => {
  switch (scene.type) {
    case "hero":
      return <Hero s={scene} />;
    case "flow":
      return <Flow s={scene} />;
    case "steps":
      return <Steps s={scene} />;
    case "tree":
      return <Tree s={scene} />;
    case "list":
      return <List s={scene} />;
    case "code":
      return <Code s={scene} />;
    case "cta":
      return <Cta s={scene} handle={handle} />;
  }
};

export const Explainer: React.FC<ERoteiro> = ({ meta, scenes }) => {
  let from = 0;
  return (
    <>
      {scenes.map((scene, i) => {
        const dur = Math.round(scene.duration * E.fps);
        const el = (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Backdrop handle={meta.handle} />
            <View scene={scene} handle={meta.handle} />
            <KaraokeCaption text={scene.caption} total={dur} />
          </Sequence>
        );
        from += dur;
        return el;
      })}
    </>
  );
};
