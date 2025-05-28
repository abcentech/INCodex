"use client";

import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import Image from "next/image";
import PropertyCard from "../_components/PropertyCard";
import ProgressiveModal from "../_components/ProgressiveModal";
import PropertyDetail from "../_components/PropertyDetail";
import { MdOutlineQuestionMark } from "react-icons/md";
import { ChevronDown } from "lucide-react";

const availableProperties = [
  {
    imageSrc:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "ARK BUILDERS",
    description:
      "Lorem ipsum dolor sit amet consectetur. Neque amet venenatis ornare pulvinar .",
    location: "EPE, Lagos, Nigeria",
    price: "₦70,000,000.00",
    logo: "/images/ark-logo.png",
  },
  {
    imageSrc:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "PWAN HOMES",
    description:
      " ipsum dolor sit amet consectetur. Neque amet venenatis ornare pulvinar volutpat.",
    location: "EPE, Lagos, Nigeria",
    price: "₦70,000,000.00",
    logo: "/images/ark-logo.png",
  },
  {
    imageSrc:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Ace HOMES",
    description:
      "Lorem ipsum dolor sit amet consectetur. Neque amet venenatis ornare pulvinar volutpat.",
    location: "EPE, Lagos, Nigeria",
    price: "₦70,000,000.00",
    logo: "/images/ark-logo.png",
  },
];

const inProgressProperties = [
  {
    imageSrc:
      "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "InvesNaira Real Estates",
    description:
      "Lorem ipsum dolor sit amet consectetur. Neque amet venenatis ornare pulvinar volutpat.",
    location: "EPE, Lagos, Nigeria",
    price: "₦70,000,000.00",
    logo: "/images/ark-logo.png",
    progress: {
      duration: "2 years",
      amount: "₦4,666,666.56",
    },
  },
];

const completedProperties = [
  {
    imageSrc:
      "https://images.unsplash.com/photo-1605146768851-eda79da39897?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "ARK BUILDERS",
    description:
      "Lorem ipsum dolor sit amet consectetur. Neque amet venenatis ornare pulvinar volutpat.",
    location: "EPE, Lagos, Nigeria",
    price: "₦70,000,000.00",
    logo: "/images/ark-logo.png",
  },
];

export default function Pot() {
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


  const renderSection = () => {
    let propertiesToRender: any[] = [];

    switch (activeSection) {
      case "available":
        propertiesToRender = availableProperties;
        break;
      case "inprogress":
        propertiesToRender = inProgressProperties;
        break;
      case "completed":
        propertiesToRender = completedProperties;
        break;
      default:
        propertiesToRender = [];
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-14 my-4 md:pl-0 pl-4">
        {propertiesToRender.map((property, index) => (
          <PropertyCard
            key={index}
            {...property}
            onClick={() => openModal(property)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-row items-center justify-start gap-4">
        <h1 className="text-2xl font-bold font-sans">Pot</h1>

        <div className="flex flex-row items-start">
          <button
            onClick={toggleTooltop}
            className="bg-primary/10 p-1 text-primary rounded-full"
          >
            <MdOutlineQuestionMark size="16px" />
          </button>
        </div>
        {isTooltopVisible && (
          <div className="ml-2 p-2 border w-1/4 border-gray-500 rounded-lg">
            <h1 className="text-primary text-xl font-bold">Pot</h1>
            <p className="text-xs">
              This is where you can view all your investments, see the progress
              of your investments and also make new investments.
            </p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7 font-sans">
        <div className="p-6 bg-primary text-white rounded-2xl shadow-md bg-[url('/images/tranparent-green-bg.png')] bg-cover bg-center w-full sm:w-[285px]">
          <p>Invested</p>
          <h2 className="text-3xl font-bold">₦70,000.70</h2>
        </div>
        <div className="flex flex-col justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 w-full shadow-sm">
            <input
              type="text"
              placeholder="Search"
              className="flex-grow outline-none bg-transparent text-gray-700 placeholder-gray-500 placeholder:text-sm"
            />
            <IoIosSearch className="h-5 w-5 text-gray-500" />
          </div>
          <div className="text-left">
            <p className="text-sm my-2 italic font-extrabold">{quote}</p>
            <p className="text-sm font-bold text-primary">{author}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 font-sans">
        <div className="hidden sm:flex flex-row justify-evenly items-center gap-10">
        <button
          className={`bg-gray-200 text-gray-600 font-medium text-sm px-4 w-full py-2 rounded-xl text-center ${
            activeSection === "available" ? "bg-gray-900 text-white" : ""
            }`}
            onClick={() => setActiveSection("available")}
            >
          Available
        </button>
        <button
          className={`bg-gray-200 text-gray-600 font-medium text-sm px-4 w-full py-2 rounded-lg text-center ${
            activeSection === "inprogress" ? "bg-gray-900 text-white" : ""
            }`}
            onClick={() => setActiveSection("inprogress")}
        >
          In Progress
        </button>
        <button
          className={`bg-gray-200 text-gray-600 font-medium text-sm px-4 w-full py-2 rounded-lg text-= ${
            activeSection === "completed" ? "bg-gray-900 text-white" : ""
            }`}
            onClick={() => setActiveSection("completed")}
            >
          Completed
        </button>
      </div>

      <div className="sm:hidden relative">
          <button
            onClick={toggleDropdown}
            className="w-full bg-gray-200 text-gray-600 font-medium text-sm px-4 py-2 rounded-lg text-left flex justify-between items-center"
          >
            {activeSection === "available" && "Available"}
            {activeSection === "inprogress" && "In Progress"}
            {activeSection === "completed" && "Completed"}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleOptionClick("available")}
              >
                Available
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleOptionClick("inprogress")}
              >
                In Progress
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleOptionClick("completed")}
              >
                Completed
              </button>
            </div>
          )}
        </div>
          </div>
      <div className="mt-4">{renderSection()}</div>

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
    </>
  );
}