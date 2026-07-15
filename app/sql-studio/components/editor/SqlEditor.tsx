"use client";
import React from 'react';

export default function SqlEditor() {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <textarea
        className="w-full h-64 p-2 bg-gray-900 text-gray-100 font-mono rounded"
        placeholder="Write your SQL query here..."
        rows={10}
      />
    </div>
  );
}
