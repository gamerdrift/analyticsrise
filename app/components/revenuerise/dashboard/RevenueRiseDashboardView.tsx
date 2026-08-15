'use client';

import React from 'react';
import Link from 'next/link';
import {
  PageHeader,
  Panel,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Progress,
  EmptyState,
} from '@/app/components/revenuerise/ui';
import {
  Bot,
  GraduationCap,
  TrendingUp,
  Briefcase,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
  Code2,
  Terminal,
  Activity,
} from 'lucide-react';

export function RevenueRiseDashboardView() {
  return (
    <div className="space-y-8">
      {/* Top Header */}
      <PageHeader
        badge={<Badge variant="intelligence" dot>Intelligence OS v1.0</Badge>}
        title="Intelligence Command Center"
        subtitle="AI Mentor • Adaptive Learning • Market Simulation • Career Copilot"
        description="Your unified professional intelligence operating system. Practice skills, simulate market execution, review code with AI, and track career readiness from a single console."
        actions={
          <Link href="/ai">
            <Button leftIcon={<Bot className="w-4 h-4" />}>Launch AI Mentor</Button>
          </Link>
        }
      />

      {/* 4 Core Intelligence Pillar Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. AI Mentor */}
        <Card variant="interactive">
          <CardHeader>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <Badge variant="neural">24/7 Socratic</Badge>
          </CardHeader>
          <CardTitle>AI Mentor</CardTitle>
          <CardDescription>
            Multi-vendor contextual coaching for SQL, Python, and BI debugging.
          </CardDescription>
          <CardFooter>
            <Link href="/ai" className="text-xs font-mono text-[#00E5FF] hover:underline flex items-center gap-1 font-bold">
              Open Studio <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardFooter>
        </Card>

        {/* 2. Learning Engine */}
        <Card variant="interactive">
          <CardHeader>
            <div className="p-2 rounded-xl bg-[#00E5FF]/15 text-[#00E5FF]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <Badge variant="intelligence">DAG Path</Badge>
          </CardHeader>
          <CardTitle>Skill Graph</CardTitle>
          <CardDescription>
            48 verified competency nodes with adaptive SM-2 spaced repetition drills.
          </CardDescription>
          <CardFooter>
            <Link href="/learning" className="text-xs font-mono text-[#00E5FF] hover:underline flex items-center gap-1 font-bold">
              View Graph <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardFooter>
        </Card>

        {/* 3. Market Lab */}
        <Card variant="interactive">
          <CardHeader>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <Badge variant="success">Paper Trading</Badge>
          </CardHeader>
          <CardTitle>Market Lab</CardTitle>
          <CardDescription>
            Simulated order matching and historical backtest risk analytics.
          </CardDescription>
          <CardFooter>
            <Link href="/markets" className="text-xs font-mono text-[#00E5FF] hover:underline flex items-center gap-1 font-bold">
              Enter Sandbox <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardFooter>
        </Card>

        {/* 4. Career Intelligence */}
        <Card variant="interactive">
          <CardHeader>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <Badge variant="warning">88% Ready</Badge>
          </CardHeader>
          <CardTitle>Career Copilot</CardTitle>
          <CardDescription>
            Target role readiness scoring, ATS optimization, and mock AI interviews.
          </CardDescription>
          <CardFooter>
            <Link href="/career" className="text-xs font-mono text-[#00E5FF] hover:underline flex items-center gap-1 font-bold">
              View Copilot <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Main Command Center Activity & Status Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Personalized Workspace Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Panel
            title="Active Intelligence Workspace"
            icon={<Sparkles className="w-5 h-5" />}
            statusBadge={<Badge variant="intelligence">Ready</Badge>}
          >
            <div className="p-6 rounded-2xl bg-[#0D1424] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-purple-300 font-bold uppercase flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Recommended Focus
                </span>
                <span className="text-[11px] font-mono text-slate-400">Target: Data Analyst</span>
              </div>
              <h3 className="text-base font-mono font-bold text-white">
                Complete SQL Lab Module 4: Window Functions (LEAD/LAG)
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Closing this skill gap will boost your target role readiness score from 88% to 94%.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link href="/simulators/sql">
                  <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Launch SQL Sandbox
                  </Button>
                </Link>
                <Link href="/ai">
                  <Button size="sm" variant="secondary" leftIcon={<Bot className="w-3.5 h-3.5" />}>
                    Ask AI Mentor for Tutorial
                  </Button>
                </Link>
              </div>
            </div>

            {/* Empty State for Recent Simulations */}
            <div className="pt-4 border-t border-white/5">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase mb-4">
                Recent Intelligence Runs
              </h4>
              <EmptyState
                title="No Recent Simulation Runs"
                description="Launch a paper trading session, run a Python Pandas notebook, or execute a SQL benchmark to populate your live telemetry feed."
                actionLabel="Explore Analytics Lab"
                onAction={() => {}}
                actionIcon={<Code2 className="w-4 h-4" />}
                className="py-6"
              />
            </div>
          </Panel>
        </div>

        {/* Right 1 Col: Server Quotas & Telemetry */}
        <div className="space-y-6">
          <Panel title="Compute & Entitlements" icon={<Activity className="w-5 h-5" />}>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">AI Query Quota</span>
                  <span className="text-white font-bold">15 Queries / mo</span>
                </div>
                <Progress value={0} max={15} showPercentage={false} variant="intelligence" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Sandbox Memory Pool</span>
                  <span className="text-white font-bold">50 MB</span>
                </div>
                <Progress value={0} max={50} showPercentage={false} variant="neural" />
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2 text-xs font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Plan Status:</span>
                  <span className="text-[#00E5FF] font-bold uppercase">Free Tier</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Gateway:</span>
                  <span className="text-slate-300">AnalyticsRise Core</span>
                </div>
              </div>

              <Link href="/pricing" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Upgrade to Pro Intelligence
                </Button>
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
