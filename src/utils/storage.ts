
import { Account, BalanceHistory, Goal } from '@/types/finance';

const STORAGE_KEYS = {
  ACCOUNTS: 'networth_accounts',
  HISTORY: 'networth_history',
  GOALS: 'networth_goals',
  LAST_UPDATE: 'networth_last_update'
};

export const storageUtils = {
  // Accounts
  getAccounts(): Account[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return data ? JSON.parse(data) : [];
  },

  saveAccounts(accounts: Account[]): void {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());
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
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },

  saveBalanceHistory(history: BalanceHistory[]): void {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  addBalanceEntry(entry: BalanceHistory): void {
    const history = this.getBalanceHistory();
    history.push(entry);
    this.saveBalanceHistory(history);
  },

  // Goals
  getGoals(): Goal[] {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  },

  saveGoals(goals: Goal[]): void {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
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

  // Utility
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
