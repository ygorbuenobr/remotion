import React from "react";
import { theme } from "../theme";

// Fechamento: marca + CTA. Recebe o handle e a frase de posicionamento do roteiro.
export const EndCard: React.FC<{ brand: string; handle: string; cta: string }> = ({
  brand,
  handle,
  cta,
}) => (
  <div
    style={{
      position: "absolute",
      left: theme.marginX,
      right: theme.marginX,
      top: 460,
      textAlign: "center",
    }}
  >
    <div style={{ fontFamily: theme.fontMono, fontSize: 40, fontWeight: 700, letterSpacing: 3 }}>{brand}</div>
    <div style={{ marginTop: 40, fontSize: 36, lineHeight: 1.3, color: theme.text }}>{cta}</div>
    <div style={{ marginTop: 48, fontFamily: theme.fontMono, fontSize: 28, color: theme.accent }}>{handle}</div>
  </div>
);
