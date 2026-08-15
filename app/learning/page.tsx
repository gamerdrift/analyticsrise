'use client';

import React from 'react';
import { RevenueRiseShell } from '@/app/components/revenuerise/layout/RevenueRiseShell';
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
import { GraduationCap, Sparkles, CheckCircle2, Lock, ArrowRight, Play, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function LearningIntelligencePage() {
  return (
    <RevenueRiseShell>
      <div className="space-y-8">
        <PageHeader
          badge={<Badge variant="intelligence" dot>Adaptive Curriculum</Badge>}
          title="Learning Intelligence & Skill Graph"
          subtitle="DAG-Based Knowledge Paths • Spaced Repetition • Diagnostic Placement"
          description="Master competencies through topological skill dependencies rather than linear playlists. The engine automatically adapts to your retention and assessment performance."
          actions={
            <Link href="/simulators/sql">
              <Button leftIcon={<Play className="w-4 h-4" />}>Launch Diagnostic Drill</Button>
            </Link>
          }
        />

        {/* Skill Graph Readiness Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="intelligence">
            <CardHeader>
              <CardTitle>Skill Graph Nodes</CardTitle>
              <Badge variant="neural">DAG Active</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-black text-white">48 Competencies</div>
              <Progress value={65} label="Topological Path Completion" />
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Spaced Repetition</CardTitle>
              <Badge variant="success">SM-2 Algorithm</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-black text-white">3 Daily Drills</div>
              <p className="text-xs text-slate-400">Memory retention score: 91.4% (Optimal)</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Target Role Pathway</CardTitle>
              <Badge variant="intelligence">Data Analyst</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-black text-white">88% Ready</div>
              <p className="text-xs text-slate-400">Next Node: SQL Window Functions (LEAD/LAG)</p>
            </CardContent>
          </Card>
        </div>

        {/* Learning Paths Panel */}
        <Panel
          title="Adaptive Curriculum Tracks"
          icon={<GraduationCap className="w-5 h-5" />}
          action={<Badge variant="outline">4 Tracks Active</Badge>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="interactive">
              <CardHeader>
                <Badge variant="intelligence">Track 1</Badge>
                <span className="text-xs font-mono text-emerald-400 font-bold">100% Free Tier</span>
              </CardHeader>
              <CardTitle>Relational SQL & Database Architecture</CardTitle>
              <CardDescription>
                From SELECT fundamentals to complex multi-table joins, subqueries, CTEs, and window partition frames.
              </CardDescription>
              <CardFooter>
                <span className="text-xs font-mono text-slate-400">12 Modules • 4 Sandbox Labs</span>
                <Link href="/simulators/sql">
                  <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Enter Track
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <Badge variant="neural">Track 2</Badge>
                <span className="text-xs font-mono text-purple-400 font-bold">Pro Intelligence</span>
              </CardHeader>
              <CardTitle>Python Pandas & Data Engineering Pipelines</CardTitle>
              <CardDescription>
                Wrangle large datasets, impute missing records, aggregate high-cardinality cohorts, and export clean schemas.
              </CardDescription>
              <CardFooter>
                <span className="text-xs font-mono text-slate-400">16 Modules • 6 Pyodide Notebooks</span>
                <Link href="/python-lab">
                  <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Enter Track
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </Panel>
      </div>
    </RevenueRiseShell>
  );
}
