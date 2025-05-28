import React from "react";
import Button from "./Button";
import Image from "next/image";
import estate from "../public/images/estate.png";
import Link from "next/link";

const Build = () => {
  return (
    <div className='text-white p-7 md:px-14 pt-12 flex flex-col md:flex-row items-center justify-between bg-[url("/images/invest-bg.png")] bg-cover bg-center mb-12'>
      <div className="mb-6 md:mb-0 md:mr-6 flex-1">
        <p className="font-medium text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3">
          Try InvestNaira Now
        </p>
        <p className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-[500px] mb-4 sm:mb-5">
          Start Building Wealth in 3 minutes
        </p>
        <Link href="/auth/create-account" className="inline-block">
          <Button
            type="button"
            title="Create an Account"
            className="bg-tertiary font-semibold rounded-xl w-full sm:w-60 text-center py-[10px] px-6 text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-90 hover:bg-[#7b426d] duration-300 cursor-pointer shadow-md"
          />
        </Link>
      </div>
      <div className="w-full md:w-1/3 mb-[-28px]">
        <Image
          src={estate}
          alt="real estate"
          width={400}
          height={300}
          layout="responsive"
        />
      </div>
    </div>
  );
};

export default Build;
