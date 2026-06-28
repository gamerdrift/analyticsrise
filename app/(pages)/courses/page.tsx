'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

const COURSES_DATA = [
  {
    id: 'excel-01',
    title: 'Financial Modeling & Business Analysis in Excel',
    category: 'Spreadsheets',
    level: 'Beginner to Advanced',
    duration: '12 Hours',
    rating: 4.8,
    enrollment: 'Active',
    progress: 75,
    modulesCount: 5,
    lessons: [
      { name: 'Workbook Structures & Reference Styles', duration: '45m' },
      { name: 'Advanced Lookup Mechanics (XLOOKUP, INDEX/MATCH)', duration: '1h 15m' },
      { name: 'Financial Statement Formulas & Ratios', duration: '1h 30m' },
      { name: 'Sensitivity & Scenario Tables', duration: '2h' },
      { name: 'Interactive Dashboards & Custom Charting', duration: '1h 45m' }
    ]
  },
  {
    id: 'sql-01',
    title: 'Relational Database Querying & SQL Optimization',
    category: 'SQL Databases',
    level: 'Intermediate',
    duration: '18 Hours',
    rating: 4.9,
    enrollment: 'Active',
    progress: 40,
    modulesCount: 6,
    lessons: [
      { name: 'Database Fundamentals & SELECT syntax', duration: '1h' },
      { name: 'Aggregate Functions & GROUP BY filters', duration: '1h 30m' },
      { name: 'Multi-table Joins (INNER, LEFT, RIGHT, FULL)', duration: '2h' },
      { name: 'Subqueries & CTE Expressions', duration: '2h 30m' },
      { name: 'Analytical Window Functions', duration: '3h' },
      { name: 'Index Structures & Query Performance Tuning', duration: '2h' }
    ]
  },
  {
    id: 'powerbi-01',
    title: 'Enterprise Business Intelligence with Power BI',
    category: 'Business Intelligence',
    level: 'Advanced',
    duration: '15 Hours',
    rating: 4.7,
    enrollment: 'Active',
    progress: 10,
    modulesCount: 4,
    lessons: [
      { name: 'Data Modeling & Star Schema Configurations', duration: '2h' },
      { name: 'DAX Formulas (CALCULATE, FILTER, Time Intelligence)', duration: '4h' },
      { name: 'Advanced Visual Layouts & Custom Charts', duration: '3h' },
      { name: 'Power BI Service Administration & Publishing', duration: '2h' }
    ]
  },
  {
    id: 'tableau-01',
    title: 'Tableau Visual Analytics & Level of Detail (LOD)',
    category: 'Business Intelligence',
    level: 'Intermediate',
    duration: '10 Hours',
    rating: 4.8,
    enrollment: 'Not Enrolled',
    progress: 0,
    modulesCount: 3,
    lessons: [
      { name: 'Workbook Mechanics & Dimensions vs Measures', duration: '1h 30m' },
      { name: 'Advanced Mapping & Dual Axis Visualizations', duration: '2h 15m' },
      { name: 'Level of Detail (LOD) Expressions & Filters', duration: '3h' }
    ]
  },
  {
    id: 'python-01',
    title: 'Python Pandas & Seaborn for Data Analysis',
    category: 'Programming',
    level: 'Advanced',
    duration: '22 Hours',
    rating: 4.9,
    enrollment: 'Not Enrolled',
    progress: 0,
    modulesCount: 8,
    lessons: [
      { name: 'Introduction to Jupyter & NumPy arrays', duration: '1h 45m' },
      { name: 'Data Manipulation using Pandas DataFrames', duration: '3h' },
      { name: 'Data Cleaning & Outlier Management', duration: '2h 30m' },
      { name: 'Statistical Plotting using Seaborn & Matplotlib', duration: '3h' }
    ]
  }
];

export default function Courses() {
  const [filter, setFilter] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<typeof COURSES_DATA[0] | null>(null);

  const categories = ['All', 'Spreadsheets', 'SQL Databases', 'Business Intelligence', 'Programming'];

  const filteredCourses = filter === 'All' 
    ? COURSES_DATA 
    : COURSES_DATA.filter(c => c.category === filter);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Platform Catalog</span>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
          CURRICULUM DIRECTORY
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Select a learning path below to view modules, syllabus details, and active progress telemetry.
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/5 font-mono text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
              filter === cat
                ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white font-bold'
                : 'border-white/5 bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main Grid: Courses + Selected outline details */}
      <div className="grid xl:grid-cols-3 gap-8">
        
        {/* Course Cards */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <div 
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`glass-panel glass-panel-hover p-6 cursor-pointer flex flex-col justify-between transition-all ${
                  selectedCourse?.id === course.id 
                    ? 'border-[#00E5FF] shadow-lg shadow-[#00E5FF]/5' 
                    : ''
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-0.5 text-[9px] font-mono bg-white/5 rounded border border-white/5 text-[#00E5FF]">
                      {course.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{course.duration}</span>
                  </div>

                  <h3 className="text-md font-bold text-white font-display uppercase tracking-wide leading-snug">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-400 font-mono">
                    <span className="text-amber-400 font-bold">★ {course.rating}</span>
                    <span>•</span>
                    <span>{course.level}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  {course.enrollment === 'Active' ? (
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                        <span>Progress</span>
                        <span className="text-white">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-4">
                        <div className="bg-[#00E5FF] h-full" style={{ width: `${course.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider block">
                        Active Sandbox Enrolled
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider block">
                      Enrollment Uninitialized
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Detail Side Panel */}
        <div className="xl:col-span-1">
          <AnimatePresence mode="wait">
            {selectedCourse ? (
              <motion.div 
                key={selectedCourse.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-panel p-6 bg-[#090D14]/90 border border-[#00E5FF]/20 sticky top-6"
              >
                <span className="text-[10px] text-[#00E5FF] font-mono tracking-widest block uppercase mb-1">
                  Active Syllabus Outline
                </span>
                <h2 className="text-lg font-bold text-white font-display uppercase tracking-wide border-b border-white/5 pb-3">
                  {selectedCourse.title}
                </h2>

                <div className="space-y-4 my-6 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modules:</span>
                    <span className="text-white">{selectedCourse.modulesCount} Core Modules</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Certificate:</span>
                    <span className="text-white">AR Verified Badge</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Prerequisites:</span>
                    <span className="text-white">None</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block mb-2">Lesson Breakdown:</span>
                  {selectedCourse.lessons.map((lesson, idx) => (
                    <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[200px]">{lesson.name}</span>
                      <span className="text-slate-500 font-mono text-[10px]">{lesson.duration}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  {selectedCourse.enrollment === 'Active' ? (
                    <Link 
                      href={
                        selectedCourse.id === 'excel-01' ? '/simulators/excel' :
                        selectedCourse.id === 'sql-01' ? '/simulators/sql' :
                        selectedCourse.id === 'powerbi-01' ? '/simulators/powerbi' :
                        selectedCourse.id === 'tableau-01' ? '/simulators/tableau' : '/simulators/excel'
                      }
                      className="w-full py-3 block text-center cyber-button text-xs font-bold tracking-widest"
                    >
                      ENTER SIMULATOR LAB
                    </Link>
                  ) : (
                    <button 
                      onClick={() => {
                        selectedCourse.enrollment = 'Active';
                        setSelectedCourse({ ...selectedCourse, enrollment: 'Active' });
                      }}
                      className="w-full py-3 cyber-button text-xs font-bold tracking-widest"
                    >
                      INITIALIZE LEARNING PATH
                    </button>
                  )}
                </div>

              </motion.div>
            ) : (
              <div className="glass-panel p-8 text-center text-slate-500 font-mono flex-center flex-col h-64">
                <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs leading-relaxed">Select a curriculum card to load syllabus roadmap details.</span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </DashboardLayout>
  );
}
