"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { kycIcon } from "@/utils/icons";
import PostKycDashboard from "./_components/PostKycDashboard";
import { useAuths } from "../../hook/useAuths";
import LoadingSpinner from "../../components/Loader";

const Dashboard = () => {
  const [kycCompleted, setKycCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, fetchUser, accessToken } = useAuths();

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      if (!accessToken) {
        // No access token, redirect to login
        router.push('/auth/login');
        return;
      }

      try {
        await fetchUser();
        const isKycCompleted = localStorage.getItem("kycCompleted") === "true";
        setKycCompleted(isKycCompleted);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Handle error (e.g., redirect to login if unauthorized)
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchUser();
  }, [accessToken, fetchUser, router]);

  const handleProceedToKYC = () => {
    router.push("/dashboard/profile?section=kyc");
  };

  if (loading) {
    return <LoadingSpinner /> ; // Or a more sophisticated loading component
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="relative w-full h-full">
      <p className="text-2xl font-extrabold font-sans">
        Welcome Back <span className="text-tertiary">{user.first_name}</span>
        😎
      </p>
      {!kycCompleted ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <div
            className="text-center w-full max-w-[200px] md:max-w-[250px] mb-4"
            dangerouslySetInnerHTML={{ __html: kycIcon }}
          />
          <p className="text-center text-sm md:text-base mb-4">
            To perform any transaction, Complete KYC
          </p>
          <button
            className="w-full max-w-xs bg-primary text-white px-4 py-2 rounded-lg text-sm md:text-base"
            onClick={handleProceedToKYC}
          >
            Proceed to KYC
          </button>
        </div>
      ) : (
        <PostKycDashboard />
      )}
    </div>
  );
};

export default Dashboard;