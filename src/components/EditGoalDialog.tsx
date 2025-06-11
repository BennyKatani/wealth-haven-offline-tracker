
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Goal, GoalCategory } from '@/types/finance';
import { formatCurrency } from '@/utils/calculations';
import { storageUtils } from '@/utils/storage';

interface EditGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal | null;
  onGoalUpdated: () => void;
  currentNetWorth: number;
}

const goalCategories: { value: GoalCategory; label: string }[] = [
  { value: 'retirement', label: 'Retirement' },
  { value: 'emergency_fund', label: 'Emergency Fund' },
  { value: 'house', label: 'House/Property' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'debt_payoff', label: 'Debt Payoff' },
  { value: 'other', label: 'Other' },
];

export const EditGoalDialog = ({ open, onOpenChange, goal, onGoalUpdated, currentNetWorth }: EditGoalDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: '' as GoalCategory,
    description: '',
  });
  const [useNetWorth, setUseNetWorth] = useState(false);

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        targetDate: goal.targetDate,
        category: goal.category,
        description: goal.description || '',
      });
      setUseNetWorth(false);
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.targetDate || !formData.category || !goal) {
      return;
    }

    const currentAmount = useNetWorth ? currentNetWorth : parseFloat(formData.currentAmount) || 0;

    const updates = {
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: currentAmount,
      targetDate: formData.targetDate,
      category: formData.category,
      description: formData.description,
    };

    storageUtils.updateGoal(goal.id, updates);
    storageUtils.saveGoals(storageUtils.getGoals()); // Auto-save
    onGoalUpdated();
    onOpenChange(false);
  };

  if (!goal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Emergency Fund, Retirement"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as GoalCategory }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {goalCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="targetAmount">Target Amount</Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              placeholder="10000"
              value={formData.targetAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="currentAmount">Current Amount</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Switch
                  checked={useNetWorth}
                  onCheckedChange={setUseNetWorth}
                  id="use-net-worth"
                />
                <div className="flex-1">
                  <Label htmlFor="use-net-worth" className="text-sm font-medium cursor-pointer">
                    Use Current Net Worth
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Set current amount to your total net worth ({formatCurrency(currentNetWorth)})
                  </p>
                </div>
              </div>
              
              {!useNetWorth && (
                <Input
                  id="currentAmount"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional notes about this goal..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
