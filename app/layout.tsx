import type { Metadata } from "next";
import { Berkshire_Swash, Open_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";


const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});


const berkshireSwash = Berkshire_Swash({
  variable: "--font-berkshire-swash",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Job Wave — AI-Powered Job Application Platform",
  description:
    "Upload your resume, analyze ATS compatibility, search jobs, and mass-apply with AI-tailored applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} ${berkshireSwash.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
