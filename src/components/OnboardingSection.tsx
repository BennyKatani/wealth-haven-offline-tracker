
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface OnboardingSectionProps {
  onStartTracking: () => void;
}

export const OnboardingSection = ({ onStartTracking }: OnboardingSectionProps) => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📊</span>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Welcome to Your Financial Journey</h2>
        <p className="text-muted-foreground mb-8">
          Start by adding your first account to begin tracking your net worth and financial goals.
        </p>
        
        <Button 
          onClick={onStartTracking}
          className="mb-8 text-lg px-8 py-6 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="h-6 w-6 mr-3" />
          Start Tracking
        </Button>

        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-100 dark:border-green-800">
            <h3 className="font-semibold text-success mb-2">Step 1: Add Your Accounts</h3>
            <p className="text-sm text-muted-foreground">
              Add your bank accounts, investments, properties, and debts to get a complete picture.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="font-semibold text-primary mb-2">Step 2: Set Your Goals</h3>
            <p className="text-sm text-muted-foreground">
              Define your financial targets and track your progress over time.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
            <h3 className="font-semibold text-purple-600 mb-2">Step 3: Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Update your balances regularly and watch your net worth grow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
