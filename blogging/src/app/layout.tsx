import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "../../lib/fontawesome";

export const metadata: Metadata = {
  title: "PotatoTrails - Travel Blogs",
  description:
    "Discover inspiring travel blogs, tips, and guides from around the globe. From hidden gems to popular destinations, find your next adventure with our curated travel stories.",
  icons: {
    icon: '/favicon.png',
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
        <meta name="google-adsense-account" content="ca-pub-7004317414119715"></meta>
      </head>
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7004317414119715"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}