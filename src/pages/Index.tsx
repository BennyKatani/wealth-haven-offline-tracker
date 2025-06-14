
import { useState, useEffect } from 'react';
import { Account, Goal, UserSettings } from '@/types/finance';
import { storageUtils as originalStorageUtils } from '@/utils/storage';
import { calculateNetWorth } from '@/utils/calculations';
import { HebrewDashboard } from '@/components/HebrewDashboard';

const Index = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [settings, setSettings] = useState<UserSettings>(originalStorageUtils.getSettings());
  const [loading, setLoading] = useState(true);

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
  };

  const handleAccountDeleted = (accountId: string) => {
    originalStorageUtils.deleteAccount(accountId);
    loadData();
  };

  const summary = calculateNetWorth(accounts);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f6f9ff' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען את הנתונים הפיננסיים שלך...</p>
        </div>
      </div>
    );
  }

  return (
    <HebrewDashboard
      accounts={accounts}
      summary={summary}
      onAccountAdded={handleAccountAdded}
      onAccountDeleted={handleAccountDeleted}
    />
  );
};

export default Index;
