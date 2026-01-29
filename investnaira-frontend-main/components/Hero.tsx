"use client";

import React from "react";
import Image from "next/image";
import group from "../public/images/group.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import WealthTicker from "./WealthTicker";
import WealthMapModal from "../app/dashboard/_components/WealthMapModal";
import { useState } from "react";

const Hero = () => {
  const router = useRouter();
  const [showMapModal, setShowMapModal] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.div
      className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16 mt-16 lg:mt-20 md:px-10 lg:px-14 px-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex-1 w-full lg:w-auto lg:text-left text-center">
        <motion.div variants={itemVariants}>
          <WealthTicker />
        </motion.div>
        <motion.p
          className="text-5xl md:text-7xl font-extrabold font-rowdies mb-6 lg:mb-8 lg:max-w-[600px]"
          variants={itemVariants}
        >
          Your money is <br />
          losing value <br />
          <span className="block text-primary">every second.</span>
        </motion.p>
        <motion.p
          className="md:text-xl text-lg mb-6 lg:mb-10 font-medium lg:text-left px-4 lg:px-0 text-gray-600 dark:text-gray-300"
          variants={itemVariants}
        >
          Inflation never sleeps, neither should your wealth.
          Build your <span className="text-primary font-bold">₦100M Freedom Map</span> in 2 minutes
          and join 10,000+ Nigerians securing their future today.
        </motion.p>
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMapModal(true)}
          className="bg-primary font-bold rounded-2xl w-72 text-center py-4 px-8 text-xl text-white transition ease-in-out duration-300 cursor-pointer shadow-xl shadow-primary/30"
        >
          Map My Freedom &rarr;
        </motion.button>
      </div>
      <WealthMapModal isOpen={showMapModal} onClose={() => setShowMapModal(false)} />

      <motion.div
        className="flex-1 lg:mr-auto mr-12 md:mr-20 w-full lg:w-auto mt-8 lg:mt-0"
        variants={itemVariants}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <Image
          src={group}
          alt="Generational Wealth"
          width={450}
          height={450}
          layout="responsive"
        />
      </motion.div>
    </motion.div>
  );
};

export default Hero;
