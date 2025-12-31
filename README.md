# Expense Tracker

This is a frontend expense tracking application inspired by Splitwise.  
It is built to showcase frontend logic, state management, and clean user interaction rather than backend complexity.

The application runs entirely in the browser and stores data locally.

---

## What the App Does

The app helps a group track shared expenses and see who owes money and who is owed.

You can:
- Add, edit, and delete participants
- Add, edit, and delete expenses
- Assign a category to each expense
- Filter expenses by participant or category
- Automatically calculate balances
- Keep data saved between page reloads

---

## How It Works

### Participants
- Participants can be added, edited, or deleted
- Duplicate names are not allowed
- A participant cannot be deleted if they are used in any expense

### Expenses
- Each expense has:
  - Description
  - Amount
  - Person who paid
  - Category
- Expenses are split equally among all participants
- Expenses can be edited or deleted
- Delete actions require confirmation

### Balance Calculation
- Balances are calculated automatically
- Balances are not stored directly
- Each participant’s balance is derived from all expenses
- Positive balance means the person is owed money
- Negative balance means the person owes money

### Filters
- Expenses can be filtered by:
  - Participant
  - Category
- Filters only affect what is shown on screen, not stored data

### Data Storage
- All data is stored using `localStorage`
- Data is restored automatically when the page reloads

---

## Tech Used

- HTML
- Tailwind CSS (CDN)
- Vanilla JavaScript (ES modules)
- localStorage for persistence

The app also respects the user’s system light or dark theme.

---

## Project Structure

expense-tracker/
│
├── index.html # UI layout
├── app.js # UI logic and state handling
├── store.js # Data storage logic
├── logic.js # Balance calculation logic
└── utils.js # Helper functions

## Running the App Locally

Because this project uses JavaScript ES modules, it must be served through a local server.

### Using VS Code Live Server
- Open the project folder in VS Code
- Right-click `index.html`
- Select **Open with Live Server**

The app will open automatically in your browser.

---

## Deployment

The application is deployed using **Netlify** and runs entirely on the client side.

It is intended as a portfolio project and frontend showcase.

---

## Notes

- This project focuses on frontend logic and clean architecture
- Business logic is separated from UI rendering
- All calculations are derived to avoid inconsistent state
- The storage layer is isolated and can be replaced with a backend later
- Features were added deliberately to avoid unnecessary complexity

---

## Future Improvements

Possible future enhancements include:
- Replacing `localStorage` with a backend API
- Supporting multiple groups
- User authentication
- Custom expense splits
- Expense summaries and analytics

These features were intentionally left out of the current version to keep the project focused and maintainable.
