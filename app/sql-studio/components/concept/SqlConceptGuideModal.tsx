'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Terminal, Database, Table, Sparkles, CheckCircle2, ArrowRight, X, Layers, Code, Play } from 'lucide-react';
import { useSqlStudio } from '@/app/sql-studio/contexts/SqlStudioContext';

interface SqlConceptGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SqlConceptGuideModal({ isOpen, onClose }: SqlConceptGuideModalProps) {
  const { dispatch } = useSqlStudio();
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);

  if (!isOpen) return null;

  const concepts = [
    {
      id: 'what-is-sql',
      title: '1. What is SQL & Relational Data?',
      subtitle: 'Structured Query Language fundamentals',
      icon: <Database className="w-5 h-5 text-[#00E5FF]" />,
      summary:
        'SQL (Structured Query Language) is the global standard for asking questions of structured databases. Instead of browsing files manually, you write declarative instructions telling the database what data you want.',
      points: [
        'Database: A container of organized tables.',
        'Table: A structured grid representing an entity (e.g. Products, Orders, Customers).',
        'Row (Record): A single instance of an item in a table.',
        'Column (Field): A specific attribute (e.g. name, price, status, created_at).',
      ],
      sampleQuery: '-- View all columns from the products table\nSELECT *\nFROM products;',
      explanation: 'The asterisk (*) means "select all columns". FROM specifies which table to read.',
    },
    {
      id: 'select-projections',
      title: '2. Choosing Specific Columns (SELECT)',
      subtitle: 'Retrieve only the data you need',
      icon: <Table className="w-5 h-5 text-[#4FC3F7]" />,
      summary:
        'In production, retrieving every column with * is inefficient. You should specify exact column names separated by commas.',
      points: [
        'List target columns immediately after SELECT.',
        'Columns are returned in the exact order you specify.',
        'Use aliases (AS) to rename output columns for clarity.',
      ],
      sampleQuery: 'SELECT name, price, category_id\nFROM products;',
      explanation: 'Returns a clean 3-column table containing name, price, and category_id.',
    },
    {
      id: 'where-filtering',
      title: '3. Filtering Rows with WHERE',
      subtitle: 'Target specific subsets of records',
      icon: <Terminal className="w-5 h-5 text-emerald-400" />,
      summary:
        'The WHERE clause filters rows before they are returned. Only rows meeting your condition are included in the result.',
      points: [
        'Comparison operators: =, !=, <, >, <=, >=',
        'Combine conditions using AND, OR, and NOT.',
        'Text values are wrapped in single quotes (e.g. status = \'active\').',
      ],
      sampleQuery: 'SELECT name, price\nFROM products\nWHERE price > 100\n  AND category_id = 2;',
      explanation: 'Finds products priced over 100 in category 2.',
    },
    {
      id: 'aggregations-grouping',
      title: '4. Aggregates & GROUP BY',
      subtitle: 'Summarize metrics across groups',
      icon: <Layers className="w-5 h-5 text-amber-400" />,
      summary:
        'Aggregate functions calculate metrics across multiple rows. Use GROUP BY to calculate metrics per category, user, or date.',
      points: [
        'COUNT(*): Number of rows.',
        'SUM(column): Total numeric sum.',
        'AVG(column): Average mean value.',
        'MIN() / MAX(): Lowest and highest values.',
      ],
      sampleQuery: 'SELECT category_id, COUNT(*) AS product_count, AVG(price) AS avg_price\nFROM products\nGROUP BY category_id;',
      explanation: 'Calculates the total items and average price for each category.',
    },
    {
      id: 'joins-relational',
      title: '5. Joining Related Tables (JOIN)',
      subtitle: 'Connect data across relationships',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      summary:
        'Relational databases store data in separate normalized tables. JOIN connects rows from two tables using a common key.',
      points: [
        'INNER JOIN: Returns rows that match in both tables.',
        'LEFT JOIN: Returns all rows from the left table and matching rows from the right.',
        'ON clause specifies the shared key (e.g. orders.customer_id = customers.id).',
      ],
      sampleQuery: 'SELECT orders.order_id, customers.name, orders.total_amount\nFROM orders\nJOIN customers ON orders.customer_id = customers.id;',
      explanation: 'Combines order records with the corresponding customer names.',
    },
  ];

  const currentConcept = concepts[activeConceptIndex];

  const handleTryInEditor = (query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-[#090D16] border border-[#00E5FF]/40 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-[#06080E] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black font-display text-white uppercase tracking-wider">
                  SQL Concept Guide for Beginners
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Step 01 of the AnalyticsRise Learning Architecture
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Tabs + Concept Viewer */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Nav List */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-[#070A12] p-3 space-y-1 overflow-y-auto shrink-0 custom-scrollbar">
              {concepts.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConceptIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2.5 ${
                    activeConceptIndex === idx
                      ? 'bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-white font-bold shadow-md shadow-[#00E5FF]/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="shrink-0">{c.icon}</div>
                  <span className="truncate">{c.title}</span>
                </button>
              ))}
            </div>

            {/* Right Concept Content Panel */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-[#090D16]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-[#00E5FF] uppercase font-bold tracking-widest">
                    CONCEPT {activeConceptIndex + 1} OF {concepts.length}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white font-display uppercase tracking-wide mb-2">
                  {currentConcept.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {currentConcept.summary}
                </p>
              </div>

              {/* Bullet Points */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                  Key Principles:
                </span>
                {currentConcept.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-300 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              {/* Sample SQL Box */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                    Example Query Blueprint:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTryInEditor(currentConcept.sampleQuery)}
                    className="text-[10px] font-mono text-[#00E5FF] hover:text-white uppercase font-bold flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-3 h-3" /> Load in SQL Editor
                  </button>
                </div>

                <pre className="p-3.5 bg-[#05070B] border border-white/10 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                  <code>{currentConcept.sampleQuery}</code>
                </pre>

                <p className="text-xs text-slate-400 font-mono italic">
                  💡 {currentConcept.explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-[#06080E] border-t border-white/10 flex items-center justify-between shrink-0">
            <button
              type="button"
              disabled={activeConceptIndex === 0}
              onClick={() => setActiveConceptIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-mono text-slate-300 transition-colors"
            >
              Previous Concept
            </button>

            <div className="flex items-center gap-3">
              {activeConceptIndex < concepts.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveConceptIndex((prev) => Math.min(concepts.length - 1, prev + 1))}
                  className="px-5 py-2 rounded-xl bg-[#00E5FF] hover:bg-[#4FC3F7] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <span>Next Concept</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-[#00E5FF] hover:bg-[#4FC3F7] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Start Practicing →
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
