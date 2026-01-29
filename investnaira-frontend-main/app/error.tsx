"use client";

import { useEffect } from "react";
import Button from "@/components/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                We apologize for the inconvenience. Our team has been notified.
            </p>
            <div onClick={() => reset()}>
                <Button
                    type="button"
                    title="Try Again"
                    className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-green-700 transition"
                />
            </div>
        </div>
    );
}
