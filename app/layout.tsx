import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
import QueryProvider from "@/components/QueryProvider";
import ThemeProvider from "@/components/theme-provider";
export const metadata: Metadata = {
  title: "incognitalk.",
  description: "Reaveling the words anonimously.",
  metadataBase: new URL("https://incogni-talk.vercel.app/"),
  twitter: {
    title: "incognitalk.",
    description: "Reaveling the words anonimously.",
    card: "summary_large_image",
    creator: "@dondycles",
    images: {
      url: "/summary.png",
      alt: "incognitalk.",
    },
  },
  openGraph: {
    title: "incognitalk.",
    description: "Reaveling the words anonimously.",
    type: "website",
    siteName: "incognitalk.",
    url: "https://incogni-talk.vercel.app/",
    images: [
      {
        url: "/summary.png",
        width: 800,
        height: 800,
      },
      {
        url: "/summary.png",
        width: 1920,
        height: 1080,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased font-outfit text-sm sm:text-base`}
      >
        <QueryProvider>
          <ThemeProvider
            disableTransitionOnChange={true}
            attribute="class"
            defaultTheme="light"
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
