"use client";
import React, { useState } from "react";
import { useTransactionSlice } from "@/hook/useTransaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Withdrawal = () => {
  const [value, setValue] = useState(0);
  const [reason, setReason] = useState("Bills");
  const { withdrawal } = useTransactionSlice();

  const handleWithdrawal = async () => {
    try {
      const res = await withdrawal({ amount: value, description: reason });
      if (res.balance !== undefined) {
        alert("Withdrawal successful!");
      } else {
        alert(res.detail || "Withdrawal failed.");
      }
    } catch (err: any) {
      alert(err.message || "Withdrawal failed.");
    }
  };

  return (
    <Card className="max-w-md mx-auto p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white font-rowdies text-center">Withdraw Funds</CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-6">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
          >
            Amount to Withdraw
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold z-10">₦</span>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter amount"
              className="w-full pl-10 h-14 bg-gray-50 dark:bg-slate-800/50 text-lg font-bold rounded-xl border-gray-200 dark:border-slate-700"
              onChange={(e) => setValue(+e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
          >
            Reason
          </label>
          <Select onValueChange={setReason} defaultValue="Bills">
            <SelectTrigger className="w-full h-14 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl text-base">
              <SelectValue placeholder="Select Reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bills">Bills</SelectItem>
              <SelectItem value="Rent">Rent</SelectItem>
              <SelectItem value="Leisure">Leisure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
          >
            Confirm Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full h-14 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 text-base rounded-xl"
            required
          />
        </div>

        <Button
          onClick={handleWithdrawal}
          variant="destructive"
          className="w-full h-14 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transform hover:-translate-y-0.5 transition-all duration-200 text-lg mt-4 border-none"
        >
          Proceed Withdrawal
        </Button>
      </CardContent>
    </Card>
  );
};

export default Withdrawal;
