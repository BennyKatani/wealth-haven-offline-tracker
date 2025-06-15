
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Account, NetWorthSummary, UserSettings } from '@/types/finance';
import { calculateNetWorth } from '@/utils/calculations';
import { DashboardHeader } from '@/components/DashboardHeader';
import { SummaryMetrics } from '@/components/SummaryMetrics';
import { AccountSection } from '@/components/AccountSection';
import { AddAccountSheet } from '@/components/AddAccountSheet';
import { SettingsDialog } from '@/components/SettingsDialog';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { EditAccountSupabaseDialog } from '@/components/EditAccountSupabaseDialog';
import { toast } from 'sonner';

const Index = () => {
  const { session, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();

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
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/auth');
    }
  }, [session, authLoading, navigate]);

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  useEffect(() => {
    setSummary(calculateNetWorth(accounts));
  }, [accounts]);

  const loadData = async () => {
    setLoading(true);
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;

      const loadedAccounts: Account[] = data.map((acc: any) => ({
        id: acc.id,
        name: acc.name,
        balance: acc.balance,
        type: acc.subtype,
        isAsset: acc.type === 'asset',
        category: acc.subtype,
        createdAt: acc.created_at,
        updatedAt: acc.updated_at,
      }));

      setAccounts(loadedAccounts);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load financial data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountAdded = () => {
    loadData();
  };

  const handleAccountDeleted = async (accountId: string) => {
    try {
      const { error } = await supabase.from('accounts').delete().match({ id: accountId });
      if (error) throw error;
      toast.success('Account deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account.');
    }
  };
  
  const handleOpenEditDialog = (account: Account) => {
    setEditingAccount(account);
    setIsEditAccountDialogOpen(true);
  };

  const handleAccountUpdated = () => {
    loadData();
    setIsEditAccountDialogOpen(false);
  };
  
  const handleSettingsUpdated = () => {
    // Re-fetch data in case currency symbol display needs to be updated globally
    loadData();
  };

  if (authLoading || loading) {
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
      className="min-h-screen p-4 md:p-8"
    >
      <div className="container mx-auto max-w-6xl">
        <DashboardHeader 
          onAddAccount={() => setIsAddAccountSheetOpen(true)} 
          onOpenSettings={() => setIsSettingsDialogOpen(true)}
        />
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
      <EditAccountSupabaseDialog
        open={isEditAccountDialogOpen}
        onOpenChange={setIsEditAccountDialogOpen}
        account={editingAccount}
        onAccountUpdated={handleAccountUpdated}
      />
      <SettingsDialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
        onSettingsUpdated={handleSettingsUpdated}
      />
    </div>
  );
};

export default Index;
