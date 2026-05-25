import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aditya Takharya | Application Engineer & Systems Architect",
  description:
    "Full Stack Application Engineer & Systems Architect. Explore projects, skills, and distributed systems expertise.",
  icons: {
    icon: "/assets/images/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Plus+Jakarta+Sans:wght@400;600;800&family=Outfit:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/assets/css/style.css" />
        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:title" content="Aditya Takharya | Application Engineer & Systems Architect" />
        <meta property="og:description" content="Full Stack Application Engineer & Systems Architect. Explore projects, skills, and distributed systems expertise." />
        <meta property="og:image" content="https://raw.githubusercontent.com/adityatakharya/Personal-Portfolio/main/public/assets/images/meta-thumbnail.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://adityatakharya.com" />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aditya Takharya | Application Engineer & Systems Architect" />
        <meta name="twitter:description" content="Full Stack Application Engineer & Systems Architect. Explore projects, skills, and distributed systems expertise." />
        <meta name="twitter:image" content="https://raw.githubusercontent.com/adityatakharya/Personal-Portfolio/main/public/assets/images/meta-thumbnail.png" />
      </head>
      <body className={`${inter.className} is-loading`}>
        {children}
        <Analytics />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" strategy="beforeInteractive" />
        <Script src="https://unpkg.com/@studio-freight/lenis@1.0.34/dist/lenis.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
