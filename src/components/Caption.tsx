import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

// Legenda centralizada no terço inferior, com fade-in curto.
export const Caption: React.FC<{ text: string; fadeFrames?: number }> = ({
  text,
  fadeFrames = 8,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, fadeFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: theme.marginX,
        right: theme.marginX,
        bottom: 220,
        textAlign: "center",
        fontSize: 40,
        lineHeight: 1.25,
        fontWeight: 500,
        color: theme.text,
        opacity,
      }}
    >
      {text}
    </div>
  );
};
