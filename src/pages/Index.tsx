
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
import { Plus } from 'lucide-react';

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

  // Get currency symbol for display
  const getCurrencySymbol = () => {
    return settings.currencySymbol || '$';
  };

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
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSettingsDialog(true)}
            className="ml-4 text-xl font-semibold"
          >
            {getCurrencySymbol()}
          </Button>
        </div>

        <PrivacyBanner />

        {/* Key Features Section - Always shown */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100 text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold text-success mb-2">100% Private</h3>
              <p className="text-sm text-muted-foreground">
                Data never leaves your device
              </p>
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-primary mb-2">100% Free</h3>
              <p className="text-sm text-muted-foreground">
                Free to use, forever!
              </p>
            </div>
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100 text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-purple-600 mb-2">100% Offline</h3>
              <p className="text-sm text-muted-foreground">
                No strings attached
              </p>
            </div>
          </div>
        </div>

        {/* Conditional Content Based on Data */}
        {!hasData ? (
          // NEW USER ONBOARDING - shown when no accounts exist
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
                Start Tracking
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
        ) : (
          // Dashboard content for existing users - shown after key features
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
