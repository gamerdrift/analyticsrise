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
} from '@/app/components/revenuerise/ui';
import { Briefcase, Bot, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CareerCopilotPage() {
  return (
    <RevenueRiseShell>
      <div className="space-y-8">
        <PageHeader
          badge={<Badge variant="intelligence" dot>12-Dimension Career OS</Badge>}
          title="Career Intelligence & Copilot"
          subtitle="Readiness Scoring • ATS Resume Optimizer • AI Mock Technical Interviews"
          description="Quantify your employability across 10 top analytics roles. Receive personalized weekly action plans, benchmark target compensation, and practice live mock technical interviews."
          actions={
            <Link href="/interview-lab">
              <Button leftIcon={<Bot className="w-4 h-4" />}>Start AI Mock Interview</Button>
            </Link>
          }
        />

        {/* Readiness Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="intelligence">
            <CardHeader>
              <CardTitle>Career Readiness</CardTitle>
              <Badge variant="success">88% Ready</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-black text-white">88 / 100</div>
              <Progress value={88} label="Data Analyst Target" />
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>ATS Resume Score</CardTitle>
              <Badge variant="intelligence">85% Match</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-black text-white">85 / 100</div>
              <p className="text-xs text-slate-400">Quantified metrics injected in 4 bullets</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Estimated Time to Hire</CardTitle>
              <Badge variant="outline">4 Weeks</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-black text-white">~4 Weeks</div>
              <p className="text-xs text-slate-400">Salary benchmark: $92k - $115k</p>
            </CardContent>
          </Card>
        </div>

        {/* Career Tools Panel */}
        <Panel
          title="Career Intelligence Tools"
          icon={<Briefcase className="w-5 h-5" />}
          action={<Badge variant="outline">Integrated Tools</Badge>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="interactive">
              <CardHeader>
                <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Bot className="w-6 h-6" />
                </div>
                <Badge variant="neural">AI Voice & Chat</Badge>
              </CardHeader>
              <CardTitle>AI Technical Mock Interview Lab</CardTitle>
              <CardDescription>
                Simulate real technical interviews for SQL, Python, and BI with real-time communication and correctness scoring.
              </CardDescription>
              <CardFooter>
                <Link href="/interview-lab" className="w-full">
                  <Button variant="outline" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Launch Interview Lab
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <div className="p-2.5 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
                  <FileText className="w-6 h-6" />
                </div>
                <Badge variant="intelligence">ATS Parser</Badge>
              </CardHeader>
              <CardTitle>ATS Resume Optimization Studio</CardTitle>
              <CardDescription>
                Scan your resume against real job descriptions to identify missing keywords, quantified metrics, and formatting gaps.
              </CardDescription>
              <CardFooter>
                <Link href="/resume-studio" className="w-full">
                  <Button variant="outline" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Open Resume Studio
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
