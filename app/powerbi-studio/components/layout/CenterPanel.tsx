import React from 'react';
import Canvas from '@/app/powerbi-studio/components/canvas/Canvas';

export default function CenterPanel() {
  return (
    <div className="p-4 h-full overflow-auto">
      <Canvas />
    </div>
  );
}
