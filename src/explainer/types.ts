// Contrato do "explicador de repositório": vídeo vertical, fundo creme, traço à mão e legenda palavra por palavra.
// Palavras entre *asteriscos* na legenda ganham destaque verde.
type Base = { duration: number; caption: string };

export type EScene =
  | (Base & { type: "hero"; title: string; sub?: string })
  | (Base & { type: "flow"; title?: string; nodes: string[] })
  | (Base & { type: "steps"; title: string; items: string[] })
  | (Base & { type: "tree"; title?: string; lines: { text: string; depth: number; score?: string }[] })
  | (Base & { type: "list"; title: string; items: { text: string; note?: string; warn?: boolean }[] })
  | (Base & { type: "code"; title?: string; lines: string[] })
  | (Base & { type: "cta"; title: string });

export type ERoteiro = {
  meta: { title: string; handle: string };
  scenes: EScene[];
};
