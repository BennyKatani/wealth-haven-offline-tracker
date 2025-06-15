
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserSettings, CURRENCIES } from '@/types/finance';
import { Euro, PoundSterling, DollarSign } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSettingsUpdated: () => void;
}

const currencyIcons: { [key: string]: React.ElementType } = {
  USD: DollarSign,
  EUR: Euro,
  GBP: PoundSterling,
};

const defaultSettings: UserSettings = {
  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US'
};

export const SettingsDialog = ({ open, onOpenChange, onSettingsUpdated }: SettingsDialogProps) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      if (open && user) {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setSettings({
            currency: data.currency,
            currencySymbol: data.currency_symbol,
            locale: data.locale,
          });
        } else if (error && error.code !== 'PGRST116') { // Ignore 'no rows found'
          toast.error("Failed to load settings.");
        }
      }
    };
    fetchSettings();
  }, [open, user]);

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    if (currency) {
      setSettings(prev => ({
        ...prev,
        currency: currency.code,
        currencySymbol: currency.symbol,
      }));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    const { error } = await supabase.from('user_settings').upsert({
      user_id: user.id,
      currency: settings.currency,
      currency_symbol: settings.currencySymbol,
      locale: settings.locale,
      updated_at: new Date().toISOString()
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Settings saved successfully!');
      onSettingsUpdated();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Currency</Label>
            <RadioGroup value={settings.currency} onValueChange={handleCurrencyChange} className="pt-2 space-y-2">
              {CURRENCIES.map((currency) => {
                const Icon = currencyIcons[currency.code];
                return (
                  <div key={currency.code} className="flex items-center space-x-3">
                    <RadioGroupItem value={currency.code} id={currency.code} />
                    <Label htmlFor={currency.code} className="flex items-center gap-2 font-normal cursor-pointer text-sm">
                      {Icon ? <Icon className="h-5 w-5 text-muted-foreground" /> : <span className="w-5 text-center font-semibold text-muted-foreground">{currency.symbol}</span>}
                      <span>{currency.name} ({currency.code})</span>
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
