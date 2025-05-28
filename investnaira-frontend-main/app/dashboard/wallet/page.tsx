"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import TransactionHistory from "../_components/TransactionHistory";
import Deposit from "../_components/Deposit";
import Withdrawal from "../_components/Withdrawal";
// import { WalletResponse, fetchWalletDetails } from "@/libs/api";
import { useTransactionSlice } from "@/hook/useTransaction";

export default function Wallet() {
  const [activeSection, setActiveSection] = useState("transactionHistory");
  // const [walletDetails, setWalletDetails] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { balance, transactions } = useTransactionSlice();

  // useEffect(() => {
  //   const getWalletDetails = async () => {
  //     try {
  //       const data = await fetchWalletDetails();
  //       setWalletDetails(data);
  //     } catch (error) {
  //       setError(
  //         error instanceof Error
  //           ? error.message
  //           : "Failed to fetch wallet details"
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getWalletDetails();
  // }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "transactionHistory":
        return <TransactionHistory />;
      case "deposit":
        return <Deposit />;
      case "withdrawal":
        return <Withdrawal />;
      default:
        return <div>Wallet Content</div>;
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (section: string) => {
    setActiveSection(section);
    setIsDropdownOpen(false);
  };

  return (
    <div className="font-sans">
      <h1 className="text-2xl font-bold">Wallet</h1>
      <div className="w-full mt-8 md:mt-16">
        <div className="lg:grid lg:grid-cols-3 gap-4 lg:gap-16 flex overflow-x-auto pb-4">
          <div className="flex-shrink-0 w-[280px] lg:w-auto">
            <div className="p-6 bg-dark text-white rounded-2xl shadow-md bg-[url('/images/tranparent-gray-bg.png')] bg-cover bg-center">
              <p>Total </p>
              <h2 className="text-4xl font-bold">
                {/* ₦{walletDetails ? walletDetails.balance : "0.00"} */}₦
                {balance ? balance : 0}
              </h2>
            </div>
          </div>
          <div className="flex-shrink-0 w-[280px] lg:w-auto">
            <div className="p-6 bg-primary text-white rounded-2xl shadow-md bg-[url('/images/tranparent-green-bg.png')] bg-cover bg-center">
              <p> Invested</p>
              <h2 className="text-3xl md:text-4xl font-bold">₦70000</h2>
            </div>
          </div>
          <div className="flex-shrink-0 w-[280px] lg:w-auto">
            <div className="p-6 bg-tertiary text-white rounded-2xl shadow-md bg-[url('/images/tranparent-purple-bg.png')] bg-cover bg-center">
              <p>Wallet</p>
              <h2 className="text-3xl md:text-4xl font-bold">₦{balance}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        {/* Desktop view */}
        <div className="hidden sm:flex justify-evenly items-center gap-16">
          <button
            className={`bg-gray-200 text-gray-600 font-medium text-sm px-4 w-full py-2 rounded-lg text-center ${
              activeSection === "transactionHistory"
                ? "bg-gray-900 text-white"
                : ""
            }`}
            onClick={() => setActiveSection("transactionHistory")}
          >
            Transaction History
          </button>
          <button
            className={`bg-gray-200 text-gray-600 font-medium text-sm px-4 w-full py-2 rounded-lg text-center ${
              activeSection === "deposit" ? "bg-gray-900 text-white" : ""
            }`}
            onClick={() => setActiveSection("deposit")}
          >
            Deposit
          </button>
          <button
            className={`bg-gray-200 text-gray-600 font-medium text-sm px-4 w-full py-2 rounded-lg text-center ${
              activeSection === "withdrawal" ? "bg-gray-900 text-white" : ""
            }`}
            onClick={() => setActiveSection("withdrawal")}
          >
            Withdrawal
          </button>
        </div>

        {/* Mobile view */}
        <div className="sm:hidden relative">
          <button
            onClick={toggleDropdown}
            className="w-full bg-gray-200 text-gray-600 font-medium text-sm px-4 py-2 rounded-lg text-left flex justify-between items-center"
          >
            {activeSection === "transactionHistory" && "Transaction History"}
            {activeSection === "deposit" && "Deposit"}
            {activeSection === "withdrawal" && "Withdrawal"}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleOptionClick("transactionHistory")}
              >
                Transaction History
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleOptionClick("deposit")}
              >
                Deposit
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleOptionClick("withdrawal")}
              >
                Withdrawal
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">{renderSection()}</div>
    </div>
  );
}
