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
} from '@/app/components/revenuerise/ui';
import { TrendingUp, ShieldAlert, LineChart, CandlestickChart, Play, ArrowRight } from 'lucide-react';

export default function MarketLabPage() {
  return (
    <RevenueRiseShell>
      <div className="space-y-8">
        <PageHeader
          badge={<Badge variant="neural" dot>Paper Trading Sandbox</Badge>}
          title="Market Simulation & Trading Education Lab"
          subtitle="Simulated Order Matching • Historical Replay • Quantitative Risk Analytics"
          description="Practice market decision-making in a zero-risk educational environment. Execute simulated orders, study liquidity microstructure, and backtest quantitative strategies without real capital."
        />

        {/* Regulatory Educational Disclaimer Alert */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs leading-relaxed font-mono">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 uppercase block mb-0.5">Educational Simulation Notice:</strong>
            RevenueRiseAI is strictly an educational learning platform. All account balances, order executions, and portfolio metrics are 100% simulated and virtual. Real-money brokerage connections and trading execution are strictly prohibited.
          </div>
        </div>

        {/* Virtual Account Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card variant="intelligence">
            <CardHeader>
              <CardTitle>Virtual Paper Equity</CardTitle>
              <Badge variant="outline">USD Virtual</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-black text-white">$100,000.00</div>
              <p className="text-xs text-emerald-400 font-mono">+0.00% Net PnL (Initial Sandbox)</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Simulated Margin</CardTitle>
              <Badge variant="success">Safe</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-black text-white">$100,000.00</div>
              <p className="text-xs text-slate-400 font-mono">Available virtual buying power</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Strategy Risk Index</CardTitle>
              <Badge variant="neural">Sharpe 0.0</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-black text-white">0 Positions</div>
              <p className="text-xs text-slate-400 font-mono">Max Drawdown: 0.0%</p>
            </CardContent>
          </Card>
        </div>

        {/* Modules & Simulators Panel */}
        <Panel
          title="Simulation Modules"
          icon={<TrendingUp className="w-5 h-5" />}
          action={<Badge variant="outline">2 Environments Available</Badge>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="interactive">
              <CardHeader>
                <div className="p-2.5 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
                  <CandlestickChart className="w-6 h-6" />
                </div>
                <Badge variant="intelligence">Microstructure</Badge>
              </CardHeader>
              <CardTitle>Order Book & Liquidity Simulator</CardTitle>
              <CardDescription>
                Understand bid-ask spreads, limit order queues, market depth, and slippage dynamics in simulated order books.
              </CardDescription>
              <CardFooter>
                <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Enter Simulator
                </Button>
              </CardFooter>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <LineChart className="w-6 h-6" />
                </div>
                <Badge variant="neural">Historical Replay</Badge>
              </CardHeader>
              <CardTitle>Strategy Backtest & Replay Engine</CardTitle>
              <CardDescription>
                Step through historical market regimes bar-by-bar to calculate Sharpe ratio, Sortino ratio, and maximum drawdown.
              </CardDescription>
              <CardFooter>
                <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Launch Backtest Engine
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Panel>
      </div>
    </RevenueRiseShell>
  );
}
