import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "🚀 Rahasia UMKM Laris Manis & Keuangan Rapi Tanpa Pusing!",
  description: "Masih pakai cara manual? Temukan 'cheat code' digitalisasi untuk melipatgandakan omset Anda. Kuota sangat terbatas, amankan kursi Anda sekarang sebelum kehabisan!",
  openGraph: {
    title: "🚀 Rahasia UMKM Laris Manis & Keuangan Rapi Tanpa Pusing!",
    description: "Masih pakai cara manual? Temukan 'cheat code' digitalisasi untuk melipatgandakan omset Anda. Kuota sangat terbatas, amankan kursi Anda sekarang sebelum kehabisan!",
    type: "website",
    locale: "id_ID",
  },
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
