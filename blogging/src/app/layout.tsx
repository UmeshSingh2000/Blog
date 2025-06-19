import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "../../lib/fontawesome";

export const metadata: Metadata = {
  title: "PotatoTrails - Travel Blogs",
  description:
    "Discover inspiring travel blogs, tips, and guides from around the globe. From hidden gems to popular destinations, find your next adventure with our curated travel stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

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
      </body>
    </html>
  );
}
