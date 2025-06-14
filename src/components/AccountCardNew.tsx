import { Account } from "@/types/finance";
import { formatCurrency, getAccountTypeLabel } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Trash2, TrendingUp, TrendingDown, Landmark, CreditCard, Pencil } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountCardNewProps {
  account: Account;
  onDelete: (accountId: string) => void;
  onEdit: (account: Account) => void;
}

const AccountIcon = ({ type, isAsset }: { type: string; isAsset: boolean }) => {
  if (type === "bank") return <Landmark className="h-5 w-5" />;
  if (type === "credit_card") return <CreditCard className="h-5 w-5" />;
  return isAsset ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />;
};

export const AccountCardNew = ({ account, onDelete, onEdit }: AccountCardNewProps) => {
  const borderColorClass = account.isAsset ? "border-l-4 border-success" : "border-l-4 border-destructive";
  const textColorClass = account.isAsset ? "text-success" : "text-destructive";

  return (
    <Card className={`shadow-md hover:shadow-lg transition-shadow duration-300 ${borderColorClass}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">{account.name}</CardTitle>
          <div className={textColorClass}>
            <AccountIcon type={account.type} isAsset={account.isAsset} />
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
