import React from "react";
import Image from "next/image";
import { FaRegCircleDot } from "react-icons/fa6";

interface PropertyCardProps {
  imageSrc: string;
  title: string;
  logo: string;
  description: string;
  location: string;
  price: string;
  progress: {
    duration: string;
    amount: string;
  };
  onClick: () => void;
}

const PropertyCard = ({
  imageSrc,
  title,
  description,
  location,
  price,
  logo,
  progress,
  onClick,
}: PropertyCardProps) => {
  return (
    <button
      onClick={onClick}
      className="max-w-xs rounded-3xl shadow-md overflow-hidden border-1 border"
    >
      <div className="overflow-hidden rounded-3xl p-4">
        <Image
          className="w-full h-20 object-cover rounded-2xl"
          src={imageSrc}
          alt={title}
          width={500}
          height={20}
          quality={100}
          layout="responsive"
        />
      </div>
      <div className="p-5">
        <div className="flex flex-row items-center justify-between font-sans mb-3">
          <h2 className="font-bold text-base">{title}</h2>
          <Image
            className=" object-cover"
            src={logo}
            alt={title}
            width={30}
            height={30}
          />
        </div>
        <p className="text-gray-600 text-xs mb-4 text-justify font-sans">{description}</p>
        <div className="flex items-center text-[13px] font-bold mb-1 text-tertiary font-sans">
          <span className="material-icons text-tertiary mr-1">
            <FaRegCircleDot />
          </span>
          {location}
        </div>
        <p className="text-xl font-bold text-tertiary text-left font-sans">
          {price} <span className="text-gray-500 font-light"> / Plot</span>
        </p>
        {progress && (
          <div className="mt-2  flex flex-row gap-2 items-center justify-start">
            <p className="text-primary text-sm font-semibold">
              {progress.duration} reached :
            </p>
            <p className="text-primary text-sm  font-semibold">
              {progress.amount}
            </p>
          </div>
        )}
      </div>
    </button>
  );
};

export default PropertyCard;
