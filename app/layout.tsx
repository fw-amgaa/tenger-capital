import CursorFollower from "@/components/cursor-follower";
import Header from "@/components/sections/header";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "./globals.css";
import { moisette, ttCommons } from "./fonts";
import FloatingDashboard from "@/components/sections/floating-dashboard";

export const metadata: Metadata = {
  title: "Tenger Capital",
  description: "Create value through investing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${moisette.variable} ${ttCommons.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          {/* <CursorFollower /> */}

          <FloatingDashboard deposits={[{
            amount: '4,000.00',
            id: "1",
            timeAgo: '7 days ago'
          }, {
            amount: '20,000.00',
            id: "2",
            timeAgo: '22 hours ago'
          }]} />
        </ThemeProvider>
      </body>
    </html>
  );
}
