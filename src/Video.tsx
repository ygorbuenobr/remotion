import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { Caption } from "./components/Caption";
import { Chrome, Frame } from "./components/Chrome";
import { theme } from "./theme";
import type { Roteiro, Scene } from "./types";
import { Visual } from "./visuals";

const SceneView: React.FC<{ scene: Scene; meta: Roteiro["meta"] }> = ({ scene, meta }) => {
  const header = scene.header ?? { left: meta.section, right: meta.date };
  return (
    <Frame>
      <Chrome header={header} handle={meta.handle} />
      <Visual scene={scene} />
      {scene.caption ? <Caption text={scene.caption} /> : null}
      {scene.audio ? <Audio src={staticFile(scene.audio)} /> : null}
    </Frame>
  );
};

// Encadeia as cenas no tempo. Cada cena é um <Sequence> com frame local começando em 0.
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
