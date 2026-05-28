     1|import type { Metadata } from "next";
     2|import { Geist, Geist_Mono } from "next/font/google";
     3|import "./globals.css";
     4|
     5|const geistSans = Geist({
     6|  variable: "--font-geist-sans",
     7|  subsets: ["latin"],
     8|});
     9|
    10|const geistMono = Geist_Mono({
    11|  variable: "--font-geist-mono",
    12|  subsets: ["latin"],
    13|});
    14|
    15|export const metadata: Metadata = {
    16|  title: "ReviewMantis | Get Google Reviews on Autopilot",
    17|  description: "Stop paying $250/mo. Send SMS review requests in one click.",
    18|};
    19|
    20|export default function RootLayout({
    21|  children,
    22|}: Readonly<{
    23|  children: React.ReactNode;
    24|}>) {
    25|  return (
    26|    <html lang="en">
    27|      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-50 text-slate-900`}>
    28|        {children}
    29|      </body>
    30|    </html>
    31|  );
    32|}
    33|