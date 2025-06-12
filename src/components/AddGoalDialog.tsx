
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { storageUtils } from '@/utils/storage';
import { generateId } from '@/utils/calculations';
import { formatCurrency } from '@/utils/calculations';

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalAdded: () => void;
  currentNetWorth: number;
}

export const AddGoalDialog = ({ open, onOpenChange, onGoalAdded, currentNetWorth }: AddGoalDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: '',
    description: '',
  });
  const [useNetWorth, setUseNetWorth] = useState(false);

  const goalCategories = [
    { value: 'retirement', label: 'Retirement' },
    { value: 'emergency_fund', label: 'Emergency Fund' },
    { value: 'house', label: 'House/Property' },
    { value: 'vacation', label: 'Vacation' },
    { value: 'debt_payoff', label: 'Debt Payoff' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.targetDate || !formData.category) {
      return;
    }

    const currentAmount = useNetWorth ? currentNetWorth : parseFloat(formData.currentAmount) || 0;

    const goal = {
      id: generateId(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: currentAmount,
      targetDate: formData.targetDate,
      category: formData.category as any,
      description: formData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageUtils.addGoal(goal);
    onGoalAdded();
    
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      category: '',
      description: '',
    });
    setUseNetWorth(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              placeholder="e.g., Emergency Fund, Retirement"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
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
            <Label>Starting Amount</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <Checkbox
                  id="use-net-worth"
                  checked={useNetWorth}
                  onCheckedChange={(checked) => setUseNetWorth(checked as boolean)}
                />
                <Label htmlFor="use-net-worth" className="text-sm font-medium cursor-pointer">
                  Use Current Net Worth ({formatCurrency(currentNetWorth)})
                </Label>
              </div>
              
              {!useNetWorth && (
                <Input
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
              Add Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
