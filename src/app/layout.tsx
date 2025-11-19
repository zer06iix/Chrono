import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/Navigation";
import "./index.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chrono Todo App",
  description: "Task management with MERN stack",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
