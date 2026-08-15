'use client';

import React, { useState, useEffect } from 'react';
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
  Select,
} from '@/app/components/revenuerise/ui';
import { Settings, Shield, User, Zap, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import { authAdapter, entitlementAdapter, subscriptionAdapter, AuthoritativeEntitlement, AuthoritativeSubscription, AuthUser } from '@/lib/integrations/analyticsrise';
import Link from 'next/link';

export default function SettingsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [subscription, setSubscription] = useState<AuthoritativeSubscription | null>(null);
  const [entitlement, setEntitlement] = useState<AuthoritativeEntitlement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const u = await authAdapter.getCurrentUser();
        setUser(u);
        const uid = u?.uid || 'guest-user';
        const [sub, ent] = await Promise.all([
          subscriptionAdapter.getSubscription(uid),
          entitlementAdapter.getAuthoritativeEntitlement(uid),
        ]);
        setSubscription(sub);
        setEntitlement(ent);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <RevenueRiseShell>
      <div className="space-y-8">
        <PageHeader
          badge={<Badge variant="intelligence" dot>Account & System Governance</Badge>}
          title="Platform Settings & Usage Quotas"
          subtitle="Identity Verification • Entitlement Governance • AI Quotas"
          description="Manage your account profile, inspect server-authoritative feature entitlements, and monitor monthly AI compute usage."
        />

        {/* Identity & Subscription Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 text-[#00E5FF]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>Authoritative Identity via Firebase Auth</CardDescription>
                </div>
              </div>
              <Badge variant={user ? 'success' : 'default'}>{user ? 'Authenticated' : 'Guest Mode'}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-xs text-slate-300">
                <div>
                  <span className="text-slate-500">Name: </span>
                  <span className="text-white font-bold">{user?.displayName || 'Analyst Guest'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Email: </span>
                  <span className="text-white">{user?.email || 'guest@analyticsrise.com'}</span>
                </div>
                <div>
                  <span className="text-slate-500">User ID: </span>
                  <span className="text-slate-400">{user?.uid || 'guest-user-session'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="intelligence">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Active Subscription</CardTitle>
                  <CardDescription>Managed by AnalyticsRise Core</CardDescription>
                </div>
              </div>
              <Badge variant="intelligence">
                {subscription?.planId ? subscription.planId.toUpperCase() : 'FREE TIER'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Billing Cycle:</span>
                  <span className="text-white uppercase">{subscription?.billingCycle || 'Monthly'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subscription Status:</span>
                  <span className="text-emerald-400 uppercase font-bold">{subscription?.status || 'Active'}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/pricing" className="w-full">
                <Button variant="primary" size="sm" className="w-full" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Manage Plan on AnalyticsRise
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Server-Authoritative Usage Quotas Panel */}
        <Panel
          title="Server-Authoritative Usage Quotas"
          icon={<Zap className="w-5 h-5" />}
          statusBadge={<Badge variant="success">Zero-Trust Protected</Badge>}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Monthly AI Mentor Query Quota</span>
                <span className="text-white font-bold">
                  {entitlement?.monthlyQuotas?.ai_mentor_queries === -1
                    ? 'Unlimited (Pro Active)'
                    : `0 / ${entitlement?.monthlyQuotas?.ai_mentor_queries ?? 15} used`}
                </span>
              </div>
              <Progress
                value={entitlement?.monthlyQuotas?.ai_mentor_queries === -1 ? 0 : 0}
                variant="intelligence"
                showPercentage={false}
              />
              <p className="text-[11px] text-slate-400">
                Quotas reset at the start of your monthly billing cycle.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Custom Dataset Storage</span>
                <span className="text-white font-bold">
                  0 MB / {entitlement?.monthlyQuotas?.custom_dataset_storage_mb ?? 50} MB
                </span>
              </div>
              <Progress value={0} variant="neural" showPercentage={false} />
            </div>
          </div>
        </Panel>

        {/* Model Preferences Panel */}
        <Panel
          title="AI Intelligence Preferences"
          icon={<Sparkles className="w-5 h-5" />}
        >
          <div className="max-w-md space-y-4">
            <Select
              label="Default AI Mentor Engine"
              options={[
                { value: 'gemini-1.5-pro', label: 'Google Gemini 1.5 Pro (Recommended)' },
                { value: 'claude-3-5-sonnet', label: 'Anthropic Claude 3.5 Sonnet' },
                { value: 'gpt-4o', label: 'OpenAI GPT-4o' },
                { value: 'mock-intelligence-v1', label: 'Mock Intelligence Engine (Test/Offline)' },
              ]}
              defaultValue="gemini-1.5-pro"
              helperText="RevenueRiseAI uses multi-vendor circuit breaking to automatically failover upon latency spikes."
            />
          </div>
        </Panel>
      </div>
    </RevenueRiseShell>
  );
}
