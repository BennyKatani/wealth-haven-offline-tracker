
import { useState, useEffect } from 'react';
import { Account, Goal } from '@/types/finance';
import { storageUtils } from '@/utils/storage';
import { calculateNetWorth } from '@/utils/calculations';
import { NetWorthSummary } from '@/components/NetWorthSummary';
import { AccountsList } from '@/components/AccountsList';
import { GoalsSection } from '@/components/GoalsSection';
import { PrivacyBanner } from '@/components/PrivacyBanner';

const Index = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const loadedAccounts = storageUtils.getAccounts();
      const loadedGoals = storageUtils.getGoals();
      setAccounts(loadedAccounts);
      setGoals(loadedGoals);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountAdded = () => {
    loadData();
  };

  const handleAccountUpdated = () => {
    loadData();
  };

  const handleAccountDeleted = (accountId: string) => {
    storageUtils.deleteAccount(accountId);
    loadData();
  };

  const handleGoalAdded = () => {
    loadData();
  };

  const summary = calculateNetWorth(accounts);
  const hasData = accounts.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Net Worth Tracker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your financial progress with complete privacy. All data stays on your device.
          </p>
        </div>

        <PrivacyBanner />

        {hasData ? (
          <div className="space-y-12">
            <NetWorthSummary summary={summary} />
            <AccountsList
              accounts={accounts}
              onAccountAdded={handleAccountAdded}
              onAccountUpdated={handleAccountUpdated}
              onAccountDeleted={handleAccountDeleted}
            />
            <GoalsSection 
              goals={goals}
              onGoalAdded={handleGoalAdded}
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📊</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">Welcome to Your Financial Journey</h2>
              <p className="text-muted-foreground mb-8">
                Start by adding your first account to begin tracking your net worth and financial goals.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                  <h3 className="font-semibold text-success mb-2">Step 1: Add Your Accounts</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your bank accounts, investments, properties, and debts to get a complete picture.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-primary mb-2">Step 2: Set Your Goals</h3>
                  <p className="text-sm text-muted-foreground">
                    Define your financial targets and track your progress over time.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <h3 className="font-semibold text-purple-600 mb-2">Step 3: Track Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your balances regularly and watch your net worth grow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
