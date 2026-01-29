"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const quotes = [
    { text: "The stock market is designed to transfer money from the active to the patient.", author: "Warren Buffett" },
    { text: "The big money is not in the buying and selling, but in the waiting.", author: "Charlie Munger" },
    { text: "Someone's sitting in the shade today because someone planted a tree a long time ago.", author: "Warren Buffett" },
    { text: "Spend less than you make; always be saving something.", author: "Charlie Munger" },
    { text: "Price is what you pay. Value is what you get.", author: "Warren Buffett" },
    { text: "Compound interest is the eighth wonder of the world. He who understands it, earns it... he who doesn't... pays it.", author: "Albert Einstein" }, // Bonus timeless quote
];

const QuoteSlider = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % quotes.length);
        }, 8000); // Rotate every 8 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full overflow-hidden bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 p-6 flex flex-col items-center justify-center text-center min-h-[140px]" id="tour-quotes">
            <Quote className="absolute top-4 left-4 text-primary/20 w-8 h-8" />
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-xl z-10"
                >
                    <p className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200 font-gilroy mb-3 italic">
                        &ldquo;{quotes[index].text}&rdquo;
                    </p>
                    <p className="text-sm font-bold text-primary uppercase tracking-widest font-rowdies">
                        — {quotes[index].author}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Dots Indicator */}
            <div className="absolute bottom-3 flex gap-2">
                {quotes.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-primary" : "w-1.5 bg-gray-300 dark:bg-gray-700"}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuoteSlider;
