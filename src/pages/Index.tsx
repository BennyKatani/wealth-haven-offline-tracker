
import { useState, useEffect } from 'react';
import { Account, Goal, UserSettings } from '@/types/finance';
import { storageUtils as originalStorageUtils } from '@/utils/storage';
import { storageUtils } from '@/utils/networth';
import { calculateNetWorth } from '@/utils/calculations';
import { NetWorthSummary } from '@/components/NetWorthSummary';
import { AccountsList } from '@/components/AccountsList';
import { GoalsSection } from '@/components/GoalsSection';
import { PrivacyBanner } from '@/components/PrivacyBanner';
import { AddAccountDialog } from '@/components/AddAccountDialog';
import { AddGoalDialog } from '@/components/AddGoalDialog';
import { SettingsDialog } from '@/components/SettingsDialog';
import { OnboardingSection } from '@/components/OnboardingSection';
import { AccountsGrid } from '@/components/AccountsGrid';
import { GoalsGrid } from '@/components/GoalsGrid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Index = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [settings, setSettings] = useState<UserSettings>(originalStorageUtils.getSettings());
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const loadedAccounts = originalStorageUtils.getAccounts();
      const loadedGoals = originalStorageUtils.getGoals();
      const loadedSettings = originalStorageUtils.getSettings();
      setAccounts(loadedAccounts);
      setGoals(loadedGoals);
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountAdded = () => {
    loadData();
    setShowAddDialog(false);
  };

  const handleAccountUpdated = () => {
    loadData();
  };

  const handleAccountDeleted = (accountId: string) => {
    originalStorageUtils.deleteAccount(accountId);
    loadData();
  };

  const handleGoalAdded = () => {
    loadData();
  };

  const handleSettingsUpdated = () => {
    loadData();
  };

  const summary = calculateNetWorth(accounts);
  const hasData = accounts.length > 0;

  // Get currency symbol for display
  const getCurrencySymbol = () => {
    return settings.currencySymbol || '$';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header - Always shown */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Net Worth Tracker
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your financial progress with complete privacy. All data stays on your device.
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettingsDialog(true)}
              className="text-xl font-semibold"
            >
              {getCurrencySymbol()}
            </Button>
          </div>
        </div>

        <PrivacyBanner />

        {/* Single Page Content: Conditional rendering based on data */}
        {!hasData ? (
          <OnboardingSection onStartTracking={() => setShowAddDialog(true)} />
        ) : (
          <div className="space-y-12">
            <NetWorthSummary 
              summary={summary} 
              key={`${settings.currency}-${settings.currencySymbol}`}
            />
            
            {/* Accounts Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Accounts</h2>
                <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </div>
              <AccountsGrid 
                accounts={accounts}
                onAccountDeleted={handleAccountDeleted}
              />
            </div>

            {/* Goals Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Financial Goals</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddGoalDialog(true)}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>
              <GoalsGrid 
                goals={goals}
                onAddGoal={() => setShowAddGoalDialog(true)}
              />
            </div>
          </div>
        )}

        <AddAccountDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAccountAdded={handleAccountAdded}
        />

        <AddGoalDialog
          open={showAddGoalDialog}
          onOpenChange={setShowAddGoalDialog}
          onGoalAdded={handleGoalAdded}
          currentNetWorth={summary.netWorth}
        />

        <SettingsDialog
          open={showSettingsDialog}
          onOpenChange={setShowSettingsDialog}
          onSettingsUpdated={handleSettingsUpdated}
        />
      </div>
    </div>
  );
};

export default Index;
