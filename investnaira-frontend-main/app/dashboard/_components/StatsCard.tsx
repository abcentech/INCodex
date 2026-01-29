import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency } from "../../../utils/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsCardProps {
    label: string;
    value: number;
    icon: React.ElementType;
    trend?: "up" | "down";
    trendValue?: string;
    className?: string;
    onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, trend, trendValue, className, onClick }) => {
    return (
        <Card
            onClick={onClick}
            className={`cursor-pointer overflow-hidden border-gray-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 relative group rounded-3xl ${className || ''}`}
        >
            <CardContent className="p-6">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                    <Icon size={64} className="text-primary" />
                </div>

                <div className="relative z-10">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-widest font-gilroy">{label}</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-black text-gray-900 dark:text-white font-rowdies">{formatCurrency(value)}</span>
                    </div>

                    {trend && (
                        <Badge variant="outline" className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full w-fit border-none ${trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                            <span>{trendValue}</span>
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default StatsCard;
