
import { Account, BalanceHistory, NetWorthSummary } from '@/types/finance';
import { storageUtils } from './storage';

export const formatCurrency = (amount: number): string => {
  const settings = storageUtils.getSettings();
  return new Intl.NumberFormat(settings.locale, {
    style: 'currency',
    currency: settings.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export const calculateNetWorth = (accounts: Account[]): NetWorthSummary => {
  const assets = accounts.filter(acc => acc.isAsset);
  const liabilities = accounts.filter(acc => !acc.isAsset);
  
  const totalAssets = assets.reduce((sum, acc) => sum + acc.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, acc) => sum + acc.balance, 0);
  const netWorth = totalAssets - totalLiabilities;

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    monthlyChange: 0, // This would be calculated from historical data
    changePercentage: 0, // This would be calculated from historical data
  };
};

export const getAccountTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    checking: 'Checking Account',
    savings: 'Savings Account',
    investment: 'Investment Account',
    retirement: 'Retirement Account',
    property: 'Real Estate',
    vehicle: 'Vehicle',
    crypto: 'Cryptocurrency',
    credit_card: 'Credit Card',
    loan: 'Loan',
    mortgage: 'Mortgage',
    other: 'Other',
  };
  return labels[type] || type;
};

export const getAccountCategories = () => ({
  assets: [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'investment', label: 'Investment Account' },
    { value: 'retirement', label: 'Retirement Account (401k, IRA)' },
    { value: 'property', label: 'Real Estate' },
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'other', label: 'Other Asset' },
  ],
  liabilities: [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'loan', label: 'Personal Loan' },
    { value: 'mortgage', label: 'Mortgage' },
    { value: 'other', label: 'Other Debt' },
  ],
});

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
