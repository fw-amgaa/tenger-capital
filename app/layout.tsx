import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/language-context";
import type { Metadata } from "next";
import { manrope, moisette } from "./fonts";
import "./globals.css";
import { Toaster } from "sonner";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tenger Capital",
  description: "Create value through investing.",
  icons: {
    icon: "/logo/logo_mono.png",
  },
  openGraph: {
    title: "Tenger Capital",
    description: "Create value through investing.",
    url: "https://www.tengercapital.mn",
    siteName: "Tenger Capital",
    images: [
      {
        url: "/logo/logo_main_white.png",
        alt: "Tenger Capital",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tenger Capital",
    description: "Create value through investing.",
    images: ["/logo/logo_main_white.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${moisette.variable} ${manrope.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Toaster />
            <Suspense fallback={null}>
              <AnalyticsProvider />
            </Suspense>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
