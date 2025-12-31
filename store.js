const STORAGE_KEY = 'expense-tracker';

export function loadState() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    participants: [],
    expenses: []
  };
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
