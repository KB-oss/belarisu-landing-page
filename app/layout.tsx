import type { Metadata } from "next";
import {  Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NavBar from "@/components/navbar";
import { Footer } from "@/components/footer";



const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ['latin'],
  weight:'300'
});

export const metadata: Metadata = {
  title: "Belarisu Medical Centre",
  description: "Belarisu Medical Centre",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={` ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster position="top-right" />
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
