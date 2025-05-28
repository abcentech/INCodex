"use client";

import { ReactNode, useState } from "react";
import DashboardSideBar from "./_components/DashboardSideBar";
import MobileBottomNav from "./_components/MobileBottomNav";

export default function DashboardContent({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex w-full overflow-hidden h-screen">
      <div className="md:w-[275px] lg:block hidden">
        <DashboardSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
      <div className="flex flex-col w-full  overflow-y-scroll h-full custom-scrollbar lg:px-10">
        <main className="flex-1 flex flex-col gap-4 p-4 lg:gap-6 pb-16 md:pb-4 lg:mt-0 mt-6">
          {children}
        </main>
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
          <MobileBottomNav />
        </div>
      </div>
    </div>
  );
}