
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Account, AccountType } from '@/types/finance';
import { getAccountCategories, generateId } from '@/utils/calculations';
import { storageUtils } from '@/utils/storage';

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountAdded: () => void;
}

export const AddAccountDialog = ({ open, onOpenChange, onAccountAdded }: AddAccountDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '' as AccountType,
    balance: '',
    isAsset: true,
  });

  const accountCategories = getAccountCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.balance) {
      return;
    }

    const account: Account = {
      id: generateId(),
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
      isAsset: formData.isAsset,
      category: formData.type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageUtils.addAccount(account);
    onAccountAdded();
    
    // Reset form
    setFormData({
      name: '',
      type: '' as AccountType,
      balance: '',
      isAsset: true,
    });
  };

  const handleTabChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      isAsset: value === 'assets',
      type: '' as AccountType,
    }));
  };

  const categories = formData.isAsset ? accountCategories.assets : accountCategories.liabilities;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="assets" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assets">Asset</TabsTrigger>
              <TabsTrigger value="liabilities">Liability</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assets" className="space-y-4">
              <div>
                <Label htmlFor="asset-type">Account Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as AccountType }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountCategories.assets.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="liabilities" className="space-y-4">
              <div>
                <Label htmlFor="liability-type">Account Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as AccountType }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountCategories.liabilities.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <div>
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Chase Checking, Vanguard 401k"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="balance">Current Balance</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.balance}
              onChange={(e) => setFormData(prev => ({ ...prev, balance: e.target.value }))}
              required
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
