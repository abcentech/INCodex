"use client";

import React from "react";
import Button from "./Button";
import Image from "next/image";
import group from "../public/images/group.png";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth/create-account");
    // console.log("Hello");
  };

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16 mt-16 lg:mt-20 md:px-10 lg:px-14 px-6">
      <div className="flex-1 w-full lg:w-auto lg:text-left text-center">
        <p className="text-5xl md:text-7xl font-extrabold font-rowdies mb-6 lg:mb-8 lg:max-w-[500px] ">
          Build <br />
          Generational
          <span className="block text-primary">Wealth.</span>
        </p>
        <p className="md:text-lg text-base mb-6 lg:mb-8 font-medium lg:text-left px-4 lg:px-0">
          InvestNaira addresses these challenges by providing a comprehensive
          financial platform that simplifies the process of wealth accumulation.
          Our platform grants users seamless access to a diverse range of
          financial opportunities, coupled with educational resources to bolster
          financial literacy.
        </p>
        <Link href="/auth/create-account">
          <button
            // onClick={handleGetStarted}
            className="bg-primary font-semibold rounded-xl w-60 text-center py-3 px-6 text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-90 hover:bg-[#409f43] duration-300 cursor-pointer shadow-md"
          >
            Get Started
          </button> 
        </Link>
      </div>
      <div className="flex-1 lg:mr-auto mr-12 md:mr-20 w-full lg:w-auto mt-8 lg:mt-0">
        <Image
          src={group}
          alt="Generational Wealth"
          width={450}
          height={450}
          layout="responsive"
        />
      </div>
    </div>
  );
};

export default Hero;
