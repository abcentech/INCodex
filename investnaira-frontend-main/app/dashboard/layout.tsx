'use client'
import { ReactNode } from "react";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../../libs/store';
import DashboardContent from "./DashboardContent";
import LoadingSpinner from "../../components/Loader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div className="h-screen w-full flex items-center justify-center bg-gray-50"><LoadingSpinner /></div>} persistor={persistor}>
        <DashboardContent>{children}</DashboardContent>
      </PersistGate>
    </Provider>
  );
}