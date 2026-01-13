"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

const MigrationPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if user exists and is legacy
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-user/`, { email });

            if (response.data.exists) {
                if (response.data.is_legacy) {
                    // It's a legacy user, proceed to send OTP
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/legacy/send-otp/`, { email });
                    // Store email in local storage or query param for next step
                    localStorage.setItem("migrationEmail", email);
                    toast.success("Welcome back! An OTP has been sent to your email.");
                    router.push("/auth/migration/otp");
                } else {
                    // Not a legacy user, redirect to normal login
                    toast.info("Your account is already active. Please login normally.");
                    router.push("/auth/login");
                }
            } else {
                toast.error("Account not found. Please sign up.");
                router.push("/auth/create-account");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome Back to InvestNaira
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We've upgraded our system! If you have an existing account, please enter your email to restore access.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email-address" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {loading ? "Checking..." : "Continue"}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <Link href="/auth/login" className="text-sm text-green-600 hover:text-green-500">
                        Cancel and Login normally
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MigrationPage;
