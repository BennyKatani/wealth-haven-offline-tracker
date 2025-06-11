
import { useState } from 'react';
import { Plus, Pencil, Trash2, Building2, Car, CreditCard, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Account } from '@/types/finance';
import { formatCurrency, getAccountTypeLabel } from '@/utils/calculations';
import { AddAccountDialog } from './AddAccountDialog';
import { EditAccountDialog } from './EditAccountDialog';

interface AccountsListProps {
  accounts: Account[];
  onAccountAdded: () => void;
  onAccountUpdated: () => void;
  onAccountDeleted: (accountId: string) => void;
}

export const AccountsList = ({ accounts, onAccountAdded, onAccountUpdated, onAccountDeleted }: AccountsListProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <Home className="h-5 w-5" />;
      case 'vehicle':
        return <Car className="h-5 w-5" />;
      case 'credit_card':
      case 'loan':
      case 'mortgage':
        return <CreditCard className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setShowEditDialog(true);
  };

  const assets = accounts.filter(acc => acc.isAsset);
  const liabilities = accounts.filter(acc => !acc.isAsset);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Accounts</h2>
        <Button onClick={() => setShowAddDialog(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-success">Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assets.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No assets added yet</p>
            ) : (
              assets.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="text-success">
                      {getAccountIcon(account.type)}
                    </div>
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getAccountTypeLabel(account.type)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-success">
                      {formatCurrency(account.balance)}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditAccount(account)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:text-destructive"
                        onClick={() => onAccountDeleted(account.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Liabilities */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-warning">Liabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {liabilities.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No liabilities added yet</p>
            ) : (
              liabilities.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100">
                  <div className="flex items-center space-x-3">
                    <div className="text-warning">
                      {getAccountIcon(account.type)}
                    </div>
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getAccountTypeLabel(account.type)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-warning">
                      {formatCurrency(account.balance)}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditAccount(account)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:text-destructive"
                        onClick={() => onAccountDeleted(account.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <AddAccountDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAccountAdded={() => {
          onAccountAdded();
          setShowAddDialog(false);
        }}
      />

      <EditAccountDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        account={editingAccount}
        onAccountUpdated={() => {
          onAccountUpdated();
          setShowEditDialog(false);
          setEditingAccount(null);
        }}
      />
    </div>
  );
};
