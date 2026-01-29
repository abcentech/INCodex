"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Target,
    Calendar,
    TrendingUp,
    Heart,
    GraduationCap,
    Plane,
    Home,
    Plus,
    ChevronRight,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';

const GOAL_TEMPLATES = [
    {
        id: 'EMERGENCY_FUND',
        title: 'Emergency Fund',
        description: '3-6 months of expenses for peace of mind.',
        icon: ShieldCheck,
        color: 'bg-emerald-500',
    },
    {
        id: 'RETIREMENT',
        title: 'Retirement',
        description: 'Build your nest egg for a comfortable future.',
        icon: Heart,
        color: 'bg-orange-500',
    },
    {
        id: 'EDUCATION',
        title: 'Education',
        description: 'Invest in your or your children\'s learning.',
        icon: GraduationCap,
        color: 'bg-blue-500',
    },
    {
        id: 'VACATION',
        title: 'Dream Vacation',
        description: 'Save for that well-deserved getaway.',
        icon: Plane,
        color: 'bg-sky-500',
    },
    {
        id: 'CUSTOM',
        title: 'Custom Goal',
        description: 'Define your own financial milestone.',
        icon: Target,
        color: 'bg-purple-500',
    }
];

import { ShieldCheck } from 'lucide-react';

const GoalPlanner = () => {
    const [step, setStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [goalData, setGoalData] = useState({
        title: '',
        amount: '',
        date: ''
    });

    const handleSelectTemplate = (template: any) => {
        setSelectedTemplate(template);
        setGoalData({ ...goalData, title: template.title });
        setStep(2);
    };

    const handleCreateGoal = () => {
        toast.success(`Goal "${goalData.title}" created successfully!`);
        // In a real app, this would call an API
        setStep(3);
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-black font-rowdies text-gray-900 dark:text-white mb-3">Goal Planner</h1>
                <p className="text-gray-500 font-medium">Turn your dreams into reality with a structured savings plan.</p>
            </div>

            {/* Stepper */}
            <div className="flex justify-center mb-12">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                            }`}>
                            {step > s ? <CheckCircle2 size={20} /> : s}
                        </div>
                        {s < 3 && <div className={`w-20 h-1 mx-2 rounded ${step > s ? 'bg-primary' : 'bg-gray-100'}`} />}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                    {GOAL_TEMPLATES.map((template) => (
                        <Card
                            key={template.id}
                            className="p-6 cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all border-none bg-white dark:bg-slate-900 shadow-xl rounded-[30px] group overflow-hidden relative"
                            onClick={() => handleSelectTemplate(template)}
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 ${template.color} opacity-5 rounded-full -mr-10 -mt-10 group-hover:opacity-10 transition-opacity`} />

                            <div className="flex gap-5 relative z-10">
                                <div className={`${template.color} p-4 rounded-2xl text-white shadow-lg`}>
                                    <template.icon size={28} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black font-rowdies">{template.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">{template.description}</p>
                                </div>
                                <ChevronRight className="ml-auto text-gray-300 group-hover:text-primary transition-colors" />
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {step === 2 && (
                <Card className="p-10 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[40px] animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black font-rowdies flex items-center gap-3">
                                <div className={`${selectedTemplate?.color} p-2 rounded-xl text-white`}>
                                    <selectedTemplate.icon size={20} />
                                </div>
                                Define your goal
                            </h3>
                            <p className="text-gray-500 font-medium">Be specific about what you want to achieve.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest text-gray-400">Goal Name</label>
                                <Input
                                    value={goalData.title}
                                    onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
                                    placeholder="e.g. Hawaii 2026"
                                    className="h-14 rounded-2xl bg-gray-50 border-none text-lg font-bold"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest text-gray-400">Target Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₦</span>
                                    <Input
                                        type="number"
                                        value={goalData.amount}
                                        onChange={(e) => setGoalData({ ...goalData, amount: e.target.value })}
                                        placeholder="5,000,000"
                                        className="h-14 pl-10 rounded-2xl bg-gray-50 border-none text-lg font-bold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest text-gray-400">Target Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <Input
                                        type="date"
                                        value={goalData.date}
                                        onChange={(e) => setGoalData({ ...goalData, date: e.target.value })}
                                        className="h-14 pl-12 rounded-2xl bg-gray-50 border-none text-lg font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <Button variant="outline" onClick={() => setStep(1)} className="h-14 px-8 rounded-2xl border-gray-200 font-bold">
                                Back
                            </Button>
                            <Button onClick={handleCreateGoal} className="flex-1 h-14 rounded-2xl font-black text-lg bg-primary hover:bg-primary-dark transition-all">
                                Create My Goal
                                <ArrowRight className="ml-2" />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {step === 3 && (
                <Card className="p-16 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[50px] text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CheckCircle2 size={48} className="text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-black font-rowdies mb-4">Goal Created! 🎉</h2>
                    <p className="text-gray-500 font-medium text-lg max-w-sm mx-auto mb-10">
                        Awesome! You've taken the first step towards your <strong>{goalData.title}</strong>.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                        <Button variant="outline" onClick={() => (window.location.href = '/dashboard/plans')} className="h-14 rounded-2xl border-gray-100 font-bold">
                            View My Plans
                        </Button>
                        <Button onClick={() => setStep(1)} className="h-14 rounded-2xl font-black bg-primary">
                            Create Another
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default GoalPlanner;
