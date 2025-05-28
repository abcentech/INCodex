'use client'
import { ReactNode } from "react";
import { Provider } from 'react-redux';
import { store } from '../../libs/store';
import DashboardContent from "./DashboardContent";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <DashboardContent>{children}</DashboardContent>
    </Provider>
  );
}