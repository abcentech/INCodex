import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdHomeFilled, MdOutlineWallet } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { GiChart } from "react-icons/gi";

const menuItems = [
  { href: "/dashboard", icon: MdHomeFilled, label: "Home" },
  { href: "/dashboard/pot", icon: GiChart, label: "Campaigns" },
  { href: "/dashboard/wallet", icon: MdOutlineWallet, label: "Wallet" },
  { href: "/dashboard/profile", icon: IoPersonCircleOutline, label: "Profile" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-around items-center h-16 text-gray-500 font-sans">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center hover:text-primary ${
            pathname === item.href ? " text-primary" : ""
          }`}
        >
          <item.icon className="text-2xl" />
          <span className="text-sm md:text-base">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}