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
  CardFooter,
  Button,
  Badge,
} from '@/app/components/revenuerise/ui';
import { BarChart3, Database, FileSpreadsheet, Play, Code2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsLabPage() {
  const sandboxes = [
    {
      id: 'sql',
      title: 'Relational SQL Query Studio',
      description: 'Execute multi-table joins, window rankings, and index benchmarks against live simulated databases in-browser.',
      badge: 'WebAssembly DuckDB',
      href: '/simulators/sql',
      icon: <Database className="w-6 h-6 text-[#00E5FF]" />,
    },
    {
      id: 'python',
      title: 'Python Pandas & NumPy Lab',
      description: 'Interactive Jupyter-style notebook sandbox powered by Pyodide WebAssembly. No local setup required.',
      badge: 'Pyodide WASM',
      href: '/python-lab',
      icon: <Code2 className="w-6 h-6 text-purple-400" />,
    },
    {
      id: 'excel',
      title: 'Excel Financial Modeling Engine',
      description: 'Practice VLOOKUP, INDEX/MATCH, financial forecasting models, and dynamic pivot scenario builders.',
      badge: 'Formula Parser',
      href: '/simulators/excel',
      icon: <FileSpreadsheet className="w-6 h-6 text-emerald-400" />,
    },
    {
      id: 'bi',
      title: 'Executive BI & Dashboard Studio',
      description: 'Design interactive executive reporting books with star schema models, DAX measures, and drill-throughs.',
      badge: 'Visual Grid',
      href: '/ar-studio',
      icon: <BarChart3 className="w-6 h-6 text-amber-400" />,
    },
  ];

  return (
    <RevenueRiseShell>
      <div className="space-y-8">
        <PageHeader
          badge={<Badge variant="intelligence" dot>Analytical Compute</Badge>}
          title="Analytics Lab & Interactive Studios"
          subtitle="Zero-Install Browser Sandboxes • WebAssembly Compute • Real-Time Feedback"
          description="Explore datasets, debug complex queries, and build verifiable proof-of-work project builds across four dedicated analytical environments."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sandboxes.map((s) => (
            <Card key={s.id} variant="interactive">
              <CardHeader>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">{s.icon}</div>
                <Badge variant="outline">{s.badge}</Badge>
              </CardHeader>
              <CardTitle>{s.title}</CardTitle>
              <CardDescription>{s.description}</CardDescription>
              <CardFooter>
                <Link href={s.href} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Launch Studio
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </RevenueRiseShell>
  );
}
