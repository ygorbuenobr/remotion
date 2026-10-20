import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

// Legenda centralizada, abaixo da área de visual. Fade-in de 8 frames.
export const Caption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: theme.marginX,
        right: theme.marginX,
        bottom: theme.captionBottom,
        textAlign: "center",
        fontSize: theme.captionSize,
        lineHeight: 1.28,
        fontWeight: 500,
        color: theme.text,
        opacity,
      }}
    >
      {text}
    </div>
  );
};
