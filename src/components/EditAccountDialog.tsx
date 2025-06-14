
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Account, AccountType } from '@/types/finance';
import { getAccountCategories } from '@/utils/calculations';
import { storageUtils } from '@/utils/storage';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface EditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  onAccountUpdated: () => void;
}

const accountCategories = getAccountCategories();
const allAccountTypes = [
  ...accountCategories.assets.map((c) => c.value),
  ...accountCategories.liabilities.map((c) => c.value),
] as [AccountType, ...AccountType[]];

const formSchema = z.object({
  name: z.string().min(1, { message: "Account name is required." }),
  balance: z.coerce.number({ invalid_type_error: "Please enter a valid number." }).positive({ message: "Balance must be positive." }),
  isAsset: z.boolean(),
  type: z.enum(allAccountTypes, {
    errorMap: () => ({ message: "Please select an account type." }),
  }),
});


export const EditAccountDialog = ({ open, onOpenChange, account, onAccountUpdated }: EditAccountDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      balance: 0,
      isAsset: true,
    },
  });

  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        balance: account.balance,
        isAsset: account.isAsset,
        type: account.type,
      });
    }
  }, [account, open, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!account) return;

    const updates = {
      name: values.name,
      type: values.type,
      balance: values.balance,
      isAsset: values.isAsset,
      category: values.type,
    };

    storageUtils.updateAccount(account.id, updates);
    onAccountUpdated();
    onOpenChange(false);
  };
  
  const isAsset = form.watch('isAsset');

  const handleTabChange = (value: string) => {
    const newIsAsset = value === 'assets';
    form.setValue('isAsset', newIsAsset);
    form.setValue('type', undefined as any, { shouldValidate: true });
  };

  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Make changes to your account here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs value={isAsset ? 'assets' : 'liabilities'} onValueChange={handleTabChange} className="pt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="assets">Asset</TabsTrigger>
                <TabsTrigger value="liabilities">Liability</TabsTrigger>
              </TabsList>
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="pt-4">
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(isAsset ? accountCategories.assets : accountCategories.liabilities).map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Tabs>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Chase Checking, Vanguard 401k" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
