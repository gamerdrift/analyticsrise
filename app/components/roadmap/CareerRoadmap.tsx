'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Lock,
  ArrowRight,
  BookOpen,
  Award,
  Terminal,
  Database,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

export interface MilestoneNode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tool: 'Excel' | 'SQL' | 'Power BI' | 'Tableau' | 'Python' | 'Project' | 'Exam';
  status: 'completed' | 'in-progress' | 'locked';
  xpReward: number;
  estimatedHours: number;
  skills: string[];
  actionHref?: string;
}

export interface CareerPath {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  nodes: MilestoneNode[];
}

export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'data-analyst',
    title: 'Data Analyst Core Track',
    subtitle: 'From SQL & Excel to Business Reporting',
    badge: 'RECOMMENDED',
    description: 'Master relational SQL databases, advanced Excel spreadsheet modeling, and business reporting tools.',
    nodes: [
      {
        id: 'node-1',
        title: 'SQL Relational Fundamentals',
        subtitle: 'SELECT, WHERE, ORDER BY & Aggregates',
        description: 'Understand database schema structures, write SQL SELECT queries, and summarize business transactions.',
        tool: 'SQL',
        status: 'completed',
        xpReward: 200,
        estimatedHours: 8,
        skills: ['SQL Select', 'Database Schemas', 'Filtering', 'Grouping'],
        actionHref: '/simulators/sql',
      },
      {
        id: 'node-2',
        title: 'Multi-Table Relational JOINs',
        subtitle: 'INNER, LEFT, RIGHT & Full Outer JOINs',
        description: 'Connect disparate relational tables in Snowflake & SQL Server to answer complex business questions.',
        tool: 'SQL',
        status: 'in-progress',
        xpReward: 300,
        estimatedHours: 12,
        skills: ['INNER JOIN', 'LEFT JOIN', 'Key Mapping', 'Window Functions'],
        actionHref: '/simulators/sql',
      },
      {
        id: 'node-3',
        title: 'Advanced Excel & Pivot Modeling',
        subtitle: 'XLOOKUP, INDEX/MATCH & Dynamic Arrays',
        description: 'Construct automated financial statement sheets and multi-criteria lookup matrices.',
        tool: 'Excel',
        status: 'locked',
        xpReward: 250,
        estimatedHours: 10,
        skills: ['XLOOKUP', 'Pivot Tables', 'Nested IFs', 'Conditional Formatting'],
        actionHref: '/simulators/excel',
      },
      {
        id: 'node-4',
        title: 'Power BI Dashboard Architecture',
        subtitle: 'DAX Measures & Star Schema Modeling',
        description: 'Design interactive corporate dashboards with cross-filtering, slicers, and DAX time-intelligence.',
        tool: 'Power BI',
        status: 'locked',
        xpReward: 400,
        estimatedHours: 15,
        skills: ['DAX', 'Star Schema', 'Power Query', 'Time Intelligence'],
        actionHref: '/simulators/powerbi',
      },
      {
        id: 'node-5',
        title: 'Capstone: E-Commerce Churn Analysis',
        subtitle: 'End-to-End Enterprise Project',
        description: 'Synthesize SQL queries, Excel financial projections, and Power BI dashboards into a executive deck.',
        tool: 'Project',
        status: 'locked',
        xpReward: 500,
        estimatedHours: 20,
        skills: ['Executive Reporting', 'Cohort Analysis', 'Data Storytelling'],
        actionHref: '/unified-workspace',
      },
    ],
  },
  {
    id: 'bi-architect',
    title: 'BI Solutions Architect',
    subtitle: 'Advanced DAX & Tableau LOD Formulations',
    badge: 'SPECIALIST',
    description: 'Design enterprise data warehouse semantic layers and multi-dashboard executive books in Power BI & Tableau.',
    nodes: [
      {
        id: 'bi-1',
        title: 'Advanced DAX Modeling',
        subtitle: 'CALCULATE, FILTER & EARLIER Functions',
        description: 'Formulate complex business metrics and dynamic context transitions in Power BI Desktop.',
        tool: 'Power BI',
        status: 'completed',
        xpReward: 350,
        estimatedHours: 12,
        skills: ['DAX CALCULATE', 'Filter Context', 'Row Context'],
        actionHref: '/simulators/powerbi',
      },
      {
        id: 'bi-2',
        title: 'Tableau Visual Analytics & LODs',
        subtitle: 'FIXED, INCLUDE & EXCLUDE Calculations',
        description: 'Create advanced analytical distributions, scatter parameters, and Level of Detail expressions.',
        tool: 'Tableau',
        status: 'in-progress',
        xpReward: 400,
        estimatedHours: 14,
        skills: ['Tableau LOD', 'Parameters', 'Dual Axis Charts'],
        actionHref: '/simulators/tableau',
      },
      {
        id: 'bi-3',
        title: 'Data Warehouse Architecture',
        subtitle: 'Snowflake & Star Schema Topologies',
        description: 'Structure fact tables, dimension tables, and slowly changing dimensions (SCD Type 2).',
        tool: 'SQL',
        status: 'locked',
        xpReward: 450,
        estimatedHours: 16,
        skills: ['Star Schema', 'SCD Type 2', 'Data Vault'],
        actionHref: '/simulators/sql',
      },
    ],
  },
  {
    id: 'python-data-science',
    title: 'Python Data Science Track',
    subtitle: 'Pandas, NumPy & Machine Learning Pipelines',
    badge: 'EXPERT',
    description: 'Transform raw data into automated machine learning pipelines with Pandas DataFrames and Scikit-Learn.',
    nodes: [
      {
        id: 'py-1',
        title: 'Pandas Data Cleaning & Aggregations',
        subtitle: 'DataFrames, GroupBy & Pivot Tables',
        description: 'Import CSV/Parquet files, clean null values, and apply vector calculations.',
        tool: 'Python',
        status: 'completed',
        xpReward: 300,
        estimatedHours: 10,
        skills: ['Pandas', 'NumPy', 'Data Cleaning', 'GroupBy'],
        actionHref: '/python-lab',
      },
      {
        id: 'py-2',
        title: 'Exploratory Data Analysis (EDA)',
        subtitle: 'Seaborn & Matplotlib Visualization',
        description: 'Plot distribution histograms, correlation heatmaps, and outlier box plots.',
        tool: 'Python',
        status: 'in-progress',
        xpReward: 350,
        estimatedHours: 12,
        skills: ['Seaborn', 'Matplotlib', 'EDA', 'Statistical Analysis'],
        actionHref: '/python-lab',
      },
      {
        id: 'py-3',
        title: 'Predictive ML Modeling',
        subtitle: 'Scikit-Learn Regression & Classification',
        description: 'Build predictive customer churn models using Random Forests and Logistic Regression.',
        tool: 'Python',
        status: 'locked',
        xpReward: 500,
        estimatedHours: 18,
        skills: ['Scikit-Learn', 'Random Forest', 'ROC-AUC', 'Cross-Validation'],
        actionHref: '/python-lab',
      },
    ],
  },
];

export interface CareerRoadmapProps {
  compact?: boolean;
  className?: string;
}

export default function CareerRoadmap({ compact = false, className = '' }: CareerRoadmapProps) {
  const [selectedPathId, setSelectedPathId] = useState<string>('data-analyst');
  const [activeNodeId, setActiveNodeId] = useState<string | null>('node-2');

  const currentPath = CAREER_PATHS.find((p) => p.id === selectedPathId) || CAREER_PATHS[0];
  const completedNodesCount = currentPath.nodes.filter((n) => n.status === 'completed').length;
  const progressPercent = Math.round((completedNodesCount / currentPath.nodes.length) * 100);

  return (
    <div className={`glass-panel p-6 rounded-2xl border border-[#00E5FF]/20 bg-[#0D1117]/80 ${className}`}>
      {/* Path Selector Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#00E5FF] uppercase tracking-widest px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20">
              {currentPath.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono">Roadmap Telemetry</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider mt-1">
            {currentPath.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{currentPath.description}</p>
        </div>

        {/* Path Switcher Dropdown */}
        <div className="relative w-full md:w-auto">
          <select
            value={selectedPathId}
            onChange={(e) => setSelectedPathId(e.target.value)}
            className="w-full md:w-64 bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF] appearance-none cursor-pointer"
          >
            {CAREER_PATHS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="py-4 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-slate-400">Path Completion:</span>
          <span className="font-bold text-[#00E5FF]">{progressPercent}%</span>
          <div className="w-32 sm:w-48 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="text-slate-400 text-[11px]">
          {completedNodesCount} of {currentPath.nodes.length} Milestones Cleared
        </div>
      </div>

      {/* Roadmap Timeline Nodes */}
      <div className="mt-6 relative">
        {/* Connecting Line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#00E5FF] via-[#00E5FF]/40 to-slate-800 pointer-events-none" />

        <div className="space-y-6">
          {currentPath.nodes.map((node, index) => {
            const isCompleted = node.status === 'completed';
            const isInProgress = node.status === 'in-progress';
            const isLocked = node.status === 'locked';
            const isSelected = activeNodeId === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                className={`relative pl-14 p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#161B22] border-[#00E5FF] shadow-lg shadow-[#00E5FF]/10'
                    : isCompleted
                    ? 'bg-[#0D1117]/60 border-emerald-500/30 hover:border-emerald-500/60'
                    : isInProgress
                    ? 'bg-[#0D1117]/90 border-[#00E5FF]/40 hover:border-[#00E5FF]'
                    : 'bg-[#05070B]/50 border-white/5 opacity-65 hover:opacity-100'
                }`}
              >
                {/* Node Status Indicator Badge on Timeline */}
                <div
                  className={`absolute left-3.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-black border-emerald-400'
                      : isInProgress
                      ? 'bg-[#00E5FF] text-black border-[#00E5FF] animate-pulse'
                      : 'bg-[#05070B] text-slate-500 border-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isInProgress ? (
                    <Sparkles className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] font-bold">
                        Step 0{index + 1} • {node.tool}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isInProgress
                            ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {node.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-display uppercase tracking-wide mt-1">
                      {node.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{node.description}</p>
                  </div>

                  {/* Right side stats & action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right font-mono text-[10px] text-slate-400 hidden md:block">
                      <span className="block text-[#00E5FF] font-bold">+{node.xpReward} XP</span>
                      <span>~{node.estimatedHours} hrs</span>
                    </div>

                    {node.actionHref && !isLocked && (
                      <Link href={node.actionHref}>
                        <button className="px-3.5 py-1.5 rounded bg-[#00E5FF] text-black text-xs font-bold font-mono tracking-wider uppercase hover:bg-[#4FC3F7] transition-all flex items-center gap-1.5 shadow-md">
                          <span>{isCompleted ? 'Review' : 'Start'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Expanded Skill Chips */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mr-1">
                      Acquired Skills:
                    </span>
                    {node.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
