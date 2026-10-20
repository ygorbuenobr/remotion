// Contrato do roteiro. Cada cena vira um bloco de tempo; `duration` em segundos.
// Coordenadas dos visuais são absolutas no quadro 720x1280.

export type Header = { left: string; right?: string };

type Base = {
  duration: number;
  caption?: string | null;
  header?: Header;
  audio?: string; // caminho relativo a public/, ex: "audio/cena-01.mp3" (narração opcional)
};

export type CardItem = {
  title: string;
  sub?: string;
  sub2?: string;
  price?: string | null;
  style?: "dashed" | "solid" | "muted" | "hidden";
  col?: 0 | 1; // colunas do rodapé (intro)
  icon?: "rocket" | "thrust" | "performance" | null;
};

export type Note = { text: string; x: number; y: number };

export type LadderBar = {
  label?: string;
  sub?: string;
  sub2?: string;
  blocks?: number; // blocos da barra (1 bloco = unitValue)
  valueLabel?: string;
  state: "hidden" | "ghost" | "full";
  unknown?: boolean; // caixa tracejada com "?"
};

export type Marker = {
  value: number;
  above?: { label: string; sub?: string };
  below?: { label: string; sub?: string };
  accent?: boolean;
  dim?: boolean;
  offscale?: boolean; // valor fora da régua: linha tracejada até a borda
};

export type Rail = {
  y: number;
  max: number;
  dim?: boolean;
  zero?: boolean;
  markers: Marker[];
};

export type MenuItem = {
  name: string;
  price?: string | null;
  sub?: string;
  style?: "plain" | "dashed" | "solid";
  note?: string;
};

export type Group = {
  label: string;
  items: { name: string; sub: string; style: "hidden" | "dim" | "solid" | "dashed" }[];
};

export type Scene =
  | (Base & {
      type: "news";
      kicker: string;
      headline: string;
      lede: string;
      source: string;
    })
  | (Base & {
      type: "cards";
      items: CardItem[];
      arc?: "big" | null;
      carGround?: boolean;
      notes?: Note[];
      footnote?: string;
      source?: string;
    })
  | (Base & {
      type: "tree";
      stage: 0 | 1 | 2;
      root: { title: string; sub: string };
      vendas?: string;
    })
  | (Base & {
      type: "attention";
      title: string;
      sub: string;
      metric?: { label: string; unit: string; blocks: number; value: string; source: string } | null;
      arc?: "rampa" | "both" | null;
      carRampa?: number; // 0 = pé da rampa, 1 = topo
      carSalto?: number; // 0 = início do salto, 1 = aterrissagem
      cars?: boolean;
      campaign?: boolean;
    })
  | (Base & {
      type: "ladder";
      title: string;
      unit: string;
      unitValue: number;
      bars: LadderBar[];
      footnote?: string;
      source?: string;
    })
  | (Base & {
      type: "ruler";
      title?: string;
      sub?: string;
      verbete?: { title: string; text: string; source?: string } | null;
      rails: Rail[];
      box?: { title: string; sub: string } | null;
    })
  | (Base & {
      type: "menu";
      items: MenuItem[];
      chart?: { title: string; unit: string; rows: { label: string; blocks: number; note?: string }[] } | null;
    })
  | (Base & {
      type: "bottles";
      unit: string;
      bottles: { label?: string; sub?: string; blocks?: number; dashed?: boolean }[];
    })
  | (Base & {
      type: "options";
      title: string;
      sub: string;
      groups: Group[];
      footer?: string;
      rails?: Rail[];
    })
  | (Base & {
      type: "sai";
      stage: 0 | 1 | 2 | 3 | 4;
    });

export type Roteiro = {
  meta: {
    title: string;
    section: string;
    date: string;
    brand: string;
    handle: string;
  };
  scenes: Scene[];
};
