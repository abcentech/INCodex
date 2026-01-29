"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Info, CheckCircle2 } from 'lucide-react';

interface FreedomMeterProps {
    currentAssets: number;
    monthlyExpenses?: number; // Target monthly income in freedom
}

import { Card, CardContent } from "@/components/ui/card";

const FreedomMeter: React.FC<FreedomMeterProps> = ({ currentAssets, monthlyExpenses = 500000 }) => {
    // 4% Rule: You need 25x your annual expenses (or 300x monthly)
    const targetAssets = monthlyExpenses * 300;
    const percentage = Math.min(Math.round((currentAssets / targetAssets) * 100), 100);

    return (
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-none">
            {/* Background decorative elements */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-1000"></div>

            <CardContent className="p-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Target className="text-primary" size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Freedom Progress</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black font-rowdies">
                        {percentage}% <span className="text-2xl text-gray-400">Free</span>
                    </h2>
                    <p className="text-gray-400 max-w-xs text-sm">
                        You've funded <span className="text-white font-bold">{percentage}%</span> of your lifelong financial independence goal.
                    </p>
                </div>

                <div className="flex-1 w-full max-w-md space-y-4">
                    <div className="relative h-4 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_20px_rgba(22,163,74,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        {/* Milestones */}
                        <div className="absolute top-0 left-1/4 h-full w-px bg-white/20"></div>
                        <div className="absolute top-0 left-2/4 h-full w-px bg-white/20"></div>
                        <div className="absolute top-0 left-3/4 h-full w-px bg-white/20"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                        <span>Starting</span>
                        <span>Stability</span>
                        <span>Security</span>
                        <span>Freedom</span>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Projected Freedom</p>
                        <p className="text-sm font-bold">Age 52</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FreedomMeter;
