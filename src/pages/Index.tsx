import { useState, useEffect } from 'react';
import { Account, Goal, UserSettings } from '@/types/finance';
import { storageUtils } from '@/utils/storage';
import { calculateNetWorth } from '@/utils/calculations';
import { NetWorthSummary } from '@/components/NetWorthSummary';
import { AccountsList } from '@/components/AccountsList';
import { GoalsSection } from '@/components/GoalsSection';
import { PrivacyBanner } from '@/components/PrivacyBanner';
import { AddAccountDialog } from '@/components/AddAccountDialog';
import { SettingsDialog } from '@/components/SettingsDialog';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';

const Index = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [settings, setSettings] = useState<UserSettings>(storageUtils.getSettings());
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const loadedAccounts = storageUtils.getAccounts();
      const loadedGoals = storageUtils.getGoals();
      const loadedSettings = storageUtils.getSettings();
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
    storageUtils.deleteAccount(accountId);
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
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Net Worth Tracker
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your financial progress with complete privacy. All data stays on your device.
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSettingsDialog(true)}
            className="ml-4"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <PrivacyBanner />

        {hasData ? (
          <div className="space-y-12">
            <NetWorthSummary 
              summary={summary} 
              key={`${settings.currency}-${settings.currencySymbol}`}
            />
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
              
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="mb-8 text-lg px-8 py-6 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-6 w-6 mr-3" />
                Add Your First Account
              </Button>

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

        {/* Floating Action Button - shown when there are accounts */}
        {hasData && (
          <div className="fixed bottom-6 right-6">
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
              size="icon"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        )}

        <AddAccountDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAccountAdded={handleAccountAdded}
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
