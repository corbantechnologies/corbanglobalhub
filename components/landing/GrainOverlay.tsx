import React from "react";

export default function GrainOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />
    </div>
  );
}
