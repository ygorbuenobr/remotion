import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import roteiro from "../roteiro/tesla-ancoragem.json";
import { Roteiro, Video } from "./Video";
import { theme } from "./theme";

// A duração do vídeo é a soma das cenas: não precisa ajustar manualmente.
const calculateMetadata: CalculateMetadataFunction<Roteiro> = ({ props }) => ({
  durationInFrames: props.scenes.reduce((acc, s) => acc + Math.round(s.duration * theme.fps), 0),
});

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Video"
    component={Video}
    durationInFrames={theme.fps * 60}
    fps={theme.fps}
    width={theme.width}
    height={theme.height}
    defaultProps={roteiro as Roteiro}
    calculateMetadata={calculateMetadata}
  />
);
