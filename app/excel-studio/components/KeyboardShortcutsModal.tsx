'use client';

import React from 'react';
import { Command, X, Keyboard } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Arrow Keys', desc: 'Navigate between cells' },
    { key: 'Shift + Arrow', desc: 'Select range of cells' },
    { key: 'Enter / F2', desc: 'Edit active cell formula or value' },
    { key: 'Tab / Shift + Tab', desc: 'Move to next / previous cell' },
    { key: 'Delete / Backspace', desc: 'Clear active cell content' },
    { key: 'Ctrl + C', desc: 'Copy selected cell(s)' },
    { key: 'Ctrl + X', desc: 'Cut selected cell(s)' },
    { key: 'Ctrl + V', desc: 'Paste copied cell(s) with shifted formulas' },
    { key: 'Ctrl + Z / Ctrl + Y', desc: 'Undo / Redo edit history' },
    { key: 'Ctrl + F / Ctrl + H', desc: 'Open Search & Replace dialog' },
    { key: 'Home / End', desc: 'Jump to start / end of row' },
    { key: 'Esc', desc: 'Cancel cell editing' },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0D1117] border border-[#00E5FF]/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 font-mono text-xs text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Keyboard className="w-5 h-5 text-[#00E5FF]" />
          <span className="font-bold text-sm uppercase tracking-wider text-[#00E5FF]">Excel Keyboard Shortcuts</span>
        </div>

        <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded bg-[#05070B] border border-slate-800">
              <span className="text-slate-300 font-semibold">{sc.desc}</span>
              <kbd className="px-2 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 font-bold text-[10px]">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
