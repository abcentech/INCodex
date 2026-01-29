"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, ArrowRight, X, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WealthMapModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [step, setStep] = useState(1);
    const [age, setAge] = useState(50);
    const [income, setIncome] = useState(1000000);
    const [commitment, setCommitment] = useState(50000);

    const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    });

    const targetCapital = income * 300; // 4% rule annual = 12 * TargetMonthly / 0.04 = TargetMonthly * 300

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                >
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition z-10">
                        <X size={24} />
                    </button>

                    <div className="p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                <Map size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black font-rowdies dark:text-white">Generate Wealth Map</h3>
                                <p className="text-gray-500 text-sm">Step {step} of 3</p>
                            </div>
                        </div>

                        {step === 1 && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                                <h4 className="text-xl font-bold dark:text-white">At what age do you want to be <span className="text-primary italic">Free</span>?</h4>
                                <p className="text-gray-500">Independence is not an amount, it's a date.</p>
                                <div className="space-y-4">
                                    <input
                                        type="range" min="30" max="80" value={age}
                                        onChange={(e) => setAge(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <p className="text-4xl font-black text-primary font-rowdies text-center">{age} <span className="text-lg font-normal">Years Old</span></p>
                                </div>
                                <Button
                                    onClick={() => setStep(2)}
                                    className="w-full h-14 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition border-none shadow-lg shadow-primary/20"
                                >
                                    Next Step <ArrowRight size={20} />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                                <h4 className="text-xl font-bold dark:text-white">What's your target <span className="text-primary italic">Monthly Freedom Income</span>?</h4>
                                <p className="text-gray-500">How much do you need every month to live your dream life without working?</p>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Input
                                            type="number" value={income}
                                            onChange={(e) => setIncome(Number(e.target.value))}
                                            className="w-full h-20 bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl text-2xl font-bold dark:text-white border-0 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦ / mo</span>
                                    </div>
                                    <div className="p-4 bg-primary/10 rounded-xl flex gap-3 text-xs text-primary font-bold items-center">
                                        <Info size={16} />
                                        This requires a {formatter.format(targetCapital)} Freedom Fund (4% rule).
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button onClick={() => setStep(1)} variant="secondary" className="flex-1 h-14 bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-2xl font-bold border-none">Back</Button>
                                    <Button
                                        onClick={() => setStep(3)}
                                        className="flex-[2] h-14 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition border-none shadow-lg shadow-primary/20"
                                    >
                                        Final Step <ArrowRight size={20} />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                                <h4 className="text-xl font-bold dark:text-white">How much can you invest <span className="text-primary italic">Now</span>?</h4>
                                <p className="text-gray-500">The monthly fuel for your freedom engine.</p>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Input
                                            type="number" value={commitment}
                                            onChange={(e) => setCommitment(Number(e.target.value))}
                                            className="w-full h-20 bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl text-2xl font-bold dark:text-white border-0 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦ / mo</span>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button onClick={() => setStep(2)} variant="secondary" className="flex-1 h-14 bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-2xl font-bold border-none">Back</Button>
                                    <Button
                                        onClick={onClose}
                                        className="flex-[2] h-14 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/30 border-none"
                                    >
                                        Generate My Map 🚀
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default WealthMapModal;
