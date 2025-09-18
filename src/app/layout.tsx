import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

import { TRPCReactProvider } from "@/trpc/react";
import { AbilityProvider } from "@/providers/ability-context";
import {
  ConsentManagerDialog,
  ConsentManagerProvider,
  CookieBanner,
} from "@c15t/nextjs";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Augment AI | Next-Generation Enterprise HR Intelligence Platform",
  description:
    "Revolutionary AI workforce intelligence platform delivering autonomous HR operations, predictive analytics, and cognitive automation. Transform your enterprise with advanced machine learning-powered human capital management.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <AbilityProvider>
            <ConsentManagerProvider
              options={{
                mode: "c15t",
                backendURL: "/api/c15t",
              }}
            >
              {children}
              <Analytics />
              <ConsentManagerDialog />
              <CookieBanner />
            </ConsentManagerProvider>
          </AbilityProvider>
          <Toaster position="top-right" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
