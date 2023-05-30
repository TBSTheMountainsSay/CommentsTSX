import React, { useState } from 'react';

export const useBubbles = () => {
  const [bubbles, setBubbles] = useState<number[]>([]);

  const startAnimation = () => {
    setBubbles([...bubbles, 1]);
    const bubbleCopy = [...bubbles];
    bubbleCopy.unshift();
    setTimeout(() => {
      setBubbles(bubbleCopy);
    }, 500);
  };

  const bubblesElement = (
    <div className="bubbles">
      {bubbles.map((bubble, i) => (
        <div key={i} />
      ))}
    </div>
  );

  return { startAnimation, bubblesElement };
};
