import React from "react";
import Dot1 from "../../../public/Dot1.png";
import Dot2 from "../../../public/Dot2.png";
import street from "../../../public/street.png";
import Image from "next/image";
import { FaRegCircleDot } from "react-icons/fa6";
import Link from "next/link";
import { useTransactionSlice } from "@/hook/useTransaction";

interface ActivityItemProps {
  type: string;
  details?: string;
  amount: number;
  isPositive?: boolean;
}

interface RecentActivity {
  type: string;
  amount: number;
  isPositive: boolean;
  details?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  type,
  details,
  amount,
}) => (
  <div className="flex items-center justify-between py-3 px-4 md:px-0">
    <div className="flex items-center gap-3">
      <div className="relative w-6 md:w-7 h-6 md:h-7 flex-shrink-0">
        <Image
          src={type === "deposit" ? Dot1 : Dot2}
          alt={type === "deposit" ? "positive indicator" : "negative indicator"}
          className="w-full h-full object-contain"
          width={20}
          height={20}
        />
      </div>
      <div>
        <p className="text-base md:text-[19px] font-extrabold">{type}</p>
        <p className="text-[10px] md:text-[11px] text-gray-800">View Details</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-base md:text-[19px] font-extrabold text-[#455A64]">
        {amount}
      </p>
      <p className="text-[10px] md:text-[11px] text-gray-800">6:00am WAT</p>
    </div>
  </div>
);

const OfferCard: React.FC = () => (
  <div className="hidden md:block bg-dark text-white p-4 py-5 rounded-3xl h-full shadow-lg pb-16">
    <h3 className="font-extrabold mb-4 text-center test-2xl">My Offer</h3>
    <div className="bg-white rounded-xl p-4 text-black">
      <Image
        src={street}
        alt="Property aerial view"
        className="w-full h-32 object-cover rounded-lg mb-3"
      />
      <h4 className="text-base font-bold mb-1">ARK BUILDERS REAL ESTATE</h4>
      <div className="text-[13px] flex text-tertiary items-center font-bold">
        <span className="material-icons text-tertiary mr-1">
          <FaRegCircleDot />
        </span>{" "}
        EPE, Lagos, Nigeria
      </div>
      <p className="text-lg font-bold mb-2 text-tertiary font-sans">
        ₦700,000.00 <span className="text-gray-500 font-light"> /Plot</span>
      </p>
      <div className="text-sm mb-4 font-extrabold">
        <span className="text-green-600">With ₦70,000 Monthly</span>
        <span className="font-bold"> / You would be a land owner in </span>
        <span className="text-green-600">10months.</span>
      </div>
      <button className="w-full bg-primary text-white rounded-lg py-2 mt-4 mb-2 text-sm font-medium">
        Unlock this Opportunity!!!
      </button>
    </div>
    <button className="w-full border text-primary bg-white rounded-lg py-2 mt-7 text-sm">
      Recalculate Offer
    </button>
    <Link href="/dashboard/pot">
      <button className="w-full hover:text-gray-400 text-white py-2 text-sm">
        View Other Offers
      </button>
    </Link>
  </div>
);

const PostKycDashboard = () => {
  const { transactions } = useTransactionSlice();
  // const recentActivities: RecentActivity[] = [
  //   {
  //     type: "Pot Creation - A New Laptop",
  //     amount: "₦70,000.70",
  //     isPositive: true,
  //   },
  //   { type: "Wallet Credited", amount: "₦100,000,000", isPositive: true },
  //   { type: "Wallet Credited", amount: "₦100,000,000", isPositive: true },
  //   {
  //     type: "Pot Completed 🎉",
  //     amount: "You are a Land Owner",
  //     isPositive: true,
  //   },
  //   { type: "Withdrawal", amount: "₦100,000,000", isPositive: false },
  //   {
  //     type: "Pot Completed 🎉",
  //     amount: "You are a Land Owner",
  //     isPositive: true,
  //   },
  //   { type: "Withdrawal", amount: "₦100,000,000", isPositive: false },
  //   { type: "Withdrawal", amount: "₦100,000,000", isPositive: false },
  //   { type: "Withdrawal", amount: "₦100,000,000", isPositive: false },
  // ];

  return (
    <div className="h-full w-full mt-8 md:mt-14">
      <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 lg:gap-16 gap-4 font-sans pb-4 lg:pb-0">
        <div className="flex-shrink-0 w-[280px] lg:w-auto">
          <div className="p-4 md:p-6 bg-dark text-white rounded-2xl shadow-md bg-[url('/images/tranparent-gray-bg.png')] bg-cover bg-center h-full">
            <p className="text-sm md:text-base">Total Savings</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2">
              ₦830.21
            </h2>
          </div>
        </div>
        <div className="flex-shrink-0 w-[280px] lg:w-auto">
          <div className="p-4 md:p-6 bg-primary text-white rounded-2xl shadow-md bg-[url('/images/tranparent-green-bg.png')] bg-cover bg-center h-full">
            <p className="text-sm md:text-base">Ongoing Pots</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2">
              2
            </h2>
          </div>
        </div>
        <div className="flex-shrink-0 w-[280px] lg:w-auto">
          <div className="p-4 md:p-6 bg-tertiary text-white rounded-2xl shadow-md bg-[url('/images/tranparent-purple-bg.png')] bg-cover bg-center h-full">
            <p className="text-sm md:text-base">Total Interest</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2">
              ₦100,000.70
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:mt-20 mt-16">
        <div className="md:col-span-8 bg-white md:border-r md:pr-8">
          <h3 className="font-extrabold mb-2 text-xl md:text-2xl text-primary px-4 md:px-0">
            Recent Activities
          </h3>
          <div className="overflow-y-auto max-h-[600px]">
            {transactions.map((activity, index) => (
              <ActivityItem
                key={index}
                type={activity.type}
                amount={activity.amount}
              />
            ))}
          </div>
        </div>
        <div className="md:col-span-4">
          <OfferCard />
        </div>
      </div>
    </div>
  );
};

export default PostKycDashboard;
