import type { Metadata } from "next";
import Providers from './layoutWrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "InvestNaira - Authentication",
  description: "Login or create an account with InvestNaira",
};


export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
        <div>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            theme="light"
          />
        </div>
    </Providers>
  )
}