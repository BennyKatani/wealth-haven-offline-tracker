
import { Account, AccountType } from "@/types/finance";
import { formatCurrency, getAccountTypeLabel } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Pencil, 
  Landmark, 
  CreditCard, 
  TrendingUp,
  Home,
  Car,
  Bitcoin,
  PiggyBank,
  BarChart,
  Handshake,
  Wallet
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountCardNewProps {
  account: Account;
  onDelete: (accountId: string) => void;
  onEdit: (account: Account) => void;
}

const AccountIcon = ({ type }: { type: AccountType }) => {
  const iconMap: Record<AccountType, React.ElementType> = {
    checking: Landmark,
    savings: PiggyBank,
    investment: BarChart,
    retirement: PiggyBank,
    property: Home,
    vehicle: Car,
    crypto: Bitcoin,
    cash: Wallet,
    credit_card: CreditCard,
    loan: Handshake,
    mortgage: Home,
    other: TrendingUp,
  };

  const IconComponent = iconMap[type] || TrendingUp;
  return <IconComponent className="h-5 w-5" />;
};

export const AccountCardNew = ({ account, onDelete, onEdit }: AccountCardNewProps) => {
  const textColorClass = account.isAsset ? "text-success" : "text-destructive";

  return (
    <Card className="bg-card/65 backdrop-blur-lg border border-border/20 rounded-xl transition-all duration-300 hover:border-border/40 hover:scale-[1.02]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">{account.name}</CardTitle>
          <div className={textColorClass}>
            <AccountIcon type={account.type} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          {getAccountTypeLabel(account.type)}
        </p>
      </CardHeader>
      <CardContent className="pb-3">
        <p className={`text-2xl font-bold ${textColorClass}`}>
          {formatCurrency(account.balance)}
        </p>
      </CardContent>
      <CardFooter className="pt-0 pb-3 flex justify-end space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          onClick={() => onEdit(account)}
        >
          <Pencil className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(account.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
