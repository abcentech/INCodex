"use client";

import React, { useState, useEffect } from "react";
import PropertyCard from "../_components/PropertyCard";
import ProgressiveModal from "../_components/ProgressiveModal";
import StatsCard from "../_components/StatsCard";
import { TrendingUp, Plus, LayoutGrid, CheckCircle } from "lucide-react";
import { useAuths } from "../../../hook/useAuths";
import axios from "axios";
import { formatCurrency } from "../../../utils/format";

export default function Pot() {
  const { accessToken } = useAuths();
  const [activeSection, setActiveSection] = useState("available");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Data States
  const [availableCampaigns, setAvailableCampaigns] = useState<any[]>([]);
  const [userPlans, setUserPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    setSelectedProperty(property);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Helper to map API data to Card Props
  const mapCampaignToProperty = (camp: any) => ({
    id: camp.id,
    imageSrc: camp.images && camp.images[0] ? camp.images[0] : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop",
    title: camp.title,
    description: camp.description,
    location: "InvestNaira Verified",
    price: formatCurrency(Number(camp.unit_price)),
    logo: "/images/investnaira-logo.png",
    originalData: camp
  });

  const mapPlanToProperty = (plan: any) => ({
    id: plan.id,
    imageSrc: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop",
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
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-gray-100 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      );
    }

    switch (activeSection) {
      case "available":
        propertiesToRender = availableCampaigns.map(mapCampaignToProperty);
        break;
      case "inprogress":
        propertiesToRender = userPlans
          .filter((p: any) => p.status === 'ACTIVE')
          .map(mapPlanToProperty);
        break;
      case "completed":
        propertiesToRender = userPlans
          .filter((p: any) => p.status === 'COMPLETED')
          .map(mapPlanToProperty);
        break;
      default:
        propertiesToRender = [];
    }

    if (propertiesToRender.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <LayoutGrid className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
            {activeSection === "available" ? "No investment opportunities currently available." : `No ${activeSection} investments found.`}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in duration-500">
        {propertiesToRender.map((property, index) => (
          <PropertyCard
            key={index}
            {...property}
            onClick={() => openModal(property.originalData)}
          />
        ))}
      </div>
    );
  };

  const totalInvested = userPlans.reduce((acc, plan) => acc + Number(plan.balance), 0);

  const tabs = [
    { id: "available", label: "Available" },
    { id: "inprogress", label: "Active" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white font-rowdies">
          Wealth Accelerators
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-gilroy text-lg">
          High-yield opportunities to speed up your freedom.
        </p>
      </div>

      {/* Stats Grid using StatsCard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Total Invested"
          value={totalInvested}
          icon={TrendingUp}
          className="bg-gradient-to-br from-green-900 to-green-800 text-white border-none"
        />
        <StatsCard
          label="Active Plans"
          value={userPlans.filter(p => p.status === 'ACTIVE').length}
          icon={Plus}
          trend="up"
          trendValue="Running"
        />
        <StatsCard
          label="Completed"
          value={userPlans.filter(p => p.status === 'COMPLETED').length}
          icon={CheckCircle}
        />
      </div>

      {/* Tabs & Content */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-800 min-h-[500px]">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-xl inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeSection === tab.id
                  ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm scale-105"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Section */}
        <div>
          {renderSection()}
        </div>
      </div>

      {isModalOpen && selectedProperty && (
        <ProgressiveModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onNext={() => { }}
          currentStep={1}
          totalSteps={3}
          content={`Details for ${selectedProperty?.title}`}
          property={selectedProperty}
          showCalculator={true}
          activeSection={activeSection}
        />
      )}
    </div>
  );
}