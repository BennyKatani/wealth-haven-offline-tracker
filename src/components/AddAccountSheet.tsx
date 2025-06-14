
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Account, AccountType } from "@/types/finance";
import { generateId } from "@/utils/calculations";
import { storageUtils } from "@/utils/storage";

interface AddAccountSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAccountAdded: () => void;
}

const accountTypes: { value: AccountType; label: string; isAsset: boolean }[] = [
  { value: "savings", label: "Savings Account", isAsset: true },
  { value: "checking", label: "Checking Account", isAsset: true },
  { value: "investment", label: "Investment Account", isAsset: true },
  { value: "cash", label: "Cash", isAsset: true },
  { value: "property", label: "Real Estate", isAsset: true },
  { value: "vehicle", label: "Vehicle", isAsset: true },
  { value: "crypto", label: "Cryptocurrency", isAsset: true },
  { value: "credit_card", label: "Credit Card", isAsset: false },
  { value: "loan", label: "Loan (Personal, Student)", isAsset: false },
  { value: "mortgage", label: "Mortgage", isAsset: false },
  { value: "other", label: "Other Asset", isAsset: true },
  { value: "other", label: "Other Liability", isAsset: false },
];

const assetTypes = accountTypes.filter(t => t.isAsset);
const liabilityTypes = accountTypes.filter(t => !t.isAsset);


export const AddAccountSheet = ({ isOpen, onOpenChange, onAccountAdded }: AddAccountSheetProps) => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState<AccountType | undefined>(undefined);
  const [isAsset, setIsAsset] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState(storageUtils.getSettings().currencySymbol);

  useEffect(() => {
    if (isOpen) {
      setCurrencySymbol(storageUtils.getSettings().currencySymbol);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!name || !balance || !type) {
      // TODO: Add proper validation and toast messages
      console.error("Form validation failed");
      return;
    }
    
    const newAccount: Account = {
      id: generateId(),
      name,
      balance: parseFloat(balance),
      type,
      isAsset: isAsset,
      category: type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageUtils.addAccount(newAccount);
    onAccountAdded();
    // Reset form and close sheet
    setName("");
    setBalance("");
    setType(undefined);
    setIsAsset(true);
    onOpenChange(false);
  };

  const handleTabChange = (value: string) => {
    setIsAsset(value === 'asset');
    setType(undefined); // Reset type on tab change
  }

  const currentTypes = isAsset ? assetTypes : liabilityTypes;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl">Add New Account</SheetTitle>
          <SheetDescription>
            Enter the details for your new financial account.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <Tabs value={isAsset ? 'asset' : 'liability'} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="asset">Asset</TabsTrigger>
              <TabsTrigger value="liability">Liability</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-2">
            <Label htmlFor="type" className="text-left">Account Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as AccountType)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {currentTypes.map((accType) => (
                  <SelectItem key={accType.label} value={accType.value}>
                    {accType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name" className="text-left">Account Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Main Savings, Visa Credit Card"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="balance" className="text-left">Current Balance ({currencySymbol})</Label>
            <Input
              id="balance"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="e.g., 5000"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button onClick={handleSubmit} type="submit">Save Account</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
