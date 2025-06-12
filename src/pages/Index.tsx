
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
import { Toggle } from '@/components/ui/toggle';
import { Plus, Moon, Sun } from 'lucide-react';

const Index = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [settings, setSettings] = useState<UserSettings>(storageUtils.getSettings());
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
            <Toggle
              pressed={darkMode}
              onPressedChange={setDarkMode}
              variant="outline"
              size="sm"
              className="p-2"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Toggle>
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
          // NEW USER ONBOARDING - shown when no accounts exist
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
                onClick={() => setShowAddDialog(true)}
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
        ) : (
          // DASHBOARD CONTENT - shown when user has accounts
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
              currentNetWorth={summary.netWorth}
            />
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
