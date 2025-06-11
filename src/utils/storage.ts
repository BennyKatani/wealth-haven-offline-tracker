
import { Account, BalanceHistory, Goal, UserSettings } from '@/types/finance';

const STORAGE_KEYS = {
  ACCOUNTS: 'networth_accounts',
  HISTORY: 'networth_history',
  GOALS: 'networth_goals',
  SETTINGS: 'networth_settings',
  LAST_UPDATE: 'networth_last_update'
};

export const storageUtils = {
  // Accounts
  getAccounts(): Account[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading accounts:', error);
      return [];
    }
  },

  saveAccounts(accounts: Account[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());
      console.log('Accounts saved successfully');
    } catch (error) {
      console.error('Error saving accounts:', error);
    }
  },

  addAccount(account: Account): void {
    const accounts = this.getAccounts();
    accounts.push(account);
    this.saveAccounts(accounts);
  },

  updateAccount(accountId: string, updates: Partial<Account>): void {
    const accounts = this.getAccounts();
    const index = accounts.findIndex(acc => acc.id === accountId);
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveAccounts(accounts);
    }
  },

  deleteAccount(accountId: string): void {
    const accounts = this.getAccounts().filter(acc => acc.id !== accountId);
    this.saveAccounts(accounts);
  },

  // Balance History
  getBalanceHistory(): BalanceHistory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading balance history:', error);
      return [];
    }
  },

  saveBalanceHistory(history: BalanceHistory[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      console.log('Balance history saved successfully');
    } catch (error) {
      console.error('Error saving balance history:', error);
    }
  },

  addBalanceEntry(entry: BalanceHistory): void {
    const history = this.getBalanceHistory();
    history.push(entry);
    this.saveBalanceHistory(history);
  },

  // Goals
  getGoals(): Goal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading goals:', error);
      return [];
    }
  },

  saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      console.log('Goals saved successfully');
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  },

  addGoal(goal: Goal): void {
    const goals = this.getGoals();
    goals.push(goal);
    this.saveGoals(goals);
  },

  updateGoal(goalId: string, updates: Partial<Goal>): void {
    const goals = this.getGoals();
    const index = goals.findIndex(goal => goal.id === goalId);
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveGoals(goals);
    }
  },

  deleteGoal(goalId: string): void {
    const goals = this.getGoals().filter(goal => goal.id !== goalId);
    this.saveGoals(goals);
  },

  // Settings
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        currency: 'USD',
        currencySymbol: '$',
        locale: 'en-US'
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        currency: 'USD',
        currencySymbol: '$',
        locale: 'en-US'
      };
    }
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // Utility
  clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
};
