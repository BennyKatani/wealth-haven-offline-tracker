
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetWorthSummary } from "@/types/finance";
import { formatCurrency } from "@/utils/calculations";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

interface SummaryMetricsProps {
  summary: NetWorthSummary;
}

const MetricCard = ({ title, value, icon: Icon, colorClass }: { title: string; value: string; icon: React.ElementType; colorClass: string }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className={`h-5 w-5 ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
    </CardContent>
  </Card>
);

export const SummaryMetrics = ({ summary }: SummaryMetricsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <MetricCard
        title="Net Worth"
        value={formatCurrency(summary.netWorth)}
        icon={Wallet}
        colorClass="text-primary"
      />
      <MetricCard
        title="Total Assets"
        value={formatCurrency(summary.totalAssets)}
        icon={TrendingUp}
        colorClass="text-success"
      />
      <MetricCard
        title="Total Liabilities"
        value={formatCurrency(summary.totalLiabilities)}
        icon={TrendingDown}
        colorClass="text-destructive"
      />
    </div>
  );
};
