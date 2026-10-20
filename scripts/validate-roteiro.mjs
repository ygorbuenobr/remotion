// Valida roteiros JSON: estrutura, tipos de cena, durações em frames inteiros e duração total.
// Uso: node scripts/validate-roteiro.mjs roteiro/tesla-ancoragem.json [--expect=132]
import { readFileSync } from "node:fs";

const FPS = 30;
const TYPES = new Set(["news", "cards", "tree", "attention", "ladder", "ruler", "menu", "bottles", "options", "sai"]);
const args = process.argv.slice(2);
const expectArg = args.find((a) => a.startsWith("--expect="));
const files = args.filter((a) => !a.startsWith("--"));
const expect = expectArg ? Number(expectArg.split("=")[1]) : null;

let failed = 0;
const fail = (file, msg) => {
  failed++;
  console.error(`✗ ${file}: ${msg}`);
};

for (const file of files) {
  let data;
  try {
    data = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    fail(file, `JSON inválido (${e.message})`);
    continue;
  }
  for (const k of ["title", "section", "date", "brand", "handle"]) {
    if (!data.meta?.[k]) fail(file, `meta.${k} ausente`);
  }
  if (!Array.isArray(data.scenes) || data.scenes.length === 0) {
    fail(file, "scenes vazio");
    continue;
  }
  let total = 0;
  data.scenes.forEach((s, i) => {
    const where = `cena ${i + 1}`;
    if (!TYPES.has(s.type)) fail(file, `${where}: tipo desconhecido "${s.type}"`);
    if (typeof s.duration !== "number" || s.duration <= 0) fail(file, `${where}: duration inválida`);
    const frames = (s.duration ?? 0) * FPS;
    if (!Number.isInteger(frames)) fail(file, `${where}: duration não fecha em frames (${s.duration}s × ${FPS} fps)`);
    if (s.caption !== undefined && s.caption !== null && typeof s.caption !== "string") fail(file, `${where}: caption deve ser texto ou null`);
    if (s.type === "sai" && ![0, 1, 2, 3, 4].includes(s.stage)) fail(file, `${where}: sai.stage deve ser 0–4`);
    if (s.type === "tree" && ![0, 1, 2].includes(s.stage)) fail(file, `${where}: tree.stage deve ser 0–2`);
    if (s.type === "attention" && s.metric && typeof s.metric.blocks !== "number") fail(file, `${where}: metric.blocks ausente`);
    if (s.type === "ruler" || s.type === "options") {
      const rails = s.rails ?? [];
      rails.forEach((r, j) => {
        if (!(r.max > 0)) fail(file, `${where}: rail ${j} sem max`);
        r.markers.forEach((m) => {
          if (typeof m.value !== "number") fail(file, `${where}: marcador sem value`);
        });
      });
    }
    total += s.duration || 0;
  });
  const totalFrames = Math.round(total * FPS);
  console.log(`${file}: ${data.scenes.length} cenas, ${total}s (${totalFrames} frames)`);
  if (expect !== null && Math.abs(total - expect) > 1e-9) fail(file, `duração total ${total}s, esperado ${expect}s`);
}

if (failed) {
  console.error(`\n${failed} problema(s) encontrado(s).`);
  process.exit(1);
}
console.log("OK");
