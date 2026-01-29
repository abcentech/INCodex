"use client";
import React, { useState } from "react";
import logofullgreen from "../public/images/logo-full-green.png";
import investnairalogo from "../public/images/investnaira-logo.png";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/constants";
import Button from "./Button";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setisOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleNavbar = () => {
    setisOpen(!isOpen);
  };

  const closeMenu = () => {
    setisOpen(false);
  };

  return (
    <nav className="z-20 sticky top-0 flex justify-between items-center py-5 px-12 bg-gradient-to-b from-[#f9fff9] to-[#fff] dark:from-slate-900 dark:to-slate-950 dark:border-b dark:border-white/5 max-[768px]:px-4 shadow-sm transition-colors duration-300">
      <Link href="/">
        <Image
          src={logofullgreen}
          alt="Investnaira Logo"
          width={165}
          className="max-[375px]:hidden block"
        />
        <Image
          src={investnairalogo}
          alt="Investnaira Logo"
          width={40}
          className="max-[375px]:block hidden"
        />
      </Link>

      <ul className=" hidden  lg:gap-12 -full lg:flex font-sans">
        {NAV_LINKS.map((link) => (
          <Link
            href={link.href}
            key={link.key}
            className={
              pathname === link.href
                ? "text-[16px] font-medium text-primary "
                : "text-[16px] font-medium text-dark dark:text-gray-300 hover:text-primary transition-all"
            }
          >
            {link.label}
          </Link>
        ))}
      </ul>

      <div className="hidden lg:flex items-center gap-8 text-primary font-semibold text-[16px]">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-slate-600" />}
        </button>

        <Link href="/auth/login">
          <Button type="button" title="Login" />
        </Link>
        <div>
          <Link href="/auth/create-account">
            <Button
              type="button"
              title="Create an Account"
              className=" bg-primary rounded-xl py-[10px] px-6 text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-90 hover:bg-[#409f43] duration-300 cursor-pointer shadow-md"
            />
          </Link>
        </div>
      </div>

      <div
        className=" inline-block lg:hidden cursor-pointer"
        onClick={toggleNavbar}
      >
        {isOpen ? (
          <IoClose
            size={38}
            className=" text-primary transition-transform transform rotate-180"
          />
        ) : (
          <IoMenu
            size={38}
            className=" text-primary transition-transform transform rotate-0"
          />
        )}
      </div>

      {isOpen && (
        <div className="lg:hidden block bg-white dark:bg-slate-900 absolute top-16 left-0 w-full h-screen pt-28 transition-colors duration-300">
          <ul className="flex flex-col items-center gap-8 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                href={link.href}
                key={link.key}
                className=" text-[16px] font-medium text-dark dark:text-gray-300 transition-all hover:text-primary"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-dark dark:text-gray-300 font-medium"
            >
              {theme === 'dark' ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-slate-600" />}
              <span>{theme === 'dark' ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </ul>
          <div
            className="flex flex-col items-center gap-6 mt-9 py-6 text-primary font-semibold text-[16px]"
            onClick={closeMenu}
          >
            <Link href="/auth/login">
              <Button type="button" title="Login" />
            </Link>
            <div className=" bg-primary rounded-xl py-[10px] px-6 text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-90 hover:bg-[#409f43] duration-300 cursor-pointer shadow-md">
              <Link href="/auth/create-account">
                <Button type="button" title="Create an Account" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
