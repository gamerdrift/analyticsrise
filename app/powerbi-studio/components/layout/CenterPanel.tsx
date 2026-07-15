import React from 'react';
import Canvas from '../canvas/Canvas';

export default function CenterPanel() {
  return (
    <div className="p-4 h-full overflow-auto">
      <Canvas />
    </div>
  );
}
