"use client";
import React, { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { MdHomeFilled, MdOutlineWallet } from "react-icons/md";
import { IoPersonCircleOutline, IoLogOut } from "react-icons/io5";
import { graphIcon } from "@/utils/icons";
import { Separator } from "@/components/Seperator";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logofullgreen from "../../../public/images/logo-full-green.png";
import Logo from "@/public/images/investnaira-logo.png";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdOutlineAutoGraph } from "react-icons/md";
import { GiChart } from "react-icons/gi";
import { logout } from '@/libs/api';
import { useRouter } from 'next/navigation';


interface DashboardSideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSideBar({ isOpen, onClose }: DashboardSideBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { href: "/dashboard", icon: <MdHomeFilled />, label: "Home" },
    { href: "/dashboard/pot", icon: <GiChart />, label: "Campaigns" },
    { href: "/dashboard/wallet", icon: <MdOutlineWallet />, label: "Wallet" },
    { href: "/dashboard/profile", icon: <IoPersonCircleOutline />, label: "Profile" },
  ];


  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push('/auth/login');
    } else {
      console.error('Logout failed:', result.message);
    }
  };


  return (
     <div className=" border-r h-screen flex flex-col justify-between py-6 px-8">
          <div className="flex flex-col gap-14">
            <div>
               <Image
            src={logofullgreen}
            alt="Investnaira Logo"
            width={150}
            className="max-[375px]:hidden block"
            />
            </div>
            <nav className=" flex flex-col gap-3">
              {menuItems.map((item) => (
                <React.Fragment key={item.href}>
                  <Link
                    className={clsx(
                      "flex items-center text-sm gap-2 rounded-lg px-3 py-2 transition-all font-sans text-gray-500 ",
                      {
                        "bg-primary text-white": pathname === item.href,
                      }
                    )}
                    href={item.href}
                  >
                    <div className="text-2xl">{item.icon}</div>
                    {item.label}
                  </Link>
                  <Separator className="" />
                </React.Fragment>
              ))}
            </nav>
          </div>
      
          <div className="">
            <button
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 text-sm transition-all hover:text-primary bg-gray-100 font-sans pr-16"
              onClick={handleLogout}
            >
              <div className="text-2xl">
                <IoLogOut />
              </div>
              Logout
            </button>
          </div>
        </div>

  );
}