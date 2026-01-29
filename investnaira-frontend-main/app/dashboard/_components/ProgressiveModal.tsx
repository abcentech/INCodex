"use client";
import React, { useState } from "react";
import Image from "next/image";
import { calculateInvestment } from "@/utils/format";
// Assuming a helper exists or we simulate calculate, removing hardcoded logic for now or keeping it simple
import { X, Check, Calculator, ArrowRight, User, DollarSign, Clock } from "lucide-react";
import { useTransactionSlice } from "@/hook/useTransaction";

interface ProgressiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  content: string;
  property?: {
    imageSrc: string;
    logo: string;
    title: string;
    description: string;
    location: string;
    price: string;
    progress?: {
      duration: string;
      amount: string;
    };
  };
  showCalculator?: boolean;
  activeSection: string;
}

const ProgressiveModal = ({
  isOpen,
  onClose,
  property,
}: ProgressiveModalProps) => {
  const [showForm, setShowForm] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const { invest } = useTransactionSlice();

  // Form States
  const [potName, setPotName] = useState("");
  const [investAmount, setInvestAmount] = useState("");
  const [frequency, setFrequency] = useState("One-time");

  // Calculator States
  const [calcAmount, setCalcAmount] = useState("");
  const [calcDuration, setCalcDuration] = useState("");
  const [calcResult, setCalcResult] = useState<{ monthly: string, total: string } | null>(null);

  if (!isOpen || !property) return null;

  const handleCalculator = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate calculation logic
    setCalcResult({
      monthly: "₦10,000",
      total: "₦360,000 in 3 years"
    });
  };

  const handlePayment = async () => {
    if (!investAmount || Number(investAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const res = await invest({
        savings_plan: (property as any).id,
        amount: Number(investAmount)
      });

      if (res.balance !== undefined) {
        setIsPaymentCompleted(true);
      } else {
        alert(res.details || "Investment failed.");
      }
    } catch (err: any) {
      alert(err.message || "Investment failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800">

        {/* Left Side: Image / Summary */}
        <div className="w-full md:w-2/5 relative h-48 md:h-full bg-slate-100 dark:bg-slate-800">
          <Image
            src={property.imageSrc}
            alt={property.title}
            fill
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h2 className="text-2xl font-black font-rowdies mb-2 leading-tight">{property.title}</h2>
            <p className="text-sm font-gilroy text-gray-300 flex items-center gap-2">
              {property.location}
            </p>
            <p className="text-xl font-bold text-primary mt-4">{property.price}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-3/5 flex flex-col h-full bg-white dark:bg-slate-900 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors hidden md:block text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X size={24} />
          </button>

          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            {isPaymentCompleted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                  <Check size={40} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white font-rowdies mb-2">Success!</h3>
                  <p className="text-gray-500 dark:text-gray-400">You have successfully invested in <br /><span className="font-bold text-gray-900 dark:text-white">{property.title}</span></p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                >
                  Close
                </button>
              </div>
            ) : !showForm ? (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    About Opportunity
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed text-justify">
                    {property.description}
                  </p>
                </div>

                {/* Calculator Mini */}
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calculator size={16} className="text-primary" /> ROI Calculator
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 mb-1 block">Amount</label>
                      <input type="number" placeholder="50000" className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 mb-1 block">Duration</label>
                      <select className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Estimated Returns</span>
                    <span className="font-bold text-primary">--</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition flex items-center justify-center gap-2 group"
                >
                  Invest Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => setShowForm(false)} className="text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white">Back</button>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Investment Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Pot Name (e.g. My Future Home)"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      value={potName}
                      onChange={(e) => setPotName(e.target.value)}
                    />
                  </div>
                  <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      placeholder="Amount to Invest"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                    />
                  </div>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none cursor-pointer text-gray-500"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                    >
                      <option value="One-time">One-time</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handlePayment}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 transform hover:-translate-y-0.5 transition-all duration-200 text-lg"
                  >
                    Confirm Investment
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3">By clicking confirm, you agree to our T&C.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveModal;