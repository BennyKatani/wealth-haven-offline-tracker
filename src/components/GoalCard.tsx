
import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/calculations';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  
  const formatTimeRemaining = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Target date passed";
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  return (
    <Card className="gradient-card border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">{goal.name}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium text-foreground">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="font-medium text-success">
              {formatCurrency(goal.currentAmount)}
            </span>
            <span className="text-muted-foreground">
              {formatCurrency(goal.targetAmount)}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {formatTimeRemaining(goal.targetDate)} remaining
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
