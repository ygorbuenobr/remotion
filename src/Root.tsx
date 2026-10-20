import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import roteiro from "../roteiro/tesla-ancoragem.json";
import { Video } from "./Video";
import { theme } from "./theme";
import type { Roteiro } from "./types";

// A duração do vídeo é a soma das cenas. Não precisa ajustar manualmente.
const calculateMetadata: CalculateMetadataFunction<Roteiro> = ({ props }) => ({
  durationInFrames: props.scenes.reduce((acc, s) => acc + Math.round(s.duration * theme.fps), 0),
});

export const RemotionRoot: React.FC = () => (
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
);
