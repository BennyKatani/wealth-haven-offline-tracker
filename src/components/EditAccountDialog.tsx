
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Account, AccountType } from '@/types/finance';
import { getAccountCategories } from '@/utils/calculations';
import { storageUtils } from '@/utils/storage';

interface EditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  onAccountUpdated: () => void;
}

export const EditAccountDialog = ({ open, onOpenChange, account, onAccountUpdated }: EditAccountDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '' as AccountType,
    balance: '',
    isAsset: true,
    category: '',
  });

  const accountCategories = getAccountCategories();

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        type: account.type,
        balance: account.balance.toString(),
        isAsset: account.isAsset,
        category: account.category,
      });
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.balance || !account) {
      return;
    }

    const updates = {
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
      isAsset: formData.isAsset,
      category: formData.type, // Update category to match type
    };

    storageUtils.updateAccount(account.id, updates);
    onAccountUpdated();
    onOpenChange(false);
  };

  const handleTabChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      isAsset: value === 'assets',
      type: '' as AccountType,
    }));
  };

  const categories = formData.isAsset ? accountCategories.assets : accountCategories.liabilities;

  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={formData.isAsset ? 'assets' : 'liabilities'} onValueChange={handleTabChange}>
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
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
