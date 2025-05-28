"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isStudioPage = pathname.startsWith("/studio");

  return (
    <>
      {!isAuthPage && !isDashboardPage && !isStudioPage && <Navbar />}
      {children}
      {!isAuthPage && !isDashboardPage && !isStudioPage && <Footer />}
    </>
  );
}
