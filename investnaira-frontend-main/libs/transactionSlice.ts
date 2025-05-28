import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

// Define the transaction types
export type TransactionType = "deposit" | "withdrawal" | "transfer";

// Define the Transaction interface
export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  date: string;
  description?: string;
}

// Define the initial state interface
export interface TransactionState {
  transactions: Transaction[];
  balance: number;
  lastUpdated: number | null;
}

// Initial state
const initialState: TransactionState = {
  transactions: [],
  balance: 0,
  lastUpdated: null,
};

// Create the transaction slice
const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    // Deposit action
    deposit: (
      state,
      action: PayloadAction<{ amount: number; description?: string }>
    ) => {
      const { amount, description } = action.payload;
      const newTransaction: Transaction = {
        id: nanoid(),
        amount,
        type: "deposit",
        date: new Date().toISOString(),
        description,
      };

      state.transactions.unshift(newTransaction);
      state.balance += amount;
      state.lastUpdated = Date.now();
    },

    // Withdrawal action
    withdrawal: (
      state,
      action: PayloadAction<{ amount: number; description?: string }>
    ) => {
      const { amount, description } = action.payload;

      if (amount > state.balance) {
        throw new Error("Insufficient funds");
      }

      const newTransaction: Transaction = {
        id: nanoid(),
        amount,
        type: "withdrawal",
        date: new Date().toISOString(),
        description,
      };

      state.transactions.unshift(newTransaction);
      state.balance -= amount;
      state.lastUpdated = Date.now();
    },

    // Transfer action
    transfer: (
      state,
      action: PayloadAction<{
        amount: number;
        to: string;
        description?: string;
      }>
    ) => {
      const { amount, to, description } = action.payload;

      if (amount > state.balance) {
        throw new Error("Insufficient funds");
      }

      const newTransaction: Transaction = {
        id: nanoid(),
        amount,
        type: "transfer",
        date: new Date().toISOString(),
        description: `Transfer to ${to}`,
      };

      state.transactions.unshift(newTransaction);
      state.balance -= amount;
      state.lastUpdated = Date.now();
    },

    // Reset transactions and balance
    resetTransactions: (state) => {
      state.transactions = [];
      state.balance = 0;
    },
  },
});

// Export actions and reducer
export const { deposit, withdrawal, transfer, resetTransactions } =
  transactionSlice.actions;

export default transactionSlice.reducer;
