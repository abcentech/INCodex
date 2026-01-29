import React from "react";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";

interface PropertyCardProps {
  imageSrc: string;
  title: string;
  logo: string;
  description: string;
  location: string;
  price: string;
  progress?: {
    duration: string;
    amount: string;
  };
  projectedRate?: number;
  onClick: () => void;
}

const PropertyCard = ({
  imageSrc,
  title,
  description,
  location,
  price,
  progress,
  projectedRate = 18.2, // Default to a high-yield accelerator rate
  onClick,
}: PropertyCardProps) => {
  // Simple 10-year projection: P * (1 + r)^10
  const numericPrice = Number(price.replace(/[^0-9.-]+/g, "")) || 0;
  const projectedValue = numericPrice * Math.pow(1 + (projectedRate / 100), 10);

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
    notation: "compact",
  });
  return (
    <button
      onClick={onClick}
      className="group relative w-full h-full flex flex-col items-start text-left bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
    >
      <div className="relative w-full h-48 overflow-hidden rounded-t-3xl">
        <Image
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

        {/* Growth Badge */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 text-white text-[10px] font-bold shadow-lg">
          Projected 10y: <span className="text-green-400 font-black">{formatter.format(projectedValue)}</span>
        </div>

        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="font-bold text-lg font-rowdies drop-shadow-md">{title}</h2>
          <div className="flex items-center text-xs font-medium opacity-90 font-gilroy mt-1">
            <MapPin size={14} className="mr-1" />
            {location}
          </div>
        </div>
      </div>

      <div className="p-5 w-full flex-1 flex flex-col justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-3 mb-4 font-gilroy leading-relaxed">{description}</p>

          <p className="text-xl font-black text-gray-900 dark:text-white font-rowdies mb-1">
            {price} <span className="text-xs text-gray-400 font-normal"> / Unit</span>
          </p>
        </div>

        {progress ? (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 w-full">
            <div className="flex justify-between items-end mb-1">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Progress</p>
              <p className="text-xs font-bold text-primary font-gilroy">{progress.amount} Saved</p>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-full rounded-full w-full/2 animate-pulse"></div>
              {/* Note: Width would be dynamic in real app, hardcoded w-1/2 for demo unless percentage passed */}
            </div>
          </div>
        ) : (
          <div className="mt-4 w-full flex items-center text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
            View Opportunity <ArrowRight size={16} className="ml-2" />
          </div>
        )}
      </div>
    </button>
  );
};

export default PropertyCard;
