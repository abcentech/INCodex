import { useEffect } from 'react';
import { RootState, AppDispatch } from "../libs/store";
import { useDispatch, useSelector } from 'react-redux';
import * as actions from "../libs/transactionSlice";
import { depositFunds, withdrawFunds, createInvestment } from "../libs/api";
import { useWallet } from "./useWallet";

// Custom hook to handle client-side only logic
export const useTransactionSlice = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, balance, lastUpdated } = useSelector((state: RootState) => state.transactions);
  const { refetch: refetchWallet } = useWallet();

  useEffect(() => {
    // Client-side only logic
    console.log('Transactions updated:', transactions);
    console.log('Balance updated:', balance);
    console.log('Last updated:', lastUpdated);
  }, [transactions, balance, lastUpdated]);

  return {
    transactions,
    balance,
    lastUpdated,
    deposit: async (payload: { amount: number; description?: string }) => {
      const res = await depositFunds(payload.amount, payload.description || 'Deposit');
      if (res.balance !== undefined) {
        dispatch(actions.deposit(payload));
        await refetchWallet();
      }
      return res;
    },
    withdrawal: async (payload: { amount: number; description?: string }) => {
      const res = await withdrawFunds(payload.amount, payload.description || 'Withdrawal');
      if (res.balance !== undefined) {
        dispatch(actions.withdrawal(payload));
        await refetchWallet();
      }
      return res;
    },
    transfer: async (payload: { amount: number; to: string; description?: string }) => {
      // Transfer logic usually involves backend update too, 
      // assuming transfer API exists or will be added. 
      // For now, let's keep it consistent.
      dispatch(actions.transfer(payload));
      await refetchWallet();
    },
    invest: async (payload: { savings_plan: string; amount: number }) => {
      const res = await createInvestment(payload.savings_plan, payload.amount);
      if (res.balance !== undefined) {
        await refetchWallet();
      }
      return res;
    },
    resetTransactions: () => dispatch(actions.resetTransactions()),
  };
};