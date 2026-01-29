"use client";
import React from "react";
import Image from "next/image";
import { ArrowRight, Target, ShieldCheck, Zap } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface GoalCardProps {
    title: string;
    category: string;
    targetAmount?: number;
    currentAmount: number;
    imageSrc: string;
    status: "ACTIVE" | "COMPLETED" | "PENDING";
    autoTransfer?: boolean;
    onClick?: () => void;
}

const GoalCard = ({
    title,
    category,
    targetAmount,
    currentAmount,
    imageSrc,
    status,
    autoTransfer,
    onClick,
}: GoalCardProps) => {
    // Calculate progress
    const progress = targetAmount ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "ACTIVE": return "default";
            case "COMPLETED": return "outline";
            case "PENDING": return "secondary";
            default: return "default";
        }
    }

    return (
        <Card
            onClick={onClick}
            className={`group relative overflow-hidden rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${status === 'COMPLETED' ? 'opacity-80 grayscale-[0.5] hover:grayscale-0' : ''
                }`}
        >
            {/* Background Image / Pattern */}
            <div className="absolute inset-0 h-32 bg-gray-100 dark:bg-slate-800">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-slate-900"></div>
            </div>

            {/* Content */}
            <CardContent className="relative p-6 pt-20 flex flex-col h-full z-10">
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <Badge variant={getStatusVariant(status)} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wider flex items-center gap-1 border-none text-foreground">
                        {status === 'ACTIVE' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                        {status}
                    </Badge>
                    {autoTransfer && (
                        <Badge className="bg-primary text-white border-none px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter flex items-center gap-1 shadow-lg shadow-primary/20 animate-in zoom-in duration-300">
                            <Zap size={8} fill="currentColor" className="animate-pulse" /> Auto
                        </Badge>
                    )}
                </div>

                <div className="mb-4">
                    <p className="text-xs font-bold text-primary font-gilroy mb-1 uppercase tracking-wide flex items-center gap-1">
                        <Target size={14} /> {category}
                    </p>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white font-rowdies leading-tight group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                </div>

                <div className="mt-auto space-y-4">
                    {/* Progress Section */}
                    <div>
                        <div className="flex justify-between items-end mb-2 text-sm">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Saved</span>
                            <span className="font-bold text-gray-900 dark:text-white font-gilroy text-xs">
                                {formatCurrency(currentAmount)}
                                {targetAmount && <span className="text-gray-400 font-normal"> / {formatCurrency(targetAmount)}</span>}
                            </span>
                        </div>

                        {targetAmount && (
                            <Progress value={progress} className="h-2 bg-gray-100 dark:bg-slate-800" />
                        )}
                    </div>
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="relative z-10 p-6 pt-0 mt-auto border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-green-500" /> Secured
                </span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-primary cursor-pointer font-bold">
                    View Mission <ArrowRight size={14} />
                </span>
            </CardFooter>
        </Card>
    );
};

export default GoalCard;
