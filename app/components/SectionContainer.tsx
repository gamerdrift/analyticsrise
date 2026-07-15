import React from 'react';

export function SectionContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="p-6 bg-[#0D1117]/50 rounded-lg border border-white/5 backdrop-blur-sm mb-6">
      <h2 className="text-xl font-display font-bold text-white mb-4">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
