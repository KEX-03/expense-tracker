import { loadState, saveState } from './store.js';
import { calculateBalances } from './logic.js';
import { uid, formatCurrency } from './Utils.js';

const state = loadState();
let editingExpenseId = null;

/* DOM */
const participantsList = document.getElementById('participantsList');
const expensesList = document.getElementById('expensesList');
const balancesList = document.getElementById('balancesList');

const participantInput = document.getElementById('participantInput');
const addParticipantBtn = document.getElementById('addParticipantBtn');

const expenseForm = document.getElementById('expenseForm');
const expenseDesc = document.getElementById('expenseDesc');
const expenseAmount = document.getElementById('expenseAmount');
const paidBySelect = document.getElementById('paidBy');
const expenseCategory = document.getElementById('expenseCategory');
const expenseSubmitBtn = expenseForm.querySelector('button');

const filterPerson = document.getElementById('filterPerson');
const filterCategory = document.getElementById('filterCategory');

/* Participants */

function renderParticipants() {
  participantsList.innerHTML = '';
  paidBySelect.innerHTML = '';
  filterPerson.innerHTML = `<option value="">All People</option>`;

  if (!state.participants.length) {
    participantsList.innerHTML =
      `<li class="text-gray-500 dark:text-gray-400">No participants yet.</li>`;
    resetEditState();
    return;
  }

  state.participants.forEach(p => {
    participantsList.innerHTML += `
      <li class="flex justify-between bg-white dark:bg-gray-800 px-4 py-2 rounded">
        <span>${p.name}</span>
        <div class="flex gap-2 text-sm">
          <button data-id="${p.id}" class="edit-participant text-blue-600">Edit</button>
          <button data-id="${p.id}" class="delete-participant text-red-600">Delete</button>
        </div>
      </li>`;
    paidBySelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
    filterPerson.innerHTML += `<option value="${p.id}">${p.name}</option>`;
  });

  attachParticipantHandlers();
  resetEditState();
}

function attachParticipantHandlers() {
  document.querySelectorAll('.delete-participant').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const used = state.expenses.some(e => e.paidBy === id || e.splitAmong.includes(id));
      if (used) return alert('Cannot delete participant with expenses.');
      state.participants = state.participants.filter(p => p.id !== id);
      saveState(state);
      renderAll();
    };
  });

  document.querySelectorAll('.edit-participant').forEach(btn => {
    btn.onclick = () => {
      const p = state.participants.find(p => p.id === btn.dataset.id);
      const name = prompt('Edit name:', p.name);
      if (!name?.trim()) return;
      if (state.participants.some(x => x.id !== p.id && x.name.toLowerCase() === name.toLowerCase()))
        return alert('Duplicate name.');
      p.name = name.trim();
      saveState(state);
      renderAll();
    };
  });
}

/* Expenses */

function renderExpenses() {
  expensesList.innerHTML = '';

  let filtered = [...state.expenses];

  if (filterPerson.value) {
    filtered = filtered.filter(e =>
      e.paidBy === filterPerson.value || e.splitAmong.includes(filterPerson.value)
    );
  }

  if (filterCategory.value) {
    filtered = filtered.filter(e => e.category === filterCategory.value);
  }

  if (!filtered.length) {
    expensesList.innerHTML =
      `<li class="text-gray-500 dark:text-gray-400">No expenses found.</li>`;
    return;
  }

  filtered.forEach(exp => {
    const payer = state.participants.find(p => p.id === exp.paidBy)?.name || 'Unknown';
    expensesList.innerHTML += `
      <li class="bg-white dark:bg-gray-800 px-4 py-3 rounded flex justify-between">
        <div>
          <p class="font-medium">${exp.description}</p>
          <p class="text-sm text-gray-500">
            ${formatCurrency(exp.amount)} • ${exp.category} • Paid by ${payer}
          </p>
        </div>
        <div class="flex gap-2">
          <button data-id="${exp.id}" class="edit-expense text-blue-600">Edit</button>
          <button data-id="${exp.id}" class="delete-expense text-red-600">Delete</button>
        </div>
      </li>`;
  });

  attachExpenseHandlers();
}

function attachExpenseHandlers() {
  document.querySelectorAll('.delete-expense').forEach(btn => {
    btn.onclick = () => {
      if (!confirm('Delete this expense?')) return;
      state.expenses = state.expenses.filter(e => e.id !== btn.dataset.id);
      saveState(state);
      renderAll();
    };
  });

  document.querySelectorAll('.edit-expense').forEach(btn => {
    btn.onclick = () => {
      const exp = state.expenses.find(e => e.id === btn.dataset.id);
      editingExpenseId = exp.id;
      expenseDesc.value = exp.description;
      expenseAmount.value = exp.amount;
      paidBySelect.value = exp.paidBy;
      expenseCategory.value = exp.category;
      expenseSubmitBtn.textContent = 'Update Expense';
    };
  });
}

/* Balances */

function renderBalances() {
  balancesList.innerHTML = '';

  if (!state.expenses.length) {
    balancesList.innerHTML =
      `<li class="text-gray-500 dark:text-gray-400">No balances yet.</li>`;
    return;
  }

  const balances = calculateBalances(state.participants, state.expenses);
  Object.entries(balances).forEach(([id, amt]) => {
    const p = state.participants.find(p => p.id === id);
    balancesList.innerHTML += `
      <li class="${amt < 0 ? 'text-red-500' : 'text-green-500'}">
        ${p.name}: ${formatCurrency(amt)}
      </li>`;
  });
}

/* Handlers */

addParticipantBtn.onclick = () => {
  const name = participantInput.value.trim();
  if (!name) return;
  if (state.participants.some(p => p.name.toLowerCase() === name.toLowerCase()))
    return alert('Duplicate participant.');
  state.participants.push({ id: uid(), name });
  participantInput.value = '';
  saveState(state);
  renderAll();
};

expenseForm.onsubmit = e => {
  e.preventDefault();
  if (!state.participants.length) return;

  const data = {
    description: expenseDesc.value.trim(),
    amount: Number(expenseAmount.value),
    paidBy: paidBySelect.value,
    category: expenseCategory.value,
    splitAmong: state.participants.map(p => p.id)
  };

  if (!data.description || data.amount <= 0) return;

  if (editingExpenseId) {
    Object.assign(state.expenses.find(e => e.id === editingExpenseId), data);
    resetEditState();
  } else {
    state.expenses.push({ id: uid(), ...data });
  }

  expenseForm.reset();
  saveState(state);
  renderAll();
};

filterPerson.onchange = renderExpenses;
filterCategory.onchange = renderExpenses;

/* Helpers */

function resetEditState() {
  editingExpenseId = null;
  expenseSubmitBtn.textContent = 'Add Expense';
}

/* Init */

function renderAll() {
  renderParticipants();
  renderExpenses();
  renderBalances();
}

renderAll();
