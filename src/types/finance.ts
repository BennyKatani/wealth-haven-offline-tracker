
export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  isAsset: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface BalanceHistory {
  id: string;
  accountId: string;
  balance: number;
  date: string;
  note?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: GoalCategory;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  currency: string;
  currencySymbol: string;
  locale: string;
}

export type AccountType =
  | 'checking'
  | 'savings'
  | 'investment'
  | 'retirement'
  | 'property'
  | 'vehicle'
  | 'crypto'
  | 'cash'
  | 'credit_card'
  | 'loan'
  | 'mortgage'
  | 'other';

export type GoalCategory = 
  | 'retirement'
  | 'emergency_fund'
  | 'house'
  | 'vacation'
  | 'debt_payoff'
  | 'other';

export interface NetWorthSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyChange: number;
  changePercentage: number;
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel' },
];
