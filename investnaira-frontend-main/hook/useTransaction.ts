import { useEffect } from 'react';
import { RootState, AppDispatch } from "../libs/store";
import { useDispatch, useSelector } from 'react-redux';
import { deposit, withdrawal, transfer, resetTransactions } from "../libs/transactionSlice";


// Custom hook to handle client-side only logic
export const useTransactionSlice = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { transactions, balance, lastUpdated } = useSelector((state: RootState ) => state.transactions);
  
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
      deposit: (payload: { amount: number; description?: string }) => dispatch(deposit(payload)),
      withdrawal: (payload: { amount: number; description?: string }) => dispatch(withdrawal(payload)),
      transfer: (payload: { amount: number; to: string; description?: string }) => dispatch(transfer(payload)),
      resetTransactions: () => dispatch(resetTransactions()),
    };
  };