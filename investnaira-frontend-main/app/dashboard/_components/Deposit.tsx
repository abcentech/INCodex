"use client";
import React, { useState } from "react";
import { useTransactionSlice } from "@/hook/useTransaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Deposit = () => {
  const [value, setValue] = useState(0);
  const { deposit } = useTransactionSlice();

  const handleDeposit = () => {
    if (value <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    // Initialize Korapay modal
    (window as any).Korapay?.initialize({
      key: "pk_test_vU6kCye4EXe4CAkkaoHGdrQbkxz7fkQi1QL5EDqM",
      reference: `txn-${Date.now()}`,
      amount: value,
      currency: "NGN",
      customer: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
      onSuccess: async (response: any) => {
        console.log("Payment successful:", response);
        try {
          await deposit({ amount: value, description: "Korapay Deposit" });
          alert("Payment successful and wallet updated!");
        } catch (err) {
          console.error(err);
          alert("Payment successful but wallet update failed.");
        }
      },
      onFailed: (response: any) => {
        console.error("Payment failed:", response);
        alert("Payment failed.");
      },
    });
  };

  return (
    <Card className="max-w-md mx-auto p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white font-rowdies text-center">Fund Your Wallet</CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-6">
        <div className="relative group">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
          >
            Amount to Deposit (₦)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold z-10">₦</span>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="50,000"
              className="w-full pl-10 h-14 bg-gray-50 dark:bg-slate-800/50 text-lg font-bold rounded-xl border-gray-200 dark:border-slate-700"
              onChange={(e) => setValue(+e.target.value)}
              required
            />
          </div>
        </div>

        <Button
          onClick={handleDeposit}
          className="w-full h-14 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transform hover:-translate-y-0.5 transition-all duration-200 text-lg border-none"
        >
          Proceed to Payment
        </Button>

        <p className="text-center text-xs text-gray-400">
          Secured by Korapay. Your funds are safe.
        </p>
      </CardContent>
    </Card>
  );
};

export default Deposit;
