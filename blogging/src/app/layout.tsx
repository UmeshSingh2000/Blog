import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import { Exo } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "../../lib/fontawesome";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
const exo = Exo({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PotatoTrails - Travel Blogs",
  description:
    "Discover inspiring travel blogs, tips, and guides from around the globe. From hidden gems to popular destinations, find your next adventure with our curated travel stories.",
  icons: {
    icon: '/PT.png',
  },
  keywords: ["travel", "blogs", "adventure", "tourism", "destinations"],
  authors: [{ name: "Lalit Singh" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Update the AdSense meta tag with the new client ID if needed */}
        <meta name="google-adsense-account" content="ca-pub-3694311444107571" />
      </head>
      <body className={`${exo.className}`}>

        <Navbar />
        <div id="page-wrapper" className="transition-all duration-500">
          {children}
          <Footer />
        </div>

        <Analytics />

        {/* Google Analytics Script */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RHQB1PGJLF"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RHQB1PGJLF');
          `}
        </Script>

        {/* Updated Google AdSense script with new client ID */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3694311444107571"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
