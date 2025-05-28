import type { Metadata } from "next";
import { Inter, Rowdies } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"]});
const rowdies = Rowdies({  subsets: ["latin"], weight: ["300", "400", "700"], variable: '--font-rowdies',});

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
  title: "InvestNaira",
  description: "Build wealth Steadily",
};

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
      <Script
        src="https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js"
        strategy="beforeInteractive" 
      />
      <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
