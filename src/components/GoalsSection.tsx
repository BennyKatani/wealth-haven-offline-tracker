import { useState } from 'react';
import { Plus, Target, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Goal } from '@/types/finance';
import { formatCurrency } from '@/utils/calculations';
import { AddGoalDialog } from '@/components/AddGoalDialog';

interface GoalsSectionProps {
  goals: Goal[];
  onGoalAdded: () => void;
}

export const GoalsSection = ({ goals, onGoalAdded }: GoalsSectionProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleGoalAdded = () => {
    onGoalAdded();
    setShowAddDialog(false);
  };

  const calculateProgress = (goal: Goal): number => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const calculateMonthsRemaining = (targetDate: string): number => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - now.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(diffMonths, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Goals</h2>
        <Button onClick={() => setShowAddDialog(true)} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No financial goals yet</h3>
            <p className="text-muted-foreground mb-4">Set your first goal to start tracking your progress</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal);
            const monthsRemaining = calculateMonthsRemaining(goal.targetDate);
            const monthlyTarget = monthsRemaining > 0 
              ? (goal.targetAmount - goal.currentAmount) / monthsRemaining 
              : 0;

            return (
              <Card key={goal.id} className="border-0 shadow-lg gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>{goal.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-success font-medium">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{monthsRemaining} months left</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-primary">
                      <TrendingUp className="h-4 w-4" />
                      <span>{formatCurrency(monthlyTarget)}/month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AddGoalDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onGoalAdded={handleGoalAdded}
      />
    </div>
  );
};
