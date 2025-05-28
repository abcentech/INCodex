import { footerLinks, socialLinks } from "@/constants";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className=" pt-8 lg:pb-12 pb-20 lg:px-[82px] px-8 bg-gradient-to-b from-[#fff] to-[#f9fff9] ">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <h3 className="font-bold text-xl mb-4 font-rowdies">{section.title}</h3>
            <ul className=" flex flex-col gap-6 mb-3">
              {section.links.map((link, index) => (
                <li
                  key={index}
                  className="font-normal text-[#808080] text-sm transition-all hover:text-primary"
                >
                  <Link href={link.href}>
                    <p>{link.label}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-20 pt-10 border-t">
        <div className="flex justify-between mb-10 ">
          {socialLinks.map((social, index) => (
            <Link
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={social.icon} alt="logo" width={25} height={25} className=" w-6 h-6" />
            </Link>
          ))}
        </div>
        <div className="text-left text-gray-600 mb-4 text-sm">
          No 9 Emmanuel Kolawole Street, Igbobi, Lagos.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
