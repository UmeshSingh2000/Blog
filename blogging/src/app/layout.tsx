import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Exo } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "../../lib/fontawesome";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";

const exo = Exo({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
});

export const metadata: Metadata = {
  title: "PotatoTrails - Travel Blogs",
  description:
    "Discover inspiring travel blogs, tips, and guides from around the globe.",
  icons: {
    icon: "/PT.png",
  },
  keywords: ["travel", "blogs", "adventure", "tourism", "destinations"],
  authors: [{ name: "Lalit Singh" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#FFE52A" />
        <meta
          name="google-adsense-account"
          content="ca-pub-7004317414119715"
        />
        <meta
          name="google-site-verification"
          content="9EMwGM8wTa_vxLYM8SgKziJtsT4UOxYqK-Whr6-PcLg"
        />

        {/* Theme Script (no flicker) */}
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            const theme = localStorage.getItem('theme') || 'light';
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            }
          `}
        </Script>
      </head>

      <body className={exo.className}>
        <ThemeProvider>
          <Navbar />

          <div id="page-wrapper" className="transition-all duration-500">
            {children}
          </div>

          <Footer />
        </ThemeProvider>

        <Analytics />

        {/* ✅ AdSense Script (ONLY ONCE) */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7004317414119715"
          crossOrigin="anonymous"
        />

        {/* ✅ Example Ad (place this where needed, not always here) */}
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-7004317414119715"
          data-ad-slot="5617489494"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        <Script id="ads-init" strategy="afterInteractive">
          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>

        {/* ✅ Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8ZBZ9NPC80"
          strategy="afterInteractive"
        />
        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8ZBZ9NPC80');
          `}
        </Script>
      </body>
    </html>
  );
}