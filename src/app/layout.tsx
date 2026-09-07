import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Undangan Digitalisasi UMKM 2026",
  description: "Form pendaftaran eksklusif untuk acara Digitalisasi UMKM 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.className} text-gray-800 antialiased bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}
