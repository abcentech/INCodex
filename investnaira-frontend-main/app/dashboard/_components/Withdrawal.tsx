import React from "react";
import { useTransactionSlice } from "@/hook/useTransaction";
import { useState } from "react";

const Withdrawal = () => {
  const [value, setValue] = useState(0);
  const [reason, setReason] = useState("Bills");
  const { withdrawal } = useTransactionSlice();

  const handleWithdrawal = () => {
    withdrawal({ amount: value, description: reason });
  };

  return (
    <div className="mt-14 w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[320px]">
      <div className="relative flex flex-col md:col-span-2 mt-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-7 left-3 px-1"
        >
          Amount
        </label>
        <input
          id="amount"
          name="amount"
          type="text"
          placeholder="Enter amount to Withdraw"
          className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px] text-xs"
          onChange={(e) => setValue(+e.target.value)}
          required
        />
      </div>
      <div className="relative flex flex-col md:col-span-2 mt-4">
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
        >
          Reason
        </label>

        <select
          onChange={(e) => setReason(e.target.value)}
          className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none text-[12px]"
        >
          <option value="Bills">Bills</option>
          <option value="Rent">Rent</option>
          <option value="Milady">Milady</option>
        </select>
      </div>
      <div className="relative flex flex-col md:col-span-2 mt-4">
        <label
          htmlFor="bank"
          className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="text"
          placeholder="Enter password"
          className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px] text-xs"
          required
        />
      </div>

      <div className="relative flex flex-col md:col-span-2 ">
        <button
          onClick={handleWithdrawal}
          className="my-8 flex items-center bg-primary text-white px-4 py-2   rounded-lg transition-colors w-full mx-auto text-center justify-center "
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default Withdrawal;
