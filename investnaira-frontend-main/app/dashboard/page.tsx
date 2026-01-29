"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { kycIcon } from "@/utils/icons";
import Overview from "./_components/Overview";
import { useAuths } from "../../hook/useAuths";
import LoadingSpinner from "../../components/Loader";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [kycCompleted, setKycCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  const { user, fetchUser, accessToken } = useAuths();

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      if (isDemo) {
        setLoading(false);
        return;
      }

      if (!accessToken) {
        // No access token, redirect to login
        router.push('/auth/login');
        return;
      }

      try {
        await fetchUser();
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchUser();
  }, [accessToken, fetchUser, router, isDemo]);

  // Handle KYC status whenever user or demo status changes
  useEffect(() => {
    const isLocalStorageKyc = localStorage.getItem("kycCompleted") === "true";
    const isUserVerified = user?.is_verified === true;
    setKycCompleted(isLocalStorageKyc || isUserVerified);
  }, [user, isDemo]);

  const handleProceedToKYC = () => {
    router.push("/dashboard/profile?section=kyc");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Allow render if user exists OR if it's demo mode
  if (!user && !isDemo) {
    return null;
  }

  const displayName = isDemo ? "Future Billionaire" : user?.first_name;

  return (
    <div className="relative w-full h-full">
      <p className="text-2xl font-extrabold font-sans">
        Welcome Back <span className="text-tertiary">{displayName}</span>
        😎
      </p>
      {!kycCompleted && !isDemo ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <div
            className="text-center w-full max-w-[200px] md:max-w-[250px] mb-4"
            dangerouslySetInnerHTML={{ __html: kycIcon }}
          />
          <p className="text-center text-sm md:text-base mb-4">
            Please complete your KYC to unlock full features.
          </p>
          <Button
            className="w-full max-w-xs"
            onClick={handleProceedToKYC}
          >
            Proceed to KYC
          </Button>
        </div>
      ) : (
        <Overview isDemo={isDemo} />
      )}
    </div>
  );
};

export default Dashboard;