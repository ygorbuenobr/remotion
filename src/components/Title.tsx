import React from "react";
import { theme } from "../theme";

// Manchete em serifa, centralizada. Usada para gancho e títulos de bloco.
export const Title: React.FC<{ text: string; size?: number }> = ({ text, size = 64 }) => (
  <div
    style={{
      position: "absolute",
      left: theme.marginX,
      right: theme.marginX,
      top: 360,
      textAlign: "center",
      fontFamily: theme.fontSerif,
      fontSize: size,
      lineHeight: 1.1,
      color: theme.text,
    }}
  >
    {text}
  </div>
);
