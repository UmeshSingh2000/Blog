import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import { Exo } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "../../lib/fontawesome";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
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
        <meta name="theme-color" content="#FFE52A" />
        <meta name="google-adsense-account" content="ca-pub-7004317414119715" />
        <meta name="google-site-verification" content="9EMwGM8wTa_vxLYM8SgKziJtsT4UOxYqK-Whr6-PcLg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          const theme = localStorage.getItem('theme') || 'light';
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        `
          }}
        />
      </head>
      <body className={`${exo.className}`}>
        <ThemeProvider>

          <Navbar />
          <div id="page-wrapper" className="transition-all duration-500">
            {children}

          </div>
        </ThemeProvider>


        <Analytics />

        {/* Google Analytics Script */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8ZBZ9NPC80"></script>
        <script>
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-8ZBZ9NPC80');`}
        </script>
        {/* Updated Google AdSense script with new client ID */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7004317414119715"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
