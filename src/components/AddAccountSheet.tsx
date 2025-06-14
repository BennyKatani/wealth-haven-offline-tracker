
import { useState } from "react";
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
import { Account, AccountType } from "@/types/finance";
import { generateId } from "@/utils/calculations";
import { storageUtils } from "@/utils/storage";

interface AddAccountSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAccountAdded: () => void;
}

const accountTypes: { value: AccountType; label: string; isAsset?: boolean }[] = [
  { value: "savings", label: "Savings Account", isAsset: true },
  { value: "checking", label: "Checking Account", isAsset: true },
  { value: "investment", label: "Investment Account", isAsset: true },
  { value: "cash", label: "Cash", isAsset: true },
  { value: "real_estate", label: "Real Estate", isAsset: true },
  { value: "vehicle", label: "Vehicle", isAsset: true },
  { value: "crypto", label: "Cryptocurrency", isAsset: true },
  { value: "credit_card", label: "Credit Card", isAsset: false },
  { value: "loan", label: "Loan (Personal, Student)", isAsset: false },
  { value: "mortgage", label: "Mortgage", isAsset: false },
  { value: "other_asset", label: "Other Asset", isAsset: true },
  { value: "other_liability", label: "Other Liability", isAsset: false },
];


export const AddAccountSheet = ({ isOpen, onOpenChange, onAccountAdded }: AddAccountSheetProps) => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState<AccountType | undefined>(undefined);
  const [category, setCategory] = useState("other"); // Default category

  const handleSubmit = () => {
    if (!name || !balance || !type) {
      // TODO: Add proper validation and toast messages
      console.error("Form validation failed");
      return;
    }

    const selectedTypeDetails = accountTypes.find(t => t.value === type);
    if (!selectedTypeDetails) {
        console.error("Invalid account type selected");
        return;
    }

    const newAccount: Account = {
      id: generateId(),
      name,
      balance: parseFloat(balance),
      type,
      isAsset: selectedTypeDetails.isAsset !== undefined ? selectedTypeDetails.isAsset : true, // Default to asset if not specified
      category, // Use the state variable for category
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageUtils.addAccount(newAccount);
    onAccountAdded();
    // Reset form and close sheet
    setName("");
    setBalance("");
    setType(undefined);
    setCategory("other");
    onOpenChange(false);
  };

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
            <Label htmlFor="balance" className="text-left">Current Balance (₪)</Label>
            <Input
              id="balance"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="e.g., 5000"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type" className="text-left">Account Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as AccountType)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((accType) => (
                  <SelectItem key={accType.value} value={accType.value}>
                    {accType.label} ({accType.isAsset ? 'Asset' : 'Liability'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div className="grid gap-2">
            <Label htmlFor="category" className="text-left">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Bank, Investment, Debt"
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
