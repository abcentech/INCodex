"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { User, Shield, CreditCard, FileCheck, ChevronRight } from "lucide-react";
import PersonalDetailsForm from "../_components/PersonalDetailsForm";
import BankCardsForm from "../_components/BankCardsForm";
import Security from "../_components/Security";
import Kyc from "../_components/kyc";

const ProfileContent = () => {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  const [activeSection, setActiveSection] = useState("personalDetails");

  useEffect(() => {
    if (section) {
      setActiveSection(section);
    }
  }, [section]);

  const renderSection = () => {
    switch (activeSection) {
      case "personalDetails":
        return <PersonalDetailsForm />;
      case "kyc":
        return <Kyc />;
      case "banksAndCards":
        return <BankCardsForm />;
      case "security":
        return <Security />;
      default:
        return <PersonalDetailsForm />;
    }
  };

  const menuItems = [
    { id: "personalDetails", label: "Personal Details", icon: User },
    { id: "kyc", label: "Verification (KYC)", icon: FileCheck },
    { id: "banksAndCards", label: "Banks & Cards", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-72 flex-shrink-0">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-slate-800 sticky top-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4 mt-2">Account Settings</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${activeSection === item.id
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={activeSection === item.id ? "text-white" : "text-gray-400 group-hover:text-gray-600"} />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                {activeSection === item.id && <ChevronRight size={16} />}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-800 min-h-[600px]">
          <div className="mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white font-rowdies">
              {menuItems.find(i => i.id === activeSection)?.label}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Manage your {menuItems.find(i => i.id === activeSection)?.label.toLowerCase()} preferences here.
            </p>
          </div>
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Profile() {
  return (
    <div className="font-sans pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white font-rowdies">
          User Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-gilroy text-lg">
          Manage your account settings and preferences.
        </p>
      </div>

      <Suspense fallback={<div className="p-10 text-center">Loading profile...</div>}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}
