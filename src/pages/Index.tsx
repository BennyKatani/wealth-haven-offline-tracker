
import { useState, useEffect } from 'react';
import { Account, NetWorthSummary } from '@/types/finance';
import { storageUtils } from '@/utils/storage';
import { calculateNetWorth } from '@/utils/calculations';
import { DashboardHeader } from '@/components/DashboardHeader';
import { SummaryMetrics } from '@/components/SummaryMetrics';
import { AccountSection } from '@/components/AccountSection';
import { AddAccountSheet } from '@/components/AddAccountSheet';
import { EditAccountDialog } from '@/components/EditAccountDialog';

const Index = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<NetWorthSummary>({
    netWorth: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    monthlyChange: 0,
    changePercentage: 0,
  });
  const [isAddAccountSheetOpen, setIsAddAccountSheetOpen] = useState(false);
  const [isEditAccountDialogOpen, setIsEditAccountDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

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
      setAccounts(loadedAccounts);
    } catch (error) {
      console.error('Error loading data:', error);
      // TODO: Show a toast message for error
    } finally {
      setLoading(false);
    }
  };

  const handleAccountAdded = () => {
    loadData();
  };

  const handleAccountDeleted = (accountId: string) => {
    storageUtils.deleteAccount(accountId);
    loadData();
  };
  
  const handleOpenEditDialog = (account: Account) => {
    setEditingAccount(account);
    setIsEditAccountDialogOpen(true);
  };

  const handleAccountUpdated = () => {
    loadData();
    setIsEditAccountDialogOpen(false);
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
    <div 
      className="min-h-screen bg-cover bg-center p-4 md:p-8"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="container mx-auto max-w-6xl">
        <DashboardHeader onAddAccount={() => setIsAddAccountSheetOpen(true)} />
        <SummaryMetrics summary={summary} />
        <AccountSection 
          accounts={accounts} 
          onAccountDeleted={handleAccountDeleted}
          onAccountEdited={handleOpenEditDialog} 
        />
      </div>
      <AddAccountSheet
        isOpen={isAddAccountSheetOpen}
        onOpenChange={setIsAddAccountSheetOpen}
        onAccountAdded={handleAccountAdded}
      />
      <EditAccountDialog
        open={isEditAccountDialogOpen}
        onOpenChange={setIsEditAccountDialogOpen}
        account={editingAccount}
        onAccountUpdated={handleAccountUpdated}
      />
    </div>
  );
};

export default Index;
