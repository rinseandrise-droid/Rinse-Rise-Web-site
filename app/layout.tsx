import type { Metadata, Viewport } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { AuthGateModal } from "@/components/auth/AuthGateModal";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Toaster } from "@/components/ui/Toaster";
import { localBusinessJsonLd, JsonLd } from "@/lib/seo";
import { site } from "@/data/site";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Premium Laundry & Dry Cleaning in Electronic City`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Premium Laundry & Dry Cleaning`,
    description: site.description,
    url: "/",
    locale: "en_IN",
    images: [{ url: "/images/logo.png", width: 1024, height: 1024, alt: site.name }],
  },
  twitter: { card: "summary", title: site.name, description: site.description, images: ["/images/logo.png"] },
  icons: { icon: "/favicon.ico", apple: "/images/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#ff6a00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${manrope.variable} ${jakarta.variable}`}>
      <body className="flex min-h-screen min-w-0 flex-col">
        <LoadingScreen />
        <a
          href="#main"
          className="sr-only z-[90] rounded-full bg-orange px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="min-w-0 flex-1">
          {children}
        </main>
        <div id="back-to-top-sentinel" aria-hidden className="pointer-events-none absolute top-[150vh] h-px w-px" />
        <Footer />
        <FloatingActions />
        <AuthGateModal />
        <Toaster />
        <SmoothScroll />
        <JsonLd data={localBusinessJsonLd()} />
      </body>
    </html>
  );
}
