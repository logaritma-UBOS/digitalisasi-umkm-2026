import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sharing UMKM: Dari Manual ke Digital",
  description: "Form pendaftaran eksklusif acara Sharing UMKM: Solusi Anti Ribet Catat Keuangan & Tarik Pembeli.",
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
