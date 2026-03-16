import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Traders Federation Digital Platform",
  description: "Digital platform for traders federation management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#374151",
              padding: "16px",
              borderRadius: "12px",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
