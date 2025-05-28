"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaRegCircleDot } from "react-icons/fa6";
import { SlCalculator } from "react-icons/sl";
import { IoCheckmarkSharp } from "react-icons/io5";

interface ProgressiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  content: string;
  property?: {
    imageSrc: string;
    logo: string;
    title: string;
    description: string;
    location: string;
    price: string;
    progress?: {
      duration: string;
      amount: string;
    };
  };
  showCalculator?: boolean;
  activeSection: string;
}

const ProgressiveModal = ({
  isOpen,
  onClose,
  onNext,
  currentStep,
  totalSteps,
  content,
  property,
  showCalculator,
  activeSection,
}: ProgressiveModalProps) => {
  const [calculationResult, setCalculationResult] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setIsPaymentCompleted(false);
    }
  };

  const handleMakePayment = () => {
    // logic needed for making payment
    setIsPaymentCompleted(true);
  };

  const handleCalculatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resultText = "₦194,444.44 / 3years\n\nIt would take 3 years to complete the payment if you put in ₦10,000.00 monthly.";
    setCalculationResult(resultText);
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-end z-50 ">
      <div className="bg-white rounded-lg md:w-2/3 h-screen overflow-y-scroll">
        <div className="sticky top-0 bg-white px-8 py-3 border-b">
          <div className="flex justify-between items-start">
            <h2 className="text-lg md:text-xl font-extrabold font-sans">{property.title}</h2>
            <button onClick={onClose} className="text-red-500 text-2xl">&times;</button>
          </div>
        </div>

        <div className="p-4 md:p-6 font-sans">
          {isPaymentCompleted ? (
            <div className="mt-4 text-center flex flex-col items-center justify-center">
              <div className="text-primary rounded-full border-2 border-primary p-6 md:p-8 bg-primary/20">
                <IoCheckmarkSharp className="text-4xl md:text-5xl" />
              </div>
              <p className="text-2xl md:text-4xl font-extrabold my-8">Pot Created Successfully</p>
              <p className="text-lg md:text-base">Your Pot - {property.title}</p>
              <p className="text-tertiary text-lg md:text-xl font-bold">
                {property.price}
                <span> <p>Location: {property.location}</p></span>
              </p>
              <span className="text-lg md:text-base">has been successfully created</span>
              <p className="text-base md:text-lg mt-5">
                This would last for <span className="text-primary">3 years</span> on a duration of{" "}
                <span className="text-primary">₦194,444.444/Monthly</span> {property.progress?.duration}
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-center mb-4 justify-center">
                <Image
                  src={property.logo}
                  alt={property.title}
                  width={70}
                  height={70}
                  className="rounded-full p-2 border-2 border-tertiary mb-4 md:mb-0 md:mr-4"
                />
                <div className="text-center md:text-left font-sans">
                  <p className="text-xl font-bold text-tertiary mb-1">
                    {property.price} <span className="text-gray-500 font-normal">/ Plot</span>
                  </p>
                  <div className="text-[13px] text-tertiary flex items-center justify-center md:justify-start">
                    <FaRegCircleDot className="mr-2" />
                    {property.location}
                  </div>
                </div>
              </div>

              <div className="mb-4 font-sans">
                <h3 className="text-xl font-bold">Description</h3>
                <p className="text-gray-600 text-xs">{property.description}</p>
              </div>

              {showForm ? (
                <div className="mt-12 w-full mx-auto grid grid-cols-1 gap-8 max-w-[400px] font-sans">
                  <div className="relative">
                    <label htmlFor="name" className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute -top-2 left-3 px-1">Name</label>
                    <input id="name" name="name" type="text" placeholder="Enter Desired Pot Name" className="py-3 w-full px-4 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none placeholder:text-xs text-[13px]" required />
                  </div>
                  <div className="relative">
                    <label htmlFor="amount" className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute -top-2 left-3 px-1">Amount</label>
                    <input id="amount" name="amount" type="text" placeholder="Enter Amount" className="py-3 w-full px-4 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none placeholder:text-xs text-[13px]" required />
                  </div>
                  <div className="relative">
                    <label htmlFor="duration" className="block text-sm font-medium text-[#33363F] mb-1 bg-white absolute -top-2 left-3 px-1">Duration</label>
                    <select id="duration" name="duration" className="py-3 w-full px-4 border border-gray-300 rounded-lg text-gray-600 outline-none text-xs">
                      <option value="" disabled selected>How often would you put in money?</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((index) => (
                      <Image
                        key={index}
                        src={property.imageSrc}
                        alt={`${property.title} ${index}`}
                        width={200}
                        height={200}
                        className="rounded-lg w-full h-auto object-cover"
                        quality={100}
                      />
                    ))}
                  </div>

                  {property.progress && (
                    <div className="mb-4">
                      <p className="text-primary font-semibold">Progress:</p>
                      <p className="text-sm">Duration: {property.progress.duration}, Amount: {property.progress.amount}</p>
                    </div>
                  )}

                  {showCalculator && (
                    <div className="mb-6 font-sans ">
                      <form onSubmit={handleCalculatorSubmit} className="bg-gray-50 px-4 py-5 rounded-lg">
                        <h3 className="text-lg font-bold mb-3">Pot Calculator</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="relative">
                            <label htmlFor="calcAmount" className="block text-[13px] font-medium text-[#33363F] mb-1 bg-white absolute -top-2 left-3 px-1">Amount</label>
                            <input id="calcAmount" name="calcAmount" type="text" placeholder="Enter Amount" className="py-2 w-full px-4 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 outline-none placeholder:text-xs" required />
                          </div>
                          <div className="relative">
                            <label htmlFor="calcDuration" className="block text-[13px] font-medium text-[#33363F] mb-1 bg-white absolute -top-2 left-3 px-1">Duration</label>
                            <select id="calcDuration" name="calcDuration" className="text-xs py-[11px] w-full px-4 border border-gray-300 rounded-lg text-gray-600 outline-none">
                              <option value="" disabled selected className="text-[11px]">How often would you put in money?</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                            </select>
                          </div>
                          <button type="submit" className="bg-gray-900 text-white px-4 py-1 rounded-md w-full">Calculate</button>
                        </div>

                        {calculationResult && (
                          <div className="mt-6 text-center bg-gray-200 p-5 rounded-lg font-sans">
                            <p className="text-xl md:text-2xl text-[#673F5F] font-bold">₦194,444.44 / 3years</p>
                            <p className="text-xs md:text-sm text-gray-500">It would take 3 years to complete the payment if you put in ₦10,000.00 monthly.</p>
                          </div>
                        )}

                        <div className="flex mt-6 items-center justify-center gap-4 font-sans">
                          <SlCalculator className="text-2xl md:text-3xl" />
                          <p className="text-gray-600 text-center text-xs md:text-sm">Fill in the fields to calculate</p>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <div className="text-center mb-6 p-4 md:p-6 font-sans">
          {!isPaymentCompleted && (
            <button
              onClick={!showForm ? toggleForm : handleMakePayment}
              className="bg-primary font-semibold text-white px-4 py-2 rounded-md w-full md:w-1/2 transition-colors hover:bg-primary-dark"
            >
              {showForm ? "Make Payment" : "Purchase Pot"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressiveModal;