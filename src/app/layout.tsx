import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mediterranea Marine",
  description: "Managing yatch with perspective of success since 2010",
};

export default function RootLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html>
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
