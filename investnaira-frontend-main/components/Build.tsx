"use client";
import React from "react";
import Button from "./Button";
import Image from "next/image";
import estate from "../public/images/estate.png";
import Link from "next/link";
import { motion } from "framer-motion";

const Build = () => {
  return (
    <motion.div
      className='text-white p-7 md:px-14 pt-12 flex flex-col md:flex-row items-center justify-between bg-[url("/images/invest-bg.png")] bg-cover bg-center mb-12 transform-gpu'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="mb-6 md:mb-0 md:mr-6 flex-1">
        <motion.p
          className="font-medium text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Try InvestNaira Now
        </motion.p>
        <motion.p
          className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-[500px] mb-4 sm:mb-5"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          Start Building Wealth in 3 minutes
        </motion.p>
        <Link href="/auth/create-account" className="inline-block">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              title="Create an Account"
              className="bg-tertiary font-semibold rounded-xl w-full sm:w-60 text-center py-[10px] px-6 text-white transition ease-in-out duration-300 cursor-pointer shadow-md"
            />
          </motion.div>
        </Link>
      </div>
      <motion.div
        className="w-full md:w-1/3 mb-[-28px]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Image
          src={estate}
          alt="real estate"
          width={400}
          height={300}
          layout="responsive"
        />
      </motion.div>
    </motion.div>
  );
};

export default Build;
