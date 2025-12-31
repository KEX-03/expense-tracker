# Expense Tracker (Splitwise-Inspired)

A frontend-focused expense tracking application inspired by Splitwise.  
This project is designed to demonstrate real-world frontend logic, state management, and user-centric UX decisions without relying on a backend.

The emphasis is on **clarity, correctness, and maintainable architecture** rather than feature bloat.

---

## Features

### Participants
- Add, edit, and delete participants
- Prevents deletion of participants involved in expenses
- Duplicate name detection (case-insensitive)

### Expenses
- Add, edit, and delete expenses
- Equal split calculation across all participants
- Expense categories (Food, Travel, Utilities, Other)
- Confirmation before destructive actions

### Filters
- Filter expenses by participant
- Filter expenses by category
- Filters update results dynamically

### Balances
- Automatic calculation of who owes whom
- Clear distinction between positive and negative balances
- Derived data (balances are never stored directly)

### Persistence
- Application state stored in `localStorage`
- Data restored on page reload

---

## Tech Stack

**Frontend**
- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript (ES modules)

**Utilities**
- `localStorage` for persistence
- System-based light/dark theme support

---

## Architecture Overview

The project is intentionally structured to separate concerns and remain future-proof.

