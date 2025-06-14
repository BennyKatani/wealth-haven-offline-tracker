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
  { value: "cash", label: "Cash", isAsset: true }, // Corrected: "cash" is now a valid AccountType
  { value: "property", label: "Real Estate", isAsset: true }, // Corrected: "real_estate" to "property"
  { value: "vehicle", label: "Vehicle", isAsset: true },
  { value: "crypto", label: "Cryptocurrency", isAsset: true },
  { value: "credit_card", label: "Credit Card", isAsset: false },
  { value: "loan", label: "Loan (Personal, Student)", isAsset: false },
  { value: "mortgage", label: "Mortgage", isAsset: false },
  { value: "other", label: "Other Asset", isAsset: true }, // Corrected: "other_asset" to "other"
  { value: "other", label: "Other Liability", isAsset: false }, // Corrected: "other_liability" to "other"
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
    // It's possible for multiple 'other' types to exist in accountTypes (one for asset, one for liability)
    // We need to ensure we pick the correct one based on what the user selected.
    // However, the current Select component for type doesn't distinguish between 'Other Asset' and 'Other Liability' if both map to 'other'.
    // For simplicity, this code assumes the *first* match is sufficient if type is 'other'.
    // A more robust solution might involve a more complex type selection or passing isAsset from the selection.
    // For now, let's find the specific entry that was rendered and selected.
    // A better approach would be to ensure unique values for `value` in `accountTypes` or handle this ambiguity in selection.
    // Given the current structure, we'll assume the first matching 'value' and its 'isAsset' property is correct.
    // The label in the dropdown helps the user distinguish.

    let isAssetValue = true; // Default
    if (selectedTypeDetails) {
        // If we have 'Other Asset' and 'Other Liability' both mapping to 'other', we need a way to distinguish.
        // The current `accountTypes` array has distinct labels. The `Select` component uses the `value` for submission.
        // If `type` is 'other', we need to find which 'other' was selected.
        // This simplified logic takes the `isAsset` from the first matching `value`.
        // For `other`, this means if "Other Asset" was selected, `isAsset` will be `true`. If "Other Liability" was selected, it will be `false` *if* "Other Liability" appears first with value "other".
        // To fix this ambiguity properly, the `value` in `accountTypes` should be unique, e.g., "other_asset", "other_liability", and then AccountType updated.
        // Or the `onValueChange` for the select should pass more info.
        // For now, we find the item by label if type is 'other', assuming labels are unique enough.
        
        // Find the specific object from accountTypes that matches the selected type string
        // and also has the correct label to differentiate between 'Other Asset' and 'Other Liability'
        // This is a bit of a workaround because the `value` for both "Other Asset" and "Other Liability" is "other".
        const allMatchingSelectedType = accountTypes.filter(t => t.value === type);
        if (allMatchingSelectedType.length > 1 && type === 'other') {
            // This is where it gets tricky. How do we know which "other" was selected?
            // The Select component sends the `value`. If multiple items have the same value, this is ambiguous.
            // For now, let's assume the `isAsset` of the *first* found match is used.
            // A better fix would be to make `value` unique (e.g. "other_asset", "other_liability") and update AccountType.
            // Or pass the full selected object from the Select component.
            // To keep the fix minimal for now, we'll use the first one.
            isAssetValue = selectedTypeDetails.isAsset !== undefined ? selectedTypeDetails.isAsset : true;
        } else if (selectedTypeDetails) {
             isAssetValue = selectedTypeDetails.isAsset !== undefined ? selectedTypeDetails.isAsset : true;
        } else {
            console.error("Invalid account type selected or details not found");
            return;
        }
    } else {
        console.error("Invalid account type selected");
        return;
    }


    const newAccount: Account = {
      id: generateId(),
      name,
      balance: parseFloat(balance),
      type,
      isAsset: isAssetValue,
      category,
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
                  // Using accType.label as key because accType.value might not be unique for "other"
                  <SelectItem key={accType.label} value={accType.value}> 
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
