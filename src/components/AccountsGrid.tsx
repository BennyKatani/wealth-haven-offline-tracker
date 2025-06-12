
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountCard } from './AccountCard';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  isAsset: boolean;
}

interface AccountsGridProps {
  accounts: Account[];
  onAccountDeleted: (accountId: string) => void;
}

export const AccountsGrid = ({ accounts, onAccountDeleted }: AccountsGridProps) => {
  const assets = accounts.filter(acc => acc.isAsset);
  const liabilities = accounts.filter(acc => !acc.isAsset);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-success">Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assets.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onDelete={onAccountDeleted}
              />
            ))}
            {assets.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">No assets added yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liabilities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-warning">Liabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {liabilities.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onDelete={onAccountDeleted}
              />
            ))}
            {liabilities.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">No liabilities added yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
