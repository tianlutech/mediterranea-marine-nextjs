import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mediterranea Marina",
  description: "Gestionando Yates con perspectiva de éxito desde 2010",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={inter.className} suppressHydrationWarning={true}>
        <section className="gradient-form justify-center h-screen w-full text-black">
          <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
            <div className="flex md:flex-row flex-col justify-between w-full lg:flex lg:flex-wrap h-screen">
              {children}
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
