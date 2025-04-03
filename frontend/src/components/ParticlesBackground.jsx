// src/components/ParticlesBackground.jsx
import React from "react";

const ParticlesBackground = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className={`particle particle-${i % 10}`} />
      ))}
    </div>
  );
};

export default ParticlesBackground;
