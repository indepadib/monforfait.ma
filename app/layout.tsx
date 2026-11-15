import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CompareBar } from '@/components/CompareBar';
import { CookieConsent } from '@/components/CookieConsent';
import { ConsentControlledScripts } from '@/components/ConsentControlledScripts';
import { Footer } from '@/components/Footer';
import { StickyMobileFooter } from '@/components/StickyMobileFooter';
import { AgentChatbot } from '@/components/AgentChatbot';

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
  description: "Comparateur indépendant au Maroc. Comparez les offres Internet (Fibre, ADSL) et Mobile (4G, 5G) chez Orange, Inwi et Maroc Telecom (IAM).",
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
    icon: [
      { url: '/branding/forfait.png', type: 'image/png' },
    ],
    apple: '/branding/forfait.png',
    shortcut: '/branding/forfait.png',
  }
};

import { LocaleProvider } from '@/lib/LocaleContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/branding/forfait.png" />
        <link rel="shortcut icon" type="image/png" href="/branding/forfait.png" />
        <link rel="apple-touch-icon" href="/branding/forfait.png" />
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
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://monforfait.ma/offers?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <LocaleProvider>
          {children}
          <AgentChatbot />
          <Footer />
          <CookieConsent />
          <ConsentControlledScripts />
          <CompareBar />
          <StickyMobileFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
