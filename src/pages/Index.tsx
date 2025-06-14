
import { useState, useEffect } from 'react';
import { Account, Goal, UserSettings, NetWorthSummary } from '@/types/finance';
import { storageUtils } from '@/utils/storage';
import { calculateNetWorth } from '@/utils/calculations';
import { DashboardHeader } from '@/components/DashboardHeader';
import { SummaryMetrics } from '@/components/SummaryMetrics';
import { AccountSection } from '@/components/AccountSection';
import { AddAccountSheet } from '@/components/AddAccountSheet';
// We are not using Goals or UserSettings in this new design for now.
// import { GoalsGrid } from '@/components/GoalsGrid';

const Index = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  // const [goals, setGoals] = useState<Goal[]>([]);
  // const [settings, setSettings] = useState<UserSettings>(storageUtils.getSettings());
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<NetWorthSummary>({
    netWorth: 0,
    totalAssets: 0,
    totalLiabilities: 0,
  });
  const [isAddAccountSheetOpen, setIsAddAccountSheetOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setSummary(calculateNetWorth(accounts));
  }, [accounts]);

  const loadData = () => {
    setLoading(true);
    try {
      const loadedAccounts = storageUtils.getAccounts();
      // const loadedGoals = storageUtils.getGoals();
      // const loadedSettings = storageUtils.getSettings();
      setAccounts(loadedAccounts);
      // setGoals(loadedGoals);
      // setSettings(loadedSettings);
    } catch (error) {
      console.error('Error loading data:', error);
      // TODO: Show a toast message for error
    } finally {
      setLoading(false);
    }
  };

  const handleAccountAdded = () => {
    loadData(); // Reload all data, which will recalculate summary
  };

  const handleAccountDeleted = (accountId: string) => {
    storageUtils.deleteAccount(accountId);
    loadData(); // Reload all data
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50 dark:from-neutral-900 dark:to-blue-950 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <DashboardHeader onAddAccount={() => setIsAddAccountSheetOpen(true)} />
        <SummaryMetrics summary={summary} />
        <AccountSection accounts={accounts} onAccountDeleted={handleAccountDeleted} />
        {/* GoalsGrid could be added back here if needed */}
        {/* <div className="mt-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Financial Goals</h2>
          <GoalsGrid goals={goals} onAddGoal={() => console.log("Add goal clicked")} />
        </div> */}
      </div>
      <AddAccountSheet
        isOpen={isAddAccountSheetOpen}
        onOpenChange={setIsAddAccountSheetOpen}
        onAccountAdded={handleAccountAdded}
      />
    </div>
  );
};

export default Index;
