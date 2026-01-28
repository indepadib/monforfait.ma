import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { CompareBar } from '@/components/CompareBar';
import { CookieConsent } from '@/components/CookieConsent';
import { Footer } from '@/components/Footer';

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://monforfait.ma'),
  title: {
    default: "MonForfait.ma - Comparez Internet & Mobile au Maroc",
    template: "%s | MonForfait.ma"
  },
  description: "Comparateur N°1 au Maroc. Trouvez le meilleur forfait Internet (Fibre, ADSL) et Mobile (4G, 5G) chez Orange, Inwi et Maroc Telecom (IAM).",
  keywords: ["forfait maroc", "internet fibre maroc", "iam", "inwi", "orange maroc", "comparateur telecom", "recharge", "facture"],
  authors: [{ name: "MonForfait.ma Team" }],
  creator: "MonForfait.ma",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "MonForfait.ma - Comparateur Telecom Maroc",
    description: "Économisez sur votre forfait internet et mobile. Comparez en 2 clics.",
    url: "https://monforfait.ma",
    siteName: "MonForfait.ma",
    locale: "fr_MA",
    type: "website",
    images: [
      {
        url: "/branding/logo-light.png",
        width: 1200,
        height: 630,
        alt: "MonForfait.ma Comparison"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MonForfait.ma",
    description: "Le comparateur telecom du Maroc",
    images: ["/branding/logo-light.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'MonForfait.ma',
              description: 'Comparateur de forfaits internet et mobile au Maroc - Orange, Inwi, Maroc Telecom',
              url: 'https://monforfait.ma',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://monforfait.ma/offers?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="antialiased">
        {children}
        <Footer />
        <CookieConsent />
        <CompareBar />
      </body>
    </html>
  );
}
