'use client';

import React, { useState } from 'react';
import {
  resumeService,
  INITIAL_RESUME_DATA,
  ResumeData,
  AtsScoreResult,
} from '@/lib/services/resumeService';
import {
  FileText,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Wand2,
  Save,
  Printer,
  FileCode,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function ResumeStudio() {
  const [resume, setResume] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [atsResult, setAtsResult] = useState<AtsScoreResult>(
    resumeService.evaluateAtsScore(INITIAL_RESUME_DATA)
  );
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleUpdate = (updated: ResumeData) => {
    setResume(updated);
    setAtsResult(resumeService.evaluateAtsScore(updated));
  };

  const handleSave = () => {
    setResume((prev) => ({ ...prev, lastSaved: new Date().toISOString(), version: prev.version + 1 }));
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleAiSummary = async () => {
    setIsAiGenerating(true);
    const summary = await resumeService.generateAiSummary(resume.targetRole, resume.skills);
    handleUpdate({ ...resume, summary });
    setIsAiGenerating(false);
  };

  const handleEnhanceBullet = async (expIndex: number, bulletIndex: number) => {
    const targetBullet = resume.experience[expIndex].bullets[bulletIndex];
    const enhanced = await resumeService.enhanceBulletPoint(targetBullet);
    const newExp = [...resume.experience];
    newExp[expIndex].bullets[bulletIndex] = enhanced;
    handleUpdate({ ...resume, experience: newExp });
  };

  const handleAddSkill = () => {
    handleUpdate({
      ...resume,
      skills: [...resume.skills, { name: 'New Analytics Skill', category: 'technical', level: 'Intermediate' }],
    });
  };

  const handleRemoveSkill = (index: number) => {
    const updated = resume.skills.filter((_, i) => i !== index);
    handleUpdate({ ...resume, skills: updated });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed top-20 right-8 z-50 px-4 py-2.5 rounded-lg bg-emerald-500 text-black font-bold font-mono text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> Resume saved to cloud version v{resume.version}!
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-[10px] font-mono font-bold uppercase tracking-widest">
              ATS RESUME STUDIO
            </span>
            <span className="text-xs text-slate-400 font-mono">v{resume.version} • AutoSave</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white uppercase tracking-wide mt-1">
            AI RESUME BUILDER & ATS OPTIMIZER
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-slate-300 font-mono text-xs font-bold uppercase hover:bg-slate-700 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-[#00E5FF]" /> Save Draft
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-[#00E5FF] text-black font-mono text-xs font-bold uppercase hover:bg-[#4FC3F7] transition-all flex items-center gap-1.5 shadow-lg shadow-[#00E5FF]/20"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Grid: Editor Left (2 cols), Live Preview Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* ATS Score Gauge Card */}
          <div className="glass-panel p-5 rounded-xl border border-[#00E5FF]/30 bg-[#0D1117]/90 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                ATS Compatibility Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-display text-[#00E5FF]">
                  {atsResult.score}/100
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  [{atsResult.qualityRating}]
                </span>
              </div>
            </div>

            <div className="w-44 h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00E5FF] to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${atsResult.score}%` }}
              />
            </div>
          </div>

          {/* Target Role & Personal Information */}
          <div className="glass-panel p-6 rounded-xl border border-white/10 bg-[#0D1117]/80 space-y-4">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00E5FF]" /> Target Role & Header Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">Target Analytics Role</label>
                <input
                  type="text"
                  value={resume.targetRole}
                  onChange={(e) => handleUpdate({ ...resume, targetRole: e.target.value })}
                  className="w-full bg-[#05070B] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={resume.personalInfo.fullName}
                  onChange={(e) =>
                    handleUpdate({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, fullName: e.target.value },
                    })
                  }
                  className="w-full bg-[#05070B] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  value={resume.personalInfo.email}
                  onChange={(e) =>
                    handleUpdate({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, email: e.target.value },
                    })
                  }
                  className="w-full bg-[#05070B] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={resume.personalInfo.phone}
                  onChange={(e) =>
                    handleUpdate({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, phone: e.target.value },
                    })
                  }
                  className="w-full bg-[#05070B] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>
          </div>

          {/* AI Professional Summary */}
          <div className="glass-panel p-6 rounded-xl border border-white/10 bg-[#0D1117]/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                Professional Summary
              </h3>
              <button
                onClick={handleAiSummary}
                disabled={isAiGenerating}
                className="px-3 py-1 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-[10px] font-mono font-bold uppercase hover:bg-[#00E5FF]/20 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#00E5FF]" /> {isAiGenerating ? 'Generating...' : 'AI Enhance'}
              </button>
            </div>

            <textarea
              value={resume.summary}
              onChange={(e) => handleUpdate({ ...resume, summary: e.target.value })}
              rows={4}
              className="w-full bg-[#05070B] border border-white/10 rounded p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          {/* Skills Management */}
          <div className="glass-panel p-6 rounded-xl border border-white/10 bg-[#0D1117]/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                Technical & Tool Skills ({resume.skills.length})
              </h3>
              <button
                onClick={handleAddSkill}
                className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-[10px] font-mono font-bold uppercase hover:bg-slate-700 transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Skill
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resume.skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#05070B] p-2 rounded border border-white/5">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => {
                      const updated = [...resume.skills];
                      updated[idx].name = e.target.value;
                      handleUpdate({ ...resume, skills: updated });
                    }}
                    className="flex-1 bg-transparent border-none text-xs font-mono text-white focus:outline-none"
                  />
                  <button
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience Bullets & AI Optimization */}
          <div className="glass-panel p-6 rounded-xl border border-white/10 bg-[#0D1117]/80 space-y-4">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
              Work Experience & AI Bullet Optimizer
            </h3>

            {resume.experience.map((exp, expIdx) => (
              <div key={exp.id} className="p-4 rounded bg-[#05070B] border border-white/5 space-y-3 font-mono text-xs">
                <div className="flex justify-between font-bold text-white">
                  <span>{exp.role} @ {exp.company}</span>
                  <span className="text-slate-500 text-[10px]">{exp.startDate} - {exp.endDate}</span>
                </div>

                <div className="space-y-2">
                  {exp.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <textarea
                        value={bullet}
                        onChange={(e) => {
                          const updatedExp = [...resume.experience];
                          updatedExp[expIdx].bullets[bIdx] = e.target.value;
                          handleUpdate({ ...resume, experience: updatedExp });
                        }}
                        rows={2}
                        className="flex-1 bg-[#0D1117] border border-white/10 rounded p-2 text-slate-300 text-[11px] focus:outline-none focus:border-[#00E5FF]"
                      />
                      <button
                        onClick={() => handleEnhanceBullet(expIdx, bIdx)}
                        className="px-2 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-bold uppercase hover:bg-[#00E5FF]/20 transition-all shrink-0 flex items-center gap-1"
                        title="AI Quantifiable Enhancement"
                      >
                        <Wand2 className="w-3 h-3" /> AI Boost
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Live ATS Render Preview
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                A4 Printable Layout
              </span>
            </div>

            {/* A4 Resume Preview Box */}
            <div className="p-6 rounded-xl bg-white text-slate-900 shadow-2xl font-sans text-xs space-y-4 border border-slate-200 min-h-[600px]">
              {/* Header */}
              <div className="border-b border-slate-300 pb-3 text-center">
                <h2 className="text-xl font-bold uppercase text-slate-900 tracking-wide">
                  {resume.personalInfo.fullName}
                </h2>
                <p className="text-[11px] text-[#008891] font-bold uppercase tracking-wider mt-0.5">
                  {resume.targetRole}
                </p>
                <div className="text-[9px] text-slate-600 flex flex-wrap justify-center gap-3 mt-1.5">
                  <span>{resume.personalInfo.email}</span>
                  <span>{resume.personalInfo.phone}</span>
                  <span>{resume.personalInfo.location}</span>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1.5">
                  Professional Summary
                </h4>
                <p className="text-[10px] text-slate-700 leading-snug">{resume.summary}</p>
              </div>

              {/* Technical Skills */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1.5">
                  Skills & Tools
                </h4>
                <p className="text-[10px] text-slate-700 leading-relaxed font-mono">
                  {resume.skills.map((s) => s.name).join(' • ')}
                </p>
              </div>

              {/* Experience */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1.5">
                  Work Experience
                </h4>
                {resume.experience.map((e) => (
                  <div key={e.id} className="mb-2">
                    <div className="flex justify-between font-bold text-[10px]">
                      <span>{e.role} — {e.company}</span>
                      <span className="text-slate-500">{e.startDate} - {e.endDate}</span>
                    </div>
                    <ul className="list-disc pl-4 text-[9px] text-slate-700 space-y-0.5 mt-1">
                      {e.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1.5">
                  Certifications & Credentials
                </h4>
                <ul className="list-disc pl-4 text-[9px] text-slate-700 space-y-0.5">
                  {resume.certifications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
