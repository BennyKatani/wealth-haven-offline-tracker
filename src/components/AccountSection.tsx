
import { Account } from "@/types/finance";
import { AccountCardNew } from "./AccountCardNew";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountSectionProps {
  accounts: Account[];
  onAccountDeleted: (accountId: string) => void;
  onAccountEdited: (account: Account) => void;
}

export const AccountSection = ({ accounts, onAccountDeleted, onAccountEdited }: AccountSectionProps) => {
  const assets = accounts.filter((acc) => acc.isAsset);
  const liabilities = accounts.filter((acc) => !acc.isAsset);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="shadow-sm bg-transparent border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-success">Assets</CardTitle>
        </CardHeader>
        <CardContent>
          {assets.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {assets.map((account) => (
                <AccountCardNew key={account.id} account={account} onDelete={onAccountDeleted} onEdit={onAccountEdited} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No assets added yet. Start by adding your first asset!</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-transparent border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-destructive">Liabilities</CardTitle>
        </CardHeader>
        <CardContent>
          {liabilities.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {liabilities.map((account) => (
                <AccountCardNew key={account.id} account={account} onDelete={onAccountDeleted} onEdit={onAccountEdited} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No liabilities added yet. Add your liabilities to get a full picture.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
