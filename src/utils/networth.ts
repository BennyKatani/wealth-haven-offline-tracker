
export const STORAGE_KEYS = {
  ACCOUNTS: 'networth_accounts',
  GOALS: 'networth_goals',
  SETTINGS: 'networth_settings'
};

export const storageUtils = {
  getAccounts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading accounts:', error);
      return [];
    }
  },

  saveAccounts(accounts: any[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (error) {
      console.error('Error saving accounts:', error);
    }
  },

  addAccount(account: any) {
    const accounts = this.getAccounts();
    accounts.push(account);
    this.saveAccounts(accounts);
  },

  updateAccount(accountId: string, updates: any) {
    const accounts = this.getAccounts();
    const index = accounts.findIndex((acc: any) => acc.id === accountId);
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveAccounts(accounts);
    }
  },

  deleteAccount(accountId: string) {
    const accounts = this.getAccounts().filter((acc: any) => acc.id !== accountId);
    this.saveAccounts(accounts);
  },

  getGoals() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading goals:', error);
      return [];
    }
  },

  saveGoals(goals: any[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  },

  addGoal(goal: any) {
    const goals = this.getGoals();
    goals.push(goal);
    this.saveGoals(goals);
  },

  updateGoal(goalId: string, updates: any) {
    const goals = this.getGoals();
    const index = goals.findIndex((goal: any) => goal.id === goalId);
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveGoals(goals);
    }
  },

  deleteGoal(goalId: string) {
    const goals = this.getGoals().filter((goal: any) => goal.id !== goalId);
    this.saveGoals(goals);
  }
};
