
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetWorthSummary } from "@/types/finance";
import { formatCurrency } from "@/utils/calculations";
import { Scale, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface SummaryMetricsProps {
  summary: NetWorthSummary;
}

const MetricCard = ({ title, value, icon: Icon, colorClass }: { title: string; value: string; icon: React.ElementType; colorClass: string }) => (
  <Card className="bg-card/65 backdrop-blur-lg border border-border/20 rounded-xl transition-all duration-300 hover:border-border/40 hover:scale-[1.02]">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-foreground">
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
        icon={Scale}
        colorClass="text-primary"
      />
      <MetricCard
        title="Total Assets"
        value={formatCurrency(summary.totalAssets)}
        icon={ArrowUpCircle}
        colorClass="text-success"
      />
      <MetricCard
        title="Total Liabilities"
        value={formatCurrency(summary.totalLiabilities)}
        icon={ArrowDownCircle}
        colorClass="text-destructive"
      />
    </div>
  );
};
