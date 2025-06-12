
import { Building, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, getAccountTypeLabel } from '@/utils/calculations';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  isAsset: boolean;
}

interface AccountCardProps {
  account: Account;
  onDelete: (accountId: string) => void;
}

export const AccountCard = ({ account, onDelete }: AccountCardProps) => {
  const cardClass = account.isAsset 
    ? "flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-100 dark:border-green-800"
    : "flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-100 dark:border-orange-800";

  const amountClass = account.isAsset ? "text-success" : "text-warning";

  return (
    <div className={cardClass}>
      <div className="flex items-center space-x-3">
        <div className={account.isAsset ? "text-success" : "text-warning"}>
          <Building className="h-4 w-4" />
        </div>
        <div>
          <div className="font-medium text-foreground">{account.name}</div>
          <div className="text-sm text-muted-foreground">
            {getAccountTypeLabel(account.type)}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-semibold ${amountClass}`}>
          {formatCurrency(account.balance)}
        </div>
        <Button 
          variant="ghost"
          size="sm"
          className="mt-1 h-6 w-6 p-0 text-destructive hover:text-destructive"
          onClick={() => onDelete(account.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
