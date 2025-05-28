import React from "react";
import { useState } from "react";
// import { useTransactionSlice } from "@/hook/useTransaction";

const Deposit = () => {
  const [value, setValue] = useState(0);
  // const { deposit } = useTransactionSlice();

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
      onSuccess: (response: any) => {
        console.log("Payment successful:", response);
        alert("Payment successful!");
      },
      onFailed: (response: any) => {
        console.error("Payment failed:", response);
        alert("Payment failed.");
      },
    });
  };

  return (
    <div className="relative w-full mx-auto">
      <div className="relative w-80 mx-auto h-full mt-16">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
        >
          Amount
        </label>
        <input
          id="amount"
          name="amount"
          type="text"
          placeholder="Enter Amount to Deposit"
          className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
          onChange={(e) => setValue(+e.target.value)}
          required
        />
      </div>
      <div className="relative mx-auto h-full w-80 mt-10">
        <button
          onClick={handleDeposit}
          className="mt-4 w-80 bg-primary text-white px-4 py-2 rounded-lg"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default Deposit;
