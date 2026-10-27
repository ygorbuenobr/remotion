import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import roteiro from "../roteiro/tesla-ancoragem.json";
import { Video } from "./Video";
import { SketchTest } from "./SketchTest";
import { Explainer } from "./explainer/Explainer";
import stockpile from "../roteiro/stockpile.json";
import type { ERoteiro } from "./explainer/types";
import { theme } from "./theme";
import type { Roteiro } from "./types";

// A duração do vídeo é a soma das cenas. Não precisa ajustar manualmente.
const calculateMetadata: CalculateMetadataFunction<Roteiro> = ({ props }) => ({
  durationInFrames: props.scenes.reduce((acc, s) => acc + Math.round(s.duration * theme.fps), 0),
});

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="Video"
    component={Video}
    durationInFrames={theme.fps * 132}
    fps={theme.fps}
    width={theme.width}
    height={theme.height}
    defaultProps={roteiro as unknown as Roteiro}
    calculateMetadata={calculateMetadata}
  />
  <Composition
    id="Explainer"
    component={Explainer}
    durationInFrames={theme.fps * 51}
    fps={theme.fps}
    width={theme.width}
    height={theme.height}
    defaultProps={stockpile as unknown as ERoteiro}
    calculateMetadata={({ props }: { props: ERoteiro }) => ({
      durationInFrames: props.scenes.reduce((acc, sc) => acc + Math.round(sc.duration * theme.fps), 0),
    })}
  />
  <Composition id="SketchTest" component={SketchTest} durationInFrames={120} fps={theme.fps} width={theme.width} height={theme.height} />
  </>
);
