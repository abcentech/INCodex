import type { Metadata } from "next";
import { Inter, Rowdies } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });
const rowdies = Rowdies({ subsets: ["latin"], weight: ["300", "400", "700"], variable: '--font-rowdies', });

const gilroy = localFont({
  src: [
    {
      path: "../public/fonts/Gilroy-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Gilroy-Heavy.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Gilroy-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Gilroy-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: '--font-gilroy'
});

export const metadata: Metadata = {
  title: {
    default: "InvestNaira | Build Wealth Steadily",
    template: "%s | InvestNaira"
  },
  description: "InvestNaira helps you build long-term wealth through automated savings, strategic investments, and expert financial advisory.",
  openGraph: {
    title: "InvestNaira | Build Wealth Steadily",
    description: "Secure your financial future with InvestNaira. Automated savings, diverse investment pots, and expert advisory.",
    url: "https://investnaira.com",
    siteName: "InvestNaira",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvestNaira | Build Wealth Steadily",
    description: "Secure your financial future with InvestNaira. Automated savings, diverse investment pots, and expert advisory.",
    creator: "@investnaira",
  },
  metadataBase: new URL('https://investnaira.com'),
};

import { ThemeProvider } from '../context/ThemeContext';
import QueryProvider from "@/components/QueryProvider";
import NairaAI from "@/components/NairaAI";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/static/favicon-16x16.png"
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href="/static/favicon-32x32.png"
          sizes="32x32"
        />
      </head>
      <body className={` ${rowdies.variable} ${gilroy.variable}`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white p-4 rounded-lg z-50">
          Skip to main content
        </a>
        <Script
          src="https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js"
          strategy="lazyOnload"
        />
        <ThemeProvider>
          <QueryProvider>
            <div id="main-content">
              <LayoutWrapper>{children}</LayoutWrapper>
            </div>
            <NairaAI />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
