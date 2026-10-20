import React from "react";
import { Sequence } from "remotion";
import { BarItem, BlockBars } from "./components/BlockBars";
import { Caption } from "./components/Caption";
import { Chrome, Frame } from "./components/Chrome";
import { EndCard } from "./components/EndCard";
import { Ruler, RulerMarker } from "./components/Ruler";
import { Title } from "./components/Title";
import { theme } from "./theme";

// Cada cena do roteiro.json vira um bloco de tempo. `duration` está em segundos.
export type Scene =
  | { type: "title"; duration: number; text: string }
  | { type: "caption"; duration: number; text: string }
  | {
      type: "bars";
      duration: number;
      caption?: string;
      unitValue: number;
      items: BarItem[];
    }
  | {
      type: "ruler";
      duration: number;
      caption?: string;
      max: number;
      markers: RulerMarker[];
    }
  | { type: "endcard"; duration: number; cta: string };

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

const SceneView: React.FC<{ scene: Scene; meta: Roteiro["meta"] }> = ({ scene, meta }) => {
  const caption = "caption" in scene ? scene.caption : undefined;
  return (
    <Frame>
      <Chrome section={meta.section} date={meta.date} brand={meta.brand} handle={meta.handle} />
      {scene.type === "title" && <Title text={scene.text} />}
      {scene.type === "caption" && <Caption text={scene.text} />}
      {scene.type === "bars" && (
        <>
          <BlockBars items={scene.items} unitValue={scene.unitValue} />
          {caption && <Caption text={caption} />}
        </>
      )}
      {scene.type === "ruler" && (
        <>
          <Ruler markers={scene.markers} max={scene.max} />
          {caption && <Caption text={caption} />}
        </>
      )}
      {scene.type === "endcard" && (
        <EndCard brand={meta.brand} handle={meta.handle} cta={scene.cta} />
      )}
    </Frame>
  );
};

export const Video: React.FC<Roteiro> = ({ meta, scenes }) => {
  let from = 0;
  return (
    <>
      {scenes.map((scene, i) => {
        const durationInFrames = Math.round(scene.duration * theme.fps);
        const el = (
          <Sequence key={i} from={from} durationInFrames={durationInFrames}>
            <SceneView scene={scene} meta={meta} />
          </Sequence>
        );
        from += durationInFrames;
        return el;
      })}
    </>
  );
};
