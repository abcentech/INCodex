"use client";

import React, { useState } from 'react';
import { useSecurity } from '@/hook/useSecurity';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Shield,
    ShieldCheck,
    ShieldAlert,
    Smartphone,
    Globe,
    Clock,
    MapPin,
    ArrowRight,
    CheckCircle2,
    X,
    Key,
    Lock,
    Copy,
    RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';

const SecuritySettings = () => {
    const {
        summary,
        isLoadingSummary,
        setup2FA,
        isSettingUp2FA,
        enable2FA,
        isEnabling2FA,
        disable2FA,
        isDisabling2FA
    } = useSecurity();

    const [showSetup, setShowSetup] = useState(false);
    const [setupData, setSetupData] = useState<any>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [backupCodes, setBackupCodes] = useState<string[]>([]);

    const handleStartSetup = async () => {
        try {
            const data = await setup2FA();
            setSetupData(data);
            setShowSetup(true);
        } catch (error) {
            toast.error("Failed to initialize system. Please try again.");
        }
    };

    const handleVerifyAndEnable = async () => {
        if (verificationCode.length !== 6) {
            toast.error("Please enter a valid 6-digit code.");
            return;
        }

        try {
            const response = await enable2FA(verificationCode);
            setIsVerified(true);
            setBackupCodes(response.backup_codes || []);
            toast.success("Two-Factor Authentication enabled successfully!");
        } catch (error) {
            toast.error("Invalid verification code. Please try again.");
        }
    };

    const handleDisable2FA = async () => {
        const code = prompt("Please enter your 2FA code to disable it:");
        if (!code) return;

        try {
            await disable2FA(code);
            toast.success("2FA has been disabled.");
        } catch (error) {
            toast.error("Failed to disable 2FA. Invalid code.");
        }
    };

    if (isLoadingSummary) {
        return <div className="p-10 text-center font-black font-rowdies">Loading security status...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-rowdies text-gray-900 dark:text-white">Security & Privacy</h1>
                    <p className="text-gray-500 font-medium">Manage your account security and verify your activity.</p>
                </div>
                <div className="flex bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 px-4 py-2 rounded-2xl items-center gap-2 border border-emerald-100 dark:border-emerald-500/20">
                    <ShieldCheck size={20} />
                    <span className="font-bold text-sm">Account Secure</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2FA Card */}
                <Card className="lg:col-span-2 p-10 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[40px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Lock size={120} />
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black font-rowdies flex items-center gap-3">
                                    <Shield className="text-primary" size={28} />
                                    Two-Factor Authentication
                                </h3>
                                <p className="text-gray-500 font-medium max-w-md">
                                    Add an extra layer of security to your account by requiring a code from your mobile device.
                                </p>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${summary?.is_2fa_enabled
                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                : 'bg-gray-100 text-gray-500 dark:bg-slate-800'
                                }`}>
                                {summary?.is_2fa_enabled ? 'Active' : 'Inactive'}
                            </div>
                        </div>

                        {!summary?.is_2fa_enabled ? (
                            <div className="pt-4">
                                <Button
                                    onClick={handleStartSetup}
                                    className="h-14 px-8 rounded-2xl font-black bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl"
                                >
                                    Enable 2FA Protection
                                    <Smartphone className="ml-2" size={20} />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-4 pt-4">
                                <Button
                                    onClick={handleDisable2FA}
                                    variant="outline"
                                    className="h-14 px-8 rounded-2xl font-black border-red-100 text-red-500 hover:bg-red-50"
                                >
                                    Disable 2FA
                                </Button>
                                <Button
                                    className="h-14 px-8 rounded-2xl font-black bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300 hover:bg-gray-200"
                                >
                                    View Backup Codes
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Status Card */}
                <Card className="p-8 border-none shadow-xl bg-slate-900 text-white rounded-[40px] flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                            <ShieldAlert className="text-white" size={28} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black font-rowdies mb-2">Security Score</h4>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-black font-rowdies">85</span>
                                <span className="text-white/40 font-bold mb-2">/100</span>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60 font-medium">Email Verified</span>
                                <CheckCircle2 className="text-emerald-400" size={16} />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60 font-medium">KYC Complete</span>
                                <CheckCircle2 className="text-emerald-400" size={16} />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60 font-medium">2FA Enabled</span>
                                {summary?.is_2fa_enabled ? <CheckCircle2 className="text-emerald-400" size={16} /> : <ShieldAlert className="text-rose-400" size={16} />}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Login History */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black font-rowdies">Recent Activity</h3>
                    <Button variant="ghost" className="text-primary font-black flex items-center gap-2">
                        <RefreshCw size={16} />
                        Refresh
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {summary?.login_history.map((log) => (
                        <Card key={log.id} className="p-6 border-none shadow-lg bg-white dark:bg-slate-900 rounded-3xl transition-all hover:scale-[1.01] flex items-center justify-between overflow-hidden">
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${log.is_successful ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                                    }`}>
                                    {log.is_successful ? <Globe size={24} /> : <ShieldAlert size={24} />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <p className="font-black text-gray-900 dark:text-white">{log.ip_address}</p>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${log.is_successful ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                            }`}>
                                            {log.is_successful ? 'Success' : 'Failed'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {format(new Date(log.timestamp), 'MMM dd, HH:mm')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {log.location || 'Unknown Location'}
                                        </span>
                                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                                            <Smartphone size={12} />
                                            {log.device_info}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="rounded-xl border-gray-100 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                Report Issue
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>

            {/* 2FA Setup Modal */}
            {showSetup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-xl p-10 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[50px] relative animate-in zoom-in duration-300">
                        <button
                            onClick={() => setShowSetup(false)}
                            className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={28} />
                        </button>

                        {!isVerified ? (
                            <div className="space-y-8">
                                <div className="text-center space-y-2">
                                    <h3 className="text-3xl font-black font-rowdies">Setup 2FA Protection</h3>
                                    <p className="text-gray-500 font-medium">Scan the QR code with your authenticator app.</p>
                                </div>

                                <div className="bg-white p-6 rounded-[30px] w-fit mx-auto shadow-inner border border-gray-100">
                                    <QRCodeSVG value={setupData?.otpauth_url} size={200} />
                                </div>

                                <div className="space-y-6">
                                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Key className="text-primary" size={20} />
                                            <span className="font-mono font-bold text-lg tracking-widest">{setupData?.secret}</span>
                                        </div>
                                        <button className="text-primary font-black text-sm flex items-center gap-1">
                                            <Copy size={14} />
                                            Copy
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Verification Code</label>
                                        <Input
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            placeholder="000000"
                                            maxLength={6}
                                            className="h-16 text-center text-3xl font-black tracking-[1em] rounded-3xl bg-gray-50 border-none focus-visible:ring-primary"
                                        />
                                    </div>

                                    <Button
                                        disabled={isEnabling2FA || verificationCode.length !== 6}
                                        onClick={handleVerifyAndEnable}
                                        className="w-full h-16 rounded-3xl font-black text-lg bg-primary hover:bg-primary-dark transition-all shadow-xl"
                                    >
                                        {isEnabling2FA ? "Verifying..." : "Verify & Enable"}
                                        <ArrowRight className="ml-2" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-8 py-4">
                                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                    <CheckCircle2 size={40} className="text-emerald-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black font-rowdies">2FA Enabled! 🎉</h3>
                                    <p className="text-gray-500 font-medium max-w-sm mx-auto">
                                        Your account is now protected. Please save these backup codes in a safe place.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-slate-800 p-6 rounded-[30px]">
                                    {backupCodes.map((code, i) => (
                                        <div key={i} className="text-sm font-mono font-bold text-gray-500 dark:text-gray-400">
                                            {code}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => setShowSetup(false)}
                                    className="w-full h-16 rounded-3xl font-black text-lg bg-slate-900"
                                >
                                    Finish Setup
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SecuritySettings;
