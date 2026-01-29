"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useOnboardingTour = () => {
    const [hasRun, setHasRun] = useState(false);

    const startTour = () => {
        const driverObj = driver({
            showProgress: true,
            animate: true,
            steps: [
                {
                    element: '#tour-welcome',
                    popover: {
                        title: 'Welcome to InvestNaira',
                        description: 'This is your new Wealth Command Center. Let us show you around.',
                        side: "bottom",
                        align: 'start'
                    }
                },
                {
                    element: '#tour-balance',
                    popover: {
                        title: 'Freedom Meter',
                        description: 'Your life, measured in freedom. This shows how close you are to absolute financial independence.',
                        side: "bottom",
                        align: 'start'
                    }
                },
                {
                    element: '#tour-streaks',
                    popover: {
                        title: 'Wealth Habits',
                        description: 'Your streak is your moat. Keep it alive to unlock exclusive dividends and fee reductions.',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '#tour-actions',
                    popover: {
                        title: 'Command Center',
                        description: 'One-click actions to fuel your freedom map.',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '#tour-assets',
                    popover: {
                        title: 'Wealth Diversification',
                        description: 'See how your assets are working for you across different sectors.',
                        side: "top",
                        align: 'start'
                    }
                },
            ]
        });

        driverObj.drive();
        localStorage.setItem("hasSeenDashboardTour", "true");
        setHasRun(true);
    };

    useEffect(() => {
        const hasSeen = localStorage.getItem("hasSeenDashboardTour");
        if (!hasSeen) {
            // Small delay to ensure render
            setTimeout(() => startTour(), 1500);
        }
    }, []);

    return { startTour };
};
