"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ChevronDown } from "lucide-react";
import PersonalDetailsForm from "../_components/PersonalDetailsForm";
import BankCardsForm from "../_components/BankCardsForm";
import Security from "../_components/Security";
import Kyc from "../_components/kyc";
import { useSearchParams } from "next/navigation";

const ProfileContent = () => {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  const [activeSection, setActiveSection] = useState("personalDetails");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (section) {
      setActiveSection(section);
    }
  }, [section]);

  const renderSection = () => {
    switch (activeSection) {
      case "personalDetails":
        return <PersonalDetailsForm />;
      case "kyc":
        return <Kyc />;
      case "banksAndCards":
        return <BankCardsForm />;
      case "security":
        return <Security />;
      default:
        return <div>Personal Details Content</div>;
    }
  };

  const buttonClass = (sectionName: string) =>
    `bg-gray-200 text-gray-600 font-medium text-sm px-2 sm:px-4 py-2 rounded-lg text-center w-full ${
      activeSection === sectionName ? "bg-gray-900 text-white" : ""
    }`;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (sectionName: string) => {
    setActiveSection(sectionName);
    setIsDropdownOpen(false);
  };

  const getSectionTitle = (sectionName: string) => {
    switch (sectionName) {
      case "personalDetails":
        return "Personal Details";
      case "kyc":
        return "KYC";
      case "banksAndCards":
        return "Banks & Cards";
      case "security":
        return "Security";
      default:
        return "Select Option";
    }
  };

  return (
    <div className="space-y-8">
      {/* Desktop view */}
      <div className="hidden sm:grid sm:grid-cols-4 gap-2 sm:gap-10">
        <button
          className={buttonClass("personalDetails")}
          onClick={() => setActiveSection("personalDetails")}
        >
          Personal Details
        </button>
        <button
          className={buttonClass("kyc")}
          onClick={() => setActiveSection("kyc")}
        >
          KYC
        </button>
        <button
          className={buttonClass("banksAndCards")}
          onClick={() => setActiveSection("banksAndCards")}
        >
          Banks & Cards
        </button>
        <button
          className={buttonClass("security")}
          onClick={() => setActiveSection("security")}
        >
          Security
        </button>
      </div>

      {/* Mobile view */}
      <div className="sm:hidden relative">
        <button
          onClick={toggleDropdown}
          className="w-full bg-gray-200 text-gray-600 font-medium text-sm px-4 py-2 rounded-lg text-left flex justify-between items-center"
        >
          {getSectionTitle(activeSection)}
          <ChevronDown
            className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`}
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => handleOptionClick("personalDetails")}
            >
              Personal Details
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => handleOptionClick("kyc")}
            >
              KYC
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => handleOptionClick("banksAndCards")}
            >
              Banks & Cards
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => handleOptionClick("security")}
            >
              Security
            </button>
          </div>
        )}
      </div>

      <div>{renderSection()}</div>
    </div>
  );
};

export default function Profile() {
  return (
    <div className="font-sans">
      <h1 className="text-2xl font-bold mb-10">User Profile</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}
