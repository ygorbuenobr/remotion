import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { InstaGlyph } from "./components/Chrome";
import type {
  CardItem,
  Group,
  LadderBar,
  MenuItem,
  Rail,
  Scene,
} from "./types";

const W = theme.width;
const H = theme.height;
const B = theme.baseline;
const TXT = theme.text;
const MUTED = theme.textMuted;
const LINE = theme.line;
const ACC = theme.accent;

// ---------- utilidades ----------

const fade = (frame: number, start = 0, len = 10) =>
  interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const mono = (color = MUTED, size = 16, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: theme.fontMono,
  fontSize: size,
  letterSpacing: 0.5,
  color,
  ...extra,
});

const bold = (size = 26, color = TXT, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: theme.fontSans,
  fontWeight: 700,
  fontSize: size,
  color,
  ...extra,
});

const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: "absolute",
  left: x,
  top: y,
  ...extra,
});

// ---------- carro, arcos e rampa (SVG em coordenadas do quadro) ----------

const Car: React.FC<{
  x: number;
  y: number;
  w?: number;
  rot?: number;
  color?: string;
  flying?: boolean;
  opacity?: number;
}> = ({ x, y, w = 60, rot = 0, color = ACC, flying = false, opacity = 1 }) => {
  const s = w / 60;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${s}) translate(-30 -13)`}
      fill="none"
      stroke={color}
      strokeWidth={1.3}
      opacity={opacity}
    >
      <path d="M2 17 L10 9 Q14 6 22 6 L36 6 Q44 7 50 12 L57 14 Q59 15 58 18 L56 19 L2 19 Z" />
      <circle cx={13} cy={19} r={3.4} />
      <circle cx={46} cy={19} r={3.4} />
      {flying && <path d="M18 22 Q19 28 20 22 M26 22 Q27 29 28 22 M34 22 Q35 28 36 22" />}
    </g>
  );
};

const cubic = (t: number, p: number[][]) => {
  const u = 1 - t;
  const x = u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0];
  const y = u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1];
  const dx = 3 * u * u * (p[1][0] - p[0][0]) + 6 * u * t * (p[2][0] - p[1][0]) + 3 * t * t * (p[3][0] - p[2][0]);
  const dy = 3 * u * u * (p[1][1] - p[0][1]) + 6 * u * t * (p[2][1] - p[1][1]) + 3 * t * t * (p[3][1] - p[2][1]);
  return { x, y, rot: (Math.atan2(dy, dx) * 180) / Math.PI };
};

const quad = (t: number, p: number[][]) => {
  const u = 1 - t;
  const x = u * u * p[0][0] + 2 * u * t * p[1][0] + t * t * p[2][0];
  const y = u * u * p[0][1] + 2 * u * t * p[1][1] + t * t * p[2][1];
  const dx = 2 * u * (p[1][0] - p[0][0]) + 2 * t * (p[2][0] - p[1][0]);
  const dy = 2 * u * (p[1][1] - p[0][1]) + 2 * t * (p[2][1] - p[1][1]);
  return { x, y, rot: (Math.atan2(dy, dx) * 180) / Math.PI };
};

const RAMPA = [
  [120, B],
  [300, B],
  [400, 540],
  [400, 330],
];
const SALTO = [
  [470, B],
  [580, 340],
  [690, B],
];

// Camada de arcos. `small` reduz e desloca para os frames de "atenção".
const ArcLayer: React.FC<{
  big?: boolean;
  carBig?: boolean;
  rampa?: boolean;
  salto?: boolean;
  carRampa?: number;
  carSalto?: number;
  cars?: boolean;
  small?: boolean;
}> = (p) => {
  const s = p.small ? 0.5 : 1;
  const tx = p.small ? 40 : 0;
  const gy = p.small ? 666 : B;
  const ty = gy - B * s;
  const rampaCar = cubic(p.carRampa ?? 0, RAMPA);
  const saltoCar = quad(p.carSalto ?? 0, SALTO);
  const carW = 40;
  const carY = B - 6 * (carW / 60);
  return (
    <svg width={W} height={H} style={abs(0, 0, { overflow: "visible" })}>
      <g transform={`translate(${tx} ${ty}) scale(${s})`}>
        <line x1={40} y1={B} x2={680} y2={B} stroke={LINE} strokeWidth={1.2} />
        {p.big && (
          <path d="M470 250 C690 300 690 560 440 650" fill="none" stroke={TXT} strokeWidth={1.4} />
        )}
        {p.big && p.carBig && <Car x={270} y={B - 6 * (70 / 60)} w={70} />}
        {p.rampa && (
          <path d="M120 650 C300 650 400 540 400 330" fill="none" stroke={TXT} strokeWidth={1.4} />
        )}
        {p.rampa && (
          <Car
            x={rampaCar.x}
            y={rampaCar.y}
            w={40}
            rot={rampaCar.rot}
            flying={(p.carRampa ?? 0) > 0.6}
          />
        )}
        {p.salto && (
          <path d="M470 650 Q580 340 690 650" fill="none" stroke={TXT} strokeWidth={1.4} />
        )}
        {p.salto && <Car x={saltoCar.x} y={saltoCar.y} w={40} rot={saltoCar.rot} flying />}
        {p.cars &&
          [0, 1, 2, 3, 4].map((i) => (
            <Car key={i} x={484 + i * 46} y={carY} w={carW} color={TXT} opacity={0.85} />
          ))}
      </g>
    </svg>
  );
};

// ---------- Visuais ----------

const News: React.FC<Extract<Scene, { type: "news" }>> = (s) => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: fade(f) }}>
      <div style={abs(40, 150, { width: 640, borderTop: `2px solid ${TXT}`, borderBottom: `1px solid ${LINE}`, paddingTop: 12, paddingBottom: 12 })}>
        <div style={mono(MUTED, 14, { textTransform: "uppercase" })}>{s.kicker}</div>
      </div>
      <div style={abs(40, 240, { width: 640, fontFamily: theme.fontSerif, fontSize: 46, lineHeight: 1.15, color: TXT })}>
        {s.headline}
      </div>
      <div style={abs(40, 420, { width: 640, ...mono(MUTED, 18) })}>{s.lede}</div>
      <div style={abs(40, 480, { width: 640, borderTop: `1px solid ${LINE}`, paddingTop: 14, ...mono(MUTED, 14) })}>{s.source}</div>
    </div>
  );
};

const CardIcon: React.FC<{ kind: NonNullable<CardItem["icon"]> }> = ({ kind }) => {
  if (kind === "rocket") {
    return (
      <svg width={90} height={50} viewBox="0 0 90 50" style={{ overflow: "visible" }}>
        <g transform="translate(45 25) scale(1.4) translate(-30 -13)" fill="none" stroke={ACC} strokeWidth={1.2}>
          <path d="M2 17 L10 9 Q14 6 22 6 L36 6 Q44 7 50 12 L57 14 Q59 15 58 18 L56 19 L2 19 Z" />
          <circle cx={13} cy={19} r={3.4} />
          <circle cx={46} cy={19} r={3.4} />
          <path d="M18 22 Q19 28 20 22 M26 22 Q27 29 28 22 M34 22 Q35 28 36 22" />
        </g>
      </svg>
    );
  }
  return (
    <svg width={90} height={50} viewBox="0 0 90 50">
      <g transform={`translate(45 25) scale(${kind === "thrust" ? 1.0 : 0.9}) translate(-30 -13)`} fill="none" stroke={MUTED} strokeWidth={1.2}>
        <path d="M2 17 L10 9 Q14 6 22 6 L36 6 Q44 7 50 12 L57 14 Q59 15 58 18 L56 19 L2 19 Z" />
        <circle cx={13} cy={19} r={3.4} />
        <circle cx={46} cy={19} r={3.4} />
      </g>
    </svg>
  );
};

const Card: React.FC<{ item: CardItem; x: number; y: number; w: number; h: number }> = ({ item, x, y, w, h }) => {
  if (item.style === "hidden") return null;
  const muted = item.style === "muted";
  const dashed = item.style === "dashed";
  return (
    <div
      style={abs(x, y, {
        width: w,
        height: h,
        boxSizing: "border-box",
        padding: "14px 20px",
        border: `1.5px ${dashed ? "dashed" : "solid"} ${dashed ? ACC : TXT}`,
        borderRadius: 6,
        opacity: muted ? 0.4 : 1,
      })}
    >
      <div style={bold(26)}>{item.title}</div>
      {item.sub && <div style={mono(MUTED, 17, { marginTop: 6 })}>{item.sub}</div>}
      {item.sub2 && <div style={mono(theme.textDim, 15, { marginTop: 4 })}>{item.sub2}</div>}
      {item.price && (
        <div style={{ marginTop: 10, fontFamily: theme.fontSans, color: TXT }}>
          <span style={bold(24)}>{item.price}</span>{" "}
          <span style={mono(MUTED, 16)}>de reserva</span>
        </div>
      )}
      {item.icon && (
        <div style={abs(w - 110, h / 2 - 25)}>
          <CardIcon kind={item.icon} />
        </div>
      )}
    </div>
  );
};

const Cards: React.FC<Extract<Scene, { type: "cards" }>> = (s) => {
  const f = useCurrentFrame();
  const stacked = s.items.filter((i) => i.col === undefined);
  const row = s.items.filter((i) => i.col !== undefined);
  return (
    <div style={{ opacity: fade(f) }}>
      <ArcLayer big={s.arc === "big"} carBig={s.carGround} />
      {s.notes?.map((n, i) => (
        <div key={i} style={abs(n.x, n.y, mono(MUTED, 16, { whiteSpace: "pre-line" }))}>
          {n.text}
        </div>
      ))}
      {stacked.map((item, i) => (
        <Card key={item.title} item={item} x={40} y={200 + i * 150} w={640} h={136} />
      ))}
      {row.map((item) => (
        <div key={item.title} style={abs(40 + (item.col ?? 0) * 330, 780)}>
          <div style={bold(26, TXT, { opacity: item.style === "muted" ? 0.4 : 1 })}>{item.title}</div>
          {item.sub && <div style={mono(MUTED, 16, { marginTop: 4 })}>{item.sub}</div>}
          {item.sub2 && <div style={mono(theme.textDim, 14, { marginTop: 2 })}>{item.sub2}</div>}
        </div>
      ))}
      {s.footnote && <div style={abs(40, 660, mono(MUTED, 14))}>{s.footnote}</div>}
      {s.source && <div style={abs(40, 880, mono(theme.textDim, 13))}>{s.source}</div>}
    </div>
  );
};

const Tree: React.FC<Extract<Scene, { type: "tree" }>> = (s) => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: fade(f) }}>
      <div style={abs(40, 200, { width: 640, height: 112, boxSizing: "border-box", padding: "18px 20px", border: `1.5px dashed ${ACC}`, borderRadius: 6 })}>
        <div style={bold(26)}>{s.root.title}</div>
        <div style={mono(MUTED, 17, { marginTop: 6 })}>{s.root.sub}</div>
      </div>
      {s.stage >= 1 && (
        <div style={abs(40, 380)}>
          <div style={bold(24)}>Vendas</div>
          <div style={abs(0, 40, { width: 60, height: 1, background: LINE })} />
          <div style={mono(MUTED, 16, { marginTop: 56 })}>{s.vendas ?? "—"}</div>
        </div>
      )}
      {s.stage >= 2 && (
        <svg width={W} height={H} style={abs(0, 0)}>
          <line x1={360} y1={312} x2={360} y2={540} stroke={TXT} strokeWidth={1} />
          <line x1={200} y1={540} x2={520} y2={540} stroke={TXT} strokeWidth={1} />
          <line x1={200} y1={540} x2={200} y2={580} stroke={TXT} strokeWidth={1} />
          <line x1={520} y1={540} x2={520} y2={580} stroke={TXT} strokeWidth={1} />
        </svg>
      )}
      {s.stage >= 2 &&
        ["FUNÇÃO 1", "FUNÇÃO 2"].map((label, i) => (
          <div
            key={label}
            style={abs(40 + i * 330, 580, {
              width: 290,
              height: 120,
              boxSizing: "border-box",
              padding: 16,
              border: `1.2px dashed ${LINE}`,
              borderRadius: 6,
            })}
          >
            <div style={mono(MUTED, 14)}>{label}</div>
            <div style={bold(26, MUTED, { marginTop: 12 })}>?</div>
          </div>
        ))}
    </div>
  );
};

const BlockRow: React.FC<{ count: number; cell: number; gap: number; cols: number; color?: string }> = ({
  count,
  cell,
  gap,
  cols,
  color = TXT,
}) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ width: cell, height: cell, background: color }} />
    ))}
  </div>
);

const Attention: React.FC<Extract<Scene, { type: "attention" }>> = (s) => {
  const f = useCurrentFrame();
  const m = s.metric;
  return (
    <div style={{ opacity: fade(f) }}>
      <div style={abs(40, 190, bold(26))}>{s.title}</div>
      <div style={abs(40, 226, mono(MUTED, 18))}>{s.sub}</div>
      {m && (
        <>
          <div style={abs(40, 300, bold(22))}>{m.label}</div>
          <div style={abs(40, 336, mono(MUTED, 15))}>{m.unit}</div>
          <div style={abs(40, 366)}>
            <BlockRow count={m.blocks} cell={9} gap={4} cols={25} />
          </div>
          <div style={abs(470, 346, { ...bold(30), textAlign: "right", width: 210 })}>{m.value}</div>
          <div style={abs(470, 386, { ...mono(MUTED, 15), textAlign: "right", width: 210 })}>em poucas horas</div>
          <div style={abs(40, 412, mono(theme.textDim, 13))}>{m.source}</div>
        </>
      )}
      {s.arc && (
        <>
          <div style={abs(100, 500, mono(theme.textDim, 14))}>RAMPA</div>
          {s.arc === "both" && <div style={abs(300, 500, mono(theme.textDim, 14))}>SALTO</div>}
          <ArcLayer
            small
            rampa
            salto={s.arc === "both"}
            carRampa={s.carRampa ?? 0}
            carSalto={s.carSalto ?? 0}
            cars={s.cars}
          />
        </>
      )}
      {s.cars && (
        <div style={abs(40, 700, mono(MUTED, 13))}>
          5 veículos: Cybercab · Cybertruck · Semi · Model Y · Model 3
        </div>
      )}
      {s.campaign && (
        <div
          style={abs(40, 770, {
            width: 640,
            boxSizing: "border-box",
            padding: "16px 20px",
            border: `1.2px dashed ${LINE}`,
            borderRadius: 6,
          })}
        >
          <div style={bold(22, MUTED)}>Campanha publicitária</div>
          <div style={mono(MUTED, 15, { marginTop: 6 })}>esse alcance não está à venda</div>
        </div>
      )}
    </div>
  );
};

const Ladder: React.FC<Extract<Scene, { type: "ladder" }>> = (s) => {
  const f = useCurrentFrame();
  const cols = [60, 260, 470];
  return (
    <div style={{ opacity: fade(f) }}>
      <div style={abs(40, 190, bold(26))}>{s.title}</div>
      <div style={abs(40, 226, mono(MUTED, 16))}>{s.unit}</div>
      <div style={abs(40, B, { width: 640, height: 1, background: LINE })} />
      {s.bars.map((bar: LadderBar, i: number) => {
        const x = cols[i] ?? 60 + i * 200;
        const rows = Math.ceil((bar.blocks ?? 0) / 5);
        const hgt = Math.max(rows, 1) * 26 - 4;
        const top = B - hgt;
        if (bar.state === "hidden") return null;
        if (bar.unknown) {
          const boxH = bar.blocks ? 70 : 180;
          return (
            <React.Fragment key={i}>
              <div
                style={abs(x, B - boxH, {
                  width: 84,
                  height: boxH,
                  boxSizing: "border-box",
                  border: `1.2px dashed ${LINE}`,
                  padding: "10px 12px",
                  ...bold(26, MUTED),
                })}
              >
                ?
              </div>
              {bar.blocks ? (
                <div style={abs(x, B - 14)}>
                  <BlockRow count={bar.blocks} cell={10} gap={4} cols={5} color="#CFCFCF" />
                </div>
              ) : null}
              {bar.valueLabel && <div style={abs(x, B - boxH - 34, bold(22))}>{bar.valueLabel}</div>}
              {bar.label && <div style={abs(x, B + 12, bold(26))}>{bar.label}</div>}
              {bar.sub && <div style={abs(x, B + 50, mono(MUTED, 16))}>{bar.sub}</div>}
              {bar.sub2 && <div style={abs(x, B + 74, mono(theme.textDim, 14))}>{bar.sub2}</div>}
            </React.Fragment>
          );
        }
        if (bar.state === "ghost") {
          return (
            <div
              key={i}
              style={abs(x, top, {
                width: 126,
                height: hgt,
                boxSizing: "border-box",
                border: `1px dashed ${LINE}`,
              })}
            />
          );
        }
        return (
          <React.Fragment key={i}>
            <div style={abs(x, top)}>
              <BlockRow count={bar.blocks ?? 0} cell={22} gap={4} cols={5} color={ACC} />
            </div>
            {bar.valueLabel && <div style={abs(x, top - 34, bold(22))}>{bar.valueLabel}</div>}
            {bar.label && <div style={abs(x, B + 12, bold(26))}>{bar.label}</div>}
            {bar.sub && <div style={abs(x, B + 50, mono(MUTED, 16))}>{bar.sub}</div>}
            {bar.sub2 && <div style={abs(x, B + 74, mono(theme.textDim, 14))}>{bar.sub2}</div>}
          </React.Fragment>
        );
      })}
      {s.footnote && <div style={abs(40, 800, { ...mono(TXT, 17), textAlign: "right", width: 640 })}>{s.footnote}</div>}
      {s.source && <div style={abs(40, 836, mono(theme.textDim, 13))}>{s.source}</div>}
    </div>
  );
};

// Régua de ancoragem com um ou mais trilhos.
const RailView: React.FC<{ rail: Rail; max: number }> = ({ rail, max }) => {
  const x0 = theme.rulerX0;
  const x1 = theme.rulerX1;
  const xOf = (v: number) => x0 + Math.min(v, max) / max * (x1 - x0);
  const op = rail.dim ? 0.3 : 1;
  const ticks = Array.from({ length: 17 }, (_, i) => x0 + (i * (x1 - x0)) / 16);
  return (
    <div style={{ opacity: op }}>
      <div style={abs(x0, rail.y, { width: x1 - x0, height: 1, background: LINE })} />
      {ticks.map((tx, i) => (
        <div key={i} style={abs(tx, rail.y - 3, { width: 1, height: 6, background: LINE })} />
      ))}
      {rail.zero && <div style={abs(x0 - 2, rail.y + 6, mono(theme.textDim, 12))}>0</div>}
      {rail.markers.map((m, i) => {
        const x = xOf(m.value);
        const color = m.accent ? ACC : TXT;
        const off = m.offscale || m.value > max;
        const anchorRight = x > 560;
        const textStyle: React.CSSProperties = anchorRight
          ? { right: W - x + 2, textAlign: "right" }
          : x < 160
          ? { left: x - 2, textAlign: "left" }
          : { left: x - 110, width: 220, textAlign: "center" };
        return (
          <React.Fragment key={i}>
            {off && (
              <div
                style={abs(x0 + (x1 - x0) * 0.98, rail.y, {
                  width: 26,
                  height: 1,
                  borderTop: `1px dotted ${MUTED}`,
                })}
              />
            )}
            <div style={abs(x - 0.5, rail.y - (m.above ? 60 : 0), { width: 1, height: m.above ? 60 : 0, background: color })} />
            <div style={abs(x - 4, rail.y - 4, { width: 8, height: 8, borderRadius: 8, background: color })} />
            {m.below && (
              <div style={abs(x - 0.5, rail.y, { width: 1, height: 30, background: color })} />
            )}
            {m.above && (
              <div style={abs(0, rail.y - 98, { position: "absolute", ...textStyle, width: anchorRight ? undefined : textStyle.width })}>
                <div style={bold(20, color)}>{m.above.label}</div>
                {m.above.sub && <div style={mono(MUTED, 15)}>{m.above.sub}</div>}
              </div>
            )}
            {m.below && (
              <div style={abs(0, rail.y + 38, { position: "absolute", ...textStyle, width: anchorRight ? undefined : textStyle.width })}>
                <div style={bold(22, color)}>{m.below.label}</div>
                {m.below.sub && <div style={mono(MUTED, 15)}>{m.below.sub}</div>}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Ruler: React.FC<Extract<Scene, { type: "ruler" }>> = (s) => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: fade(f) }}>
      {s.title && <div style={abs(40, 190, bold(26))}>{s.title}</div>}
      {s.sub && <div style={abs(40, 226, mono(MUTED, 18))}>{s.sub}</div>}
      {s.verbete && (
        <div
          style={abs(40, 200, {
            width: 640,
            boxSizing: "border-box",
            padding: "20px 22px",
            border: `1px solid ${LINE}`,
            borderRadius: 6,
            background: "#0E0E0E",
          })}
        >
          <div style={mono(theme.textDim, 13, { textTransform: "uppercase" })}>Verbete</div>
          <div style={bold(34, TXT, { marginTop: 6 })}>{s.verbete.title}</div>
          <div style={mono(MUTED, 17, { marginTop: 8, whiteSpace: "pre-line" })}>{s.verbete.text}</div>
          {s.verbete.source && <div style={mono(theme.textDim, 14, { marginTop: 10 })}>{s.verbete.source}</div>}
        </div>
      )}
      {s.rails.map((r, i) => (
        <RailView key={i} rail={r} max={r.max} />
      ))}
      {s.box && (
        <div
          style={abs(40, 760, {
            width: 640,
            boxSizing: "border-box",
            padding: "16px 20px",
            border: `1.2px solid ${TXT}`,
            borderRadius: 6,
          })}
        >
          <div style={bold(22)}>{s.box.title}</div>
          <div style={mono(MUTED, 15, { marginTop: 6 })}>{s.box.sub}</div>
        </div>
      )}
    </div>
  );
};

const MenuRow: React.FC<{ item: MenuItem }> = ({ item }) => {
  const border = item.style === "dashed" ? `1.2px dashed ${ACC}` : item.style === "solid" ? `1.2px solid ${TXT}` : "1.2px solid transparent";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 14px",
        border,
        borderRadius: 4,
        boxSizing: "border-box",
        marginBottom: 6,
      }}
    >
      <div>
        <div style={bold(22)}>{item.name}</div>
        {item.sub && <div style={mono(theme.textDim, 13)}>{item.sub}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        {item.note && <span style={mono(MUTED, 14)}>{item.note}</span>}
        <span style={bold(22, item.price ? TXT : MUTED)}>{item.price ?? ""}</span>
      </div>
    </div>
  );
};

const Menu: React.FC<Extract<Scene, { type: "menu" }>> = (s) => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: fade(f) }}>
      <div style={abs(40, 190, { width: 640, boxSizing: "border-box", padding: "16px 18px", border: `1px solid ${LINE}`, borderRadius: 6 })}>
        <div style={mono(MUTED, 13, { letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 })}>Cardápio</div>
        {s.items.map((it) => (
          <MenuRow key={it.name} item={it} />
        ))}
      </div>
      {s.chart && (
        <div style={abs(40, 700, { width: 640 })}>
          <div style={bold(22)}>{s.chart.title}</div>
          <div style={mono(theme.textDim, 15, { marginTop: 4 })}>{s.chart.unit}</div>
          {s.chart.rows.map((r) => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
              <div style={mono(MUTED, 15, { width: 120 })}>{r.label}</div>
              <BlockRow count={r.blocks} cell={10} gap={4} cols={20} color={TXT} />
              {r.note && <span style={mono(ACC, 14)}>{r.note}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BOTTLE = "M40 0 L40 52 Q40 64 26 74 L26 296 Q26 320 50 320 L70 320 Q94 320 94 296 L94 74 Q80 64 80 52 L80 0 Z";

const Bottles: React.FC<Extract<Scene, { type: "bottles" }>> = (s) => {
  const f = useCurrentFrame();
  const xs = [150, 420];
  const sc = 1.2;
  return (
    <div style={{ opacity: fade(f) }}>
      <div style={abs(40, 226, mono(MUTED, 16))}>{s.unit}</div>
      <svg width={W} height={H} style={abs(0, 0)}>
        {s.bottles.map((b, i) => {
          const cx = xs[i] ?? 150 + i * 270;
          const left = cx - 60 * sc;
          const top = 280;
          return (
            <g key={i} transform={`translate(${left} ${top}) scale(${sc})`}>
              <path d={BOTTLE} fill="none" stroke={b.dashed ? ACC : TXT} strokeWidth={1.2} strokeDasharray={b.dashed ? "4 3" : undefined} />
              {(b.blocks ?? 0) > 0 &&
                Array.from({ length: b.blocks ?? 0 }).map((_, k) => {
                  const col = k % 4;
                  const row = Math.floor(k / 4);
                  return (
                    <rect
                      key={k}
                      x={34 + col * 14}
                      y={296 - (row + 1) * 14}
                      width={10}
                      height={10}
                      fill={b.dashed ? ACC : TXT}
                    />
                  );
                })}
            </g>
          );
        })}
      </svg>
      {s.bottles.map((b, i) => {
        const cx = xs[i] ?? 150 + i * 270;
        if (!b.label) return null;
        return (
          <div key={i} style={abs(cx - 110, 300 + 384 + 16, { width: 220, textAlign: "center" })}>
            <div style={bold(26)}>{b.label}</div>
            {b.sub && <div style={mono(MUTED, 16, { marginTop: 4 })}>{b.sub}</div>}
          </div>
        );
      })}
    </div>
  );
};

const Options: React.FC<Extract<Scene, { type: "options" }>> = (s) => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: fade(f) }}>
      <div style={abs(40, 190, bold(26))}>{s.title}</div>
      <div style={abs(40, 226, mono(MUTED, 18))}>{s.sub}</div>
      {s.groups.map((g: Group, gi: number) => {
        const y = 290 + gi * 200;
        return (
          <div key={g.label}>
            <div style={abs(40, y, mono(theme.textDim, 14, { textTransform: "uppercase", letterSpacing: 2 }))}>{g.label}</div>
            {g.items.map((it, k) => {
              if (it.style === "hidden") return null;
              const dim = it.style === "dim";
              const dashed = it.style === "dashed";
              return (
                <div
                  key={it.name}
                  style={abs(40 + k * 340, y + 26, {
                    width: 300,
                    height: 88,
                    boxSizing: "border-box",
                    padding: "16px 18px",
                    border: `1.4px ${dashed ? "dashed" : "solid"} ${dashed ? ACC : TXT}`,
                    borderRadius: 6,
                    opacity: dim ? 0.3 : 1,
                  })}
                >
                  <div style={bold(22)}>{it.name}</div>
                  <div style={mono(MUTED, 15, { marginTop: 6 })}>{it.sub}</div>
                </div>
              );
            })}
          </div>
        );
      })}
      {s.footer && <div style={abs(40, 636, mono(MUTED, 16))}>{s.footer}</div>}
      {s.rails?.map((r, i) => (
        <RailView key={i} rail={r} max={r.max} />
      ))}
    </div>
  );
};

const Sai: React.FC<Extract<Scene, { type: "sai" }>> = (s) => {
  const f = useCurrentFrame();
  const st = s.stage;
  const logoY = st === 4 ? 210 : 200;
  return (
    <div style={{ opacity: fade(f) }}>
      {st < 4 && (
        <div style={abs(40, logoY, { display: "flex", alignItems: "center", gap: 14 })}>
          <svg width={80} height={50} viewBox="0 0 80 50" fill="none" stroke={TXT} strokeWidth={3}>
            <path d="M2 2 H14 M2 2 V14 M2 48 H14 M2 48 V36 M78 2 H66 M78 2 V14 M78 48 H66 M78 48 V36" />
          </svg>
          <div>
            <div style={{ fontFamily: theme.fontSans, fontWeight: 800, fontSize: 40, lineHeight: 1 }}>SAI</div>
          </div>
          <div style={{ marginLeft: 6 }}>
            <div style={bold(22)}>Seu Auditor Internacional</div>
            <div style={mono(MUTED, 14, { marginTop: 4 })}>precificação com base em dados</div>
          </div>
        </div>
      )}
      {st >= 1 && st < 4 && (
        <>
          <div
            style={abs(40, 360, {
              width: 640,
              boxSizing: "border-box",
              padding: "16px 20px",
              border: `1.4px solid ${TXT}`,
              borderRadius: 4,
              opacity: st >= 3 ? 0.3 : 1,
            })}
          >
            <div style={bold(24)}>Dados da empresa</div>
            <div style={mono(MUTED, 15, { marginTop: 6 })}>custos, margens e demanda</div>
          </div>
          <div style={abs(359.5, 450, { width: 1, height: 40, background: TXT, opacity: st >= 3 ? 0.3 : 1 })} />
          <div style={abs(354, 490, { width: 12, height: 12, borderRadius: 12, background: ACC, opacity: st >= 3 ? 0.3 : 1 })} />
          <div style={abs(380, 484, { opacity: st >= 3 ? 0.3 : 1 })}>
            <div style={bold(22)}>Preço</div>
            <div style={mono(MUTED, 15)}>com base em dados</div>
          </div>
        </>
      )}
      {st >= 2 && st < 4 && (
        <div
          style={abs(40, 560, {
            width: 640,
            boxSizing: "border-box",
            padding: "14px 20px",
            border: `1.2px dashed ${LINE}`,
            borderRadius: 4,
          })}
        >
          <div style={bold(22, MUTED)}>Achismo</div>
          <div style={mono(theme.textDim, 15, { marginTop: 4 })}>preço no chute</div>
        </div>
      )}
      {st === 3 && (
        <div style={abs(40, 700)}>
          <div style={bold(26)}>@seu.auditor</div>
          <div style={mono(MUTED, 16, { marginTop: 6 })}>siga para entender mais sobre gestão</div>
        </div>
      )}
      {st === 4 && (
        <div style={abs(0, 470, { width: W, textAlign: "center" })}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <InstaGlyph size={120} />
          </div>
          <div style={{ ...bold(40), marginTop: 26, letterSpacing: 1 }}>@SEU.AUDITOR</div>
        </div>
      )}
    </div>
  );
};

// Despacho: cada tipo de cena renderiza seu visual.
export const Visual: React.FC<{ scene: Scene }> = ({ scene }) => {
  switch (scene.type) {
    case "news":
      return <News {...scene} />;
    case "cards":
      return <Cards {...scene} />;
    case "tree":
      return <Tree {...scene} />;
    case "attention":
      return <Attention {...scene} />;
    case "ladder":
      return <Ladder {...scene} />;
    case "ruler":
      return <Ruler {...scene} />;
    case "menu":
      return <Menu {...scene} />;
    case "bottles":
      return <Bottles {...scene} />;
    case "options":
      return <Options {...scene} />;
    case "sai":
      return <Sai {...scene} />;
    default:
      return null;
  }
};
