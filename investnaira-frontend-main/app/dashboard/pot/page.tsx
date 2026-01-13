"use client";

import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import Image from "next/image";
import PropertyCard from "../_components/PropertyCard";
import ProgressiveModal from "../_components/ProgressiveModal";
import PropertyDetail from "../_components/PropertyDetail";
import { MdOutlineQuestionMark } from "react-icons/md";
import { ChevronDown } from "lucide-react";
import { useAuths } from "../../../hook/useAuths";
import axios from "axios";
import { formatCurrency } from "../../../utils/format";

export default function Pot() {
  const { accessToken } = useAuths();
  const [activeSection, setActiveSection] = useState("available");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [modalContent, setModalContent] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isTooltopVisible, setIsTooltopVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [quote, setQuote] = useState<string>("Loading quote...");
  const [author, setAuthor] = useState<string>("");

  // Data States
  const [availableCampaigns, setAvailableCampaigns] = useState<any[]>([]);
  const [userPlans, setUserPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const totalSteps = 3;

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(
          "https://api.api-ninjas.com/v1/quotes?category=money",
          {
            headers: {
              "X-Api-Key": "HwjRi53aZGW8AW0XFeu4kA==ujnxwwCuZrOHVXwF",
            },
          }
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setQuote(data[0].quote);
          setAuthor(data[0].author);
        } else {
          setQuote("No quote available for today.");
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        setQuote("Failed to load quote.");
      }
    };

    fetchQuote();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;
      try {
        const [campaignsRes, plansRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/user_savings_plans/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
        ]);
        setAvailableCampaigns(campaignsRes.data);
        setUserPlans(plansRes.data);
      } catch (e) {
        console.error("Failed to fetch pot data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessToken]);


  const openModal = (property: any) => {
    setIsModalOpen(true);
    setCurrentStep(1);
    setSelectedProperty(property);
    setShowCalculator(activeSection === "available");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextModal = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const toggleTooltop = () => {
    setIsTooltopVisible(!isTooltopVisible);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (section: string) => {
    setActiveSection(section);
    setIsDropdownOpen(false);
  };

  // Helper to map API data to Card Props
  const mapCampaignToProperty = (camp: any) => ({
    id: camp.id,
    imageSrc: camp.images && camp.images[0] ? camp.images[0] : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop", // Placeholder
    title: camp.title,
    description: camp.description,
    location: "InvestNaira Verified",
    price: formatCurrency(Number(camp.unit_price)),
    logo: "/images/investnaira-logo.png", // Placeholder
    originalData: camp
  });

  const mapPlanToProperty = (plan: any) => ({
    id: plan.id,
    imageSrc: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop", // Placeholder for active plan
    title: plan.title,
    description: plan.savings_plan?.campaign?.description || "Personal Savings Plan",
    location: "Active Portfolio",
    price: formatCurrency(Number(plan.balance)),
    logo: "/images/investnaira-logo.png",
    progress: {
      duration: "Saved",
      amount: formatCurrency(Number(plan.balance))
    },
    originalData: plan
  });


  const renderSection = () => {
    let propertiesToRender: any[] = [];

    if (loading) {
      return <div className="col-span-3 text-center py-10 animate-pulse">Loading opportunities...</div>;
    }

    switch (activeSection) {
      case "available":
        propertiesToRender = availableCampaigns.map(mapCampaignToProperty);
        break;
      case "inprogress":
        // Filter active plans
        propertiesToRender = userPlans
          .filter((p: any) => p.status === 'ACTIVE')
          .map(mapPlanToProperty);
        break;
      case "completed":
        // Filter completed plans
        propertiesToRender = userPlans
          .filter((p: any) => p.status === 'COMPLETED')
          .map(mapPlanToProperty);
        break;
      default:
        propertiesToRender = [];
    }

    if (propertiesToRender.length === 0) {
      return (
        <div className="col-span-3 text-center py-12 bg-gray-50 rounded-2xl border border-dashed text-gray-400">
          {activeSection === "available" ? "No investment opportunities currently available." : `No ${activeSection} investments found.`}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-14 my-4 md:pl-0 pl-4 animate-in fade-in zoom-in duration-500">
        {propertiesToRender.map((property, index) => (
          <PropertyCard
            key={index} // Using index as fallback, ideally property.id
            {...property}
            onClick={() => openModal(property.originalData)}
          />
        ))}
      </div>
    );
  };

  const totalInvested = userPlans.reduce((acc, plan) => acc + Number(plan.balance), 0);

  return (
    <>
      <div className="flex flex-row items-center justify-start gap-4">
        <h1 className="text-2xl font-bold font-sans">Pot</h1>

        <div className="flex flex-row items-start">
          <button
            onClick={toggleTooltop}
            className="bg-primary/10 p-1 text-primary rounded-full transition-colors hover:bg-primary/20"
          >
            <MdOutlineQuestionMark size="16px" />
          </button>
        </div>
        {isTooltopVisible && (
          <div className="absolute top-16 left-32 z-50 p-4 bg-white shadow-xl border w-64 border-gray-200 rounded-lg">
            <h1 className="text-primary text-xl font-bold mb-2">Pot</h1>
            <p className="text-sm text-gray-600">
              This is where you can view all your investments, see the progress
              of your investments and also make new investments.
            </p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7 font-sans">
        <div className="p-6 bg-primary text-white rounded-2xl shadow-md bg-[url('/images/tranparent-green-bg.png')] bg-cover bg-center w-full sm:w-[285px] transition-transform hover:scale-[1.02]">
          <p className="text-sm opacity-90">Total Invested In Pot</p>
          <h2 className="text-3xl font-bold mt-1">{formatCurrency(totalInvested)}</h2>
        </div>
        <div className="flex flex-col justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 w-full shadow-sm bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <input
              type="text"
              placeholder="Search investments..."
              className="flex-grow outline-none bg-transparent text-gray-700 placeholder-gray-500 placeholder:text-sm"
            />
            <IoIosSearch className="h-5 w-5 text-gray-500" />
          </div>
          <div className="text-left">
            <p className="text-sm my-2 italic text-gray-600">"{quote}"</p>
            <p className="text-xs font-bold text-primary">— {author}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 font-sans">
        <div className="hidden sm:flex flex-row justify-evenly items-center gap-10">
          <button
            className={`font-medium text-sm px-4 w-full py-2 rounded-xl text-center transition-all ${activeSection === "available" ? "bg-primary text-white shadow-md transform scale-105" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => setActiveSection("available")}
          >
            Available
          </button>
          <button
            className={`font-medium text-sm px-4 w-full py-2 rounded-lg text-center transition-all ${activeSection === "inprogress" ? "bg-primary text-white shadow-md transform scale-105" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => setActiveSection("inprogress")}
          >
            In Progress
          </button>
          <button
            className={`font-medium text-sm px-4 w-full py-2 rounded-lg text-center transition-all ${activeSection === "completed" ? "bg-primary text-white shadow-md transform scale-105" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => setActiveSection("completed")}
          >
            Completed
          </button>
        </div>

        <div className="sm:hidden relative">
          <button
            onClick={toggleDropdown}
            className="w-full bg-white border text-gray-700 font-medium text-sm px-4 py-2 rounded-lg text-left flex justify-between items-center"
          >
            {activeSection === "available" && "Available Opportunities"}
            {activeSection === "inprogress" && "In Progress"}
            {activeSection === "completed" && "Completed"}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50"
                onClick={() => handleOptionClick("available")}
              >
                Available Opportunities
              </button>
              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50"
                onClick={() => handleOptionClick("inprogress")}
              >
                In Progress
              </button>
              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-50"
                onClick={() => handleOptionClick("completed")}
              >
                Completed
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 min-h-[300px]">{renderSection()}</div>

      {isModalOpen && selectedProperty && (
        <ProgressiveModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onNext={nextModal}
          currentStep={currentStep}
          totalSteps={totalSteps}
          content={`Details for ${selectedProperty?.title}`}
          property={selectedProperty}
          showCalculator={showCalculator}
          activeSection={activeSection}
        />
      )}
    </>
  );
}