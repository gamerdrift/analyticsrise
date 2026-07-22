'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import {
  BookOpen,
  Database,
  Users,
  Award,
  BarChart3,
  ShieldCheck,
  Search,
  Plus,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Eye,
  Trash2,
  Edit,
} from 'lucide-react';

type AdminTab = 'analytics' | 'courses' | 'datasets' | 'users' | 'certificates';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [searchUserQuery, setSearchUserQuery] = useState('');

  // Mock Admin Data
  const [courses, setCourses] = useState([
    { id: 'c-101', name: 'SQL Relational Multi-Table JOINs', track: 'SQL', enrolled: 1420, completionRate: '78%', status: 'Active' },
    { id: 'c-102', name: 'Advanced Excel & Pivot Table Modeling', track: 'Excel', enrolled: 2150, completionRate: '84%', status: 'Active' },
    { id: 'c-103', name: 'Power BI DAX & Star Schemas', track: 'Power BI', enrolled: 980, completionRate: '65%', status: 'Active' },
    { id: 'c-104', name: 'Tableau Visual Analytics & LODs', track: 'Tableau', enrolled: 760, completionRate: '59%', status: 'Draft' },
    { id: 'c-105', name: 'Pandas Data Wrangling & Pipelines', track: 'Python', enrolled: 1120, completionRate: '71%', status: 'Active' },
  ]);

  const [datasets, setDatasets] = useState([
    { id: 'd-201', name: 'E-Commerce Transactions 2026', rows: '1,428,290', size: '14.2 MB', downloads: 3420, format: 'CSV/Parquet' },
    { id: 'd-202', name: 'SaaS Customer Subscription Churn', rows: '84,100', size: '2.8 MB', downloads: 1890, format: 'SQL Dump' },
    { id: 'd-203', name: 'Global Logistics Supply Chain Coordinates', rows: '412,000', size: '8.4 MB', downloads: 950, format: 'XLSX' },
  ]);

  const [users, setUsers] = useState([
    { uid: 'usr_01', name: 'Alex Rivera', email: 'alex.rivera@example.com', role: 'student', xp: 1850, streak: 7, status: 'Active' },
    { uid: 'usr_02', name: 'Sarah Chen', email: 'sarah.chen@analyticsrise.com', role: 'instructor', xp: 5400, streak: 21, status: 'Active' },
    { uid: 'usr_03', name: 'Marcus Vance', email: 'marcus.v@example.com', role: 'student', xp: 920, streak: 3, status: 'Active' },
    { uid: 'usr_04', name: 'Elena Rostova', email: 'elena.r@enterprise.org', role: 'enterprise', xp: 3100, streak: 14, status: 'Active' },
  ]);

  const [certificates, setCertificates] = useState([
    { id: 'cert_8921', user: 'Alex Rivera', course: 'SQL Relational Specialist', issueDate: '2026-07-20', hash: 'sha256-8a3b218f26a117b9b7a38b55c689d12', status: 'Verified' },
    { id: 'cert_8922', user: 'Elena Rostova', course: 'Power BI DAX Architect', issueDate: '2026-07-18', hash: 'sha256-4c9d128a34b219c8f0a21e44a9821d33', status: 'Verified' },
    { id: 'cert_8923', user: 'Marcus Vance', course: 'Excel Financial Modeling', issueDate: '2026-07-15', hash: 'sha256-1f9e882a77c34b12d9081e22f3491c10', status: 'Verified' },
  ]);

  const filteredUsers = searchUserQuery
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchUserQuery.toLowerCase())
      )
    : users;

  const handleRoleChange = (uid: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, role: newRole as any } : u))
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto font-sans">
        {/* Console Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                SYSTEM ADMIN CONSOLE
              </span>
              <span className="text-xs text-slate-400 font-mono">Control Center v6.0</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white font-display uppercase tracking-wide mt-1">
              ADMINISTRATION & TELEMETRY CONTROL
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Manage platform courses, datasets, user authorizations, cryptographic certificates, and system uptime.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3.5 py-2 rounded bg-slate-800 border border-white/10 text-slate-300 text-xs font-mono font-bold uppercase hover:bg-slate-700 transition-colors flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Sync Telemetry
            </button>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" /> Analytics Overview
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('datasets')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'datasets'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" /> Datasets ({datasets.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'certificates'
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20'
                : 'bg-[#0D1117] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" /> Certificates ({certificates.length})
          </button>
        </div>

        {/* ─── TAB 1: ANALYTICS OVERVIEW ────────────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#0D1117]/80">
                <span className="text-[10px] text-slate-500 font-mono uppercase">System Uptime</span>
                <span className="text-2xl font-bold font-display text-[#00E5FF] mt-2 block">99.98%</span>
                <span className="text-[10px] text-emerald-400 font-mono">0 incidents in 30 days</span>
              </div>
              <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#0D1117]/80">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Active Simulators</span>
                <span className="text-2xl font-bold font-display text-white mt-2 block">1,402 Sessions</span>
                <span className="text-[10px] text-slate-400 font-mono">SQL: 62% • Excel: 24%</span>
              </div>
              <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#0D1117]/80">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Daily Active Users (DAU)</span>
                <span className="text-2xl font-bold font-[#00E5FF] font-display text-emerald-400 mt-2 block">12,408</span>
                <span className="text-[10px] text-emerald-400 font-mono">+14% vs previous week</span>
              </div>
              <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#0D1117]/80">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Certs Issued</span>
                <span className="text-2xl font-bold font-display text-amber-400 mt-2 block">4,289</span>
                <span className="text-[10px] text-slate-400 font-mono">Cryptographically SHA-256</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 space-y-4">
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-widest">
                Real-Time Telemetry Audit Logs
              </h3>
              <div className="font-mono text-xs text-slate-400 space-y-2.5">
                <div className="p-2.5 rounded bg-[#05070B] border border-white/5 flex justify-between">
                  <span>[15:30:19 UTC] Auth Token verified for UID: guest_98a3b8c2d1 (Role: student)</span>
                  <span className="text-emerald-400">200 OK</span>
                </div>
                <div className="p-2.5 rounded bg-[#05070B] border border-white/5 flex justify-between">
                  <span>[15:28:44 UTC] SQL Simulator pass validated for user Satoshi_Data (+150 XP)</span>
                  <span className="text-[#00E5FF]">EVENT_VERIFIED</span>
                </div>
                <div className="p-2.5 rounded bg-[#05070B] border border-white/5 flex justify-between">
                  <span>[15:25:12 UTC] Firebase static export synchronization complete (out/ 44 files)</span>
                  <span className="text-emerald-400">SYNC_SUCCESS</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: COURSES MANAGEMENT ───────────────────────────────────────────── */}
        {activeTab === 'courses' && (
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">
                Platform Course Catalog
              </h3>
              <button className="px-3.5 py-1.5 rounded bg-[#00E5FF] text-black text-xs font-mono font-bold uppercase hover:bg-[#4FC3F7] transition-all flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Course
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs text-slate-300">
                <thead className="bg-[#05070B] text-slate-500 uppercase text-[9px] tracking-widest text-left">
                  <tr>
                    <th className="p-3">Course ID</th>
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Track</th>
                    <th className="p-3 text-right">Enrolled</th>
                    <th className="p-3 text-right">Completion</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5">
                      <td className="p-3 text-slate-500">{c.id}</td>
                      <td className="p-3 font-bold text-white">{c.name}</td>
                      <td className="p-3 text-[#00E5FF]">{c.track}</td>
                      <td className="p-3 text-right">{c.enrolled.toLocaleString()}</td>
                      <td className="p-3 text-right text-emerald-400">{c.completionRate}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2 text-slate-400">
                          <button className="hover:text-white"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="hover:text-[#00E5FF]"><Edit className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 3: DATASETS MANAGEMENT ──────────────────────────────────────────── */}
        {activeTab === 'datasets' && (
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">
                Simulated Datasets Catalog
              </h3>
              <button className="px-3.5 py-1.5 rounded bg-[#00E5FF] text-black text-xs font-mono font-bold uppercase hover:bg-[#4FC3F7] transition-all flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Upload Dataset
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs text-slate-300">
                <thead className="bg-[#05070B] text-slate-500 uppercase text-[9px] tracking-widest text-left">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Dataset Name</th>
                    <th className="p-3 text-right">Rows Count</th>
                    <th className="p-3 text-right">Size</th>
                    <th className="p-3 text-right">Downloads</th>
                    <th className="p-3">Format</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {datasets.map((d) => (
                    <tr key={d.id} className="hover:bg-white/5">
                      <td className="p-3 text-slate-500">{d.id}</td>
                      <td className="p-3 font-bold text-white">{d.name}</td>
                      <td className="p-3 text-right text-[#00E5FF]">{d.rows}</td>
                      <td className="p-3 text-right">{d.size}</td>
                      <td className="p-3 text-right text-emerald-400">{d.downloads.toLocaleString()}</td>
                      <td className="p-3 text-slate-400">{d.format}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 4: USERS MANAGEMENT ──────────────────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">
                Registered Learner Accounts
              </h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search user email/name..."
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  className="w-full bg-[#05070B] border border-white/10 rounded px-3 py-1.5 pl-8 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs text-slate-300">
                <thead className="bg-[#05070B] text-slate-500 uppercase text-[9px] tracking-widest text-left">
                  <tr>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Role Authorization</th>
                    <th className="p-3 text-right">XP Points</th>
                    <th className="p-3 text-right">Streak</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => (
                    <tr key={u.uid} className="hover:bg-white/5">
                      <td className="p-3 font-bold text-white">{u.name}</td>
                      <td className="p-3 text-slate-400">{u.email}</td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                          className="bg-[#05070B] border border-white/10 rounded px-2 py-1 text-[10px] text-[#00E5FF] font-bold uppercase focus:outline-none"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </td>
                      <td className="p-3 text-right text-emerald-400 font-bold">{u.xp} XP</td>
                      <td className="p-3 text-right text-orange-400">{u.streak} Days 🔥</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 5: CERTIFICATES MANAGEMENT ──────────────────────────────────────── */}
        {activeTab === 'certificates' && (
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1117]/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">
                Cryptographic Ledger Registry
              </h3>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Ledger Node Online
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs text-slate-300">
                <thead className="bg-[#05070B] text-slate-500 uppercase text-[9px] tracking-widest text-left">
                  <tr>
                    <th className="p-3">Certificate ID</th>
                    <th className="p-3">Recipient</th>
                    <th className="p-3">Curriculum Track</th>
                    <th className="p-3">SHA-256 Hash</th>
                    <th className="p-3">Issue Date</th>
                    <th className="p-3 text-center">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-white/5">
                      <td className="p-3 text-slate-500">{cert.id}</td>
                      <td className="p-3 font-bold text-white">{cert.user}</td>
                      <td className="p-3 text-[#00E5FF]">{cert.course}</td>
                      <td className="p-3 text-[10px] text-slate-400 font-mono">{cert.hash}</td>
                      <td className="p-3 text-slate-400">{cert.issueDate}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                          {cert.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
