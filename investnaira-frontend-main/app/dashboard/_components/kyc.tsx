"use client";
import React, { useState, useEffect } from "react";

const Kyc = () => {
  const [verified, setVerified] = useState(false);
  const [userName, setUserName] = useState("Precious Obule");

  useEffect(() => {
    // Check if the user is already verified from localStorage
    const isVerified = localStorage.getItem("kycCompleted") === "true";
    setVerified(isVerified);
  }, []);

  const handleVerifyClick = () => {
    setVerified(true);
    localStorage.setItem("kycCompleted", "true"); // Save verification status
  };

  return (
    <div className=" relative w-full mx-auto">
      <div className="relative w-80 mx-auto h-full mt-20">
        <label
          htmlFor="firstName"
          className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute bottom-9 left-3 px-1"
        >
          BVN
        </label>
        <input
          id="bvn"
          name="bvn"
          type="text"
          placeholder="Enter Bank Verification Number"
          className="py-3 w-full px-8 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none focus:outline-none placeholder:text-[12px]"
          required
        />
      </div>
      <div className="relative mx-auto h-full w-80">
        <div className="mb-12">
          {verified && (
            <p className="mt-4 text-tertiary text-sm">
              <span className="font-bold">{userName}</span>
            </p>
          )}
        </div>
        <button
          className="w-80 bg-primary text-white px-4 py-2 rounded-lg"
          onClick={handleVerifyClick}
        >
          {verified ? "Verified" : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default Kyc;
