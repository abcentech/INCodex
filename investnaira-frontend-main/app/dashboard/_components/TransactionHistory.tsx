import React from "react";
import { MdMoving } from "react-icons/md";
import { FaArrowTrendDown } from "react-icons/fa6";
import { useTransactionSlice } from "@/hook/useTransaction";

const TransactionHistory = () => {
  const { transactions, resetTransactions } = useTransactionSlice();
  // const transactions = [
  //   { id: 1, amount: "₦100,000.70", action: "Wallet Deposit", date: "25th July, 2024", time: "4:31 PM", type: "deposit" },
  //   { id: 2, amount: "₦55,000.00", action: "Investment ROI", date: "25th July, 2024", time: "4:31 PM", type: "withdrawal" },
  //   { id: 3, amount: "₦14,000.25", action: "Wallet Deposit", date: "25th July, 2024", time: "4:31 PM", type: "deposit" },
  //   { id: 4, amount: "₦100,000.70", action: "Wallet Deposit", date: "25th July, 2024", time: "4:31 PM", type: "deposit" },
  //   { id: 5, amount: "₦55,000.00", action: "Investment ROI", date: "25th July, 2024", time: "4:31 PM", type: "withdrawal" },
  // ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
            >
              Action
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
            >
              Description
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions
            ? transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${transaction.type === "deposit" ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500"}`}
                      >
                        {transaction.type === "deposit" ? (
                          <MdMoving className="h-5 w-5" />
                        ) : (
                          <FaArrowTrendDown className="h-4 w-4" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.amount}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-900">
                      {transaction.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-500">
                      {transaction.date.split('.')[0]}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-500 ">
                      {transaction?.description}
                    </div>
                  </td>
                </tr>
              ))
            : "No activity"}
        </tbody>
      </table>
      {/* <button
        onClick={resetTransactions}
        className="mt-4 w-80 bg-primary text-white px-4 py-2 rounded-lg"
      >
        Reset
      </button> */}
    </div>
  );
};

export default TransactionHistory;
