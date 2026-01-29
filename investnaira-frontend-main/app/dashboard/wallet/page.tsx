"use client";
import React, { useState } from "react";
import { ChevronDown, Wallet as WalletIcon, TrendingUp, DollarSign } from "lucide-react";
import TransactionHistory from "../_components/TransactionHistory";
import Deposit from "../_components/Deposit";
import Withdrawal from "../_components/Withdrawal";
import { useTransactionSlice } from "@/hook/useTransaction";
import StatsCard from "../_components/StatsCard";

export default function Wallet() {
  const [activeSection, setActiveSection] = useState("transactionHistory");
  const { balance } = useTransactionSlice();

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

  const tabs = [
    { id: "transactionHistory", label: "History" },
    { id: "deposit", label: "Deposit" },
    { id: "withdrawal", label: "Withdraw" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white font-rowdies">
          My Wallet
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-gilroy text-lg">
          Manage your funds and transactions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Wallet Balance"
          value={balance || 0}
          icon={WalletIcon}
          className="bg-gradient-to-br from-blue-900 to-blue-800 text-white border-none"
        />
        <StatsCard
          label="Total Deposited"
          value={1200000}
          icon={DollarSign}
          trend="up"
          trendValue="+12% this month"
        />
        <StatsCard
          label="Total Withdrawn"
          value={45000}
          icon={TrendingUp}
          trend="down"
          trendValue="Low Activity"
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-800 min-h-[500px]">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-xl inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeSection === tab.id
                  ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm scale-105"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Section */}
        <div className="animate-in slide-in-from-bottom-4 duration-300">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
