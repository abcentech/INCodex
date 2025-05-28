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

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setisOpen] = useState(false);

  const toggleNavbar = () => {
    setisOpen(!isOpen);
  };

  const closeMenu = () => {
    setisOpen(false);
  };

  return (
    <nav className="z-20 sticky top-0 flex justify-between items-center py-5 px-12 bg-gradient-to-b from-[#f9fff9] to-[#fff] max-[768px]:px-4 shadow-sm">
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
                : "text-[16px] font-medium text-dark hover:text-primary transition-all"
            }
          >
            {link.label}
          </Link>
        ))}
      </ul>

      <div className="hidden lg:flex items-center gap-8 text-primary font-semibold text-[16px]">
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
        <div className="lg:hidden block bg-white absolute top-16 left-0 w-full h-screen pt-28">
          <ul className="flex flex-col items-center gap-8 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                href={link.href}
                key={link.key}
                className=" text-[16px] font-medium text-dark transition-all hover:text-primary"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
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
