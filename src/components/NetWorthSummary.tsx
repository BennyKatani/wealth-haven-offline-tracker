
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NetWorthSummary as NetWorthSummaryType } from '@/types/finance';
import { formatCurrency, formatPercentage } from '@/utils/calculations';

interface NetWorthSummaryProps {
  summary: NetWorthSummaryType;
}

export const NetWorthSummary = ({ summary }: NetWorthSummaryProps) => {
  const isPositiveChange = summary.monthlyChange >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Main Net Worth Card */}
      <Card className="md:col-span-2 gradient-card border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-muted-foreground">Total Net Worth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-primary" />
            <div>
              <div className="text-4xl font-bold text-foreground">
                {formatCurrency(summary.netWorth)}
              </div>
              <div className={`flex items-center space-x-1 text-sm ${isPositiveChange ? 'text-profit' : 'text-loss'}`}>
                {isPositiveChange ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {formatCurrency(Math.abs(summary.monthlyChange))} ({formatPercentage(summary.changePercentage)}) this month
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Card */}
      <Card className="gradient-success border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-muted-foreground">Total Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {formatCurrency(summary.totalAssets)}
          </div>
        </CardContent>
      </Card>

      {/* Liabilities Card */}
      <Card className="gradient-warning border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-muted-foreground">Total Liabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">
            {formatCurrency(summary.totalLiabilities)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
