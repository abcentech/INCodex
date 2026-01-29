"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WealthTicker = () => {
    const [wealth, setWealth] = useState(4250000); // Start with a base number

    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly increment by 500 to 5000
            const increment = Math.floor(Math.random() * 4500) + 500;
            setWealth(prev => prev + increment);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="bg-primary/10 border border-primary/20 rounded-full px-6 py-2 flex items-center gap-3 w-fit mb-8 backdrop-blur-sm mx-auto lg:mx-0">
            <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                <span className="text-primary font-bold">
                    {formatCurrency(wealth)}
                </span> Wealth built by community today
            </p>
        </div>
    );
};

export default WealthTicker;
