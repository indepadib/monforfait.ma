import type { Metadata } from "next";
import "./globals.css";
import { CompareBar } from '@/components/CompareBar';

export const metadata: Metadata = {
  title: "MonForfait.ma - Comparez les Meilleurs Forfaits au Maroc | Internet, Mobile, Fibre",
  description: "Trouvez le forfait internet et mobile idéal au Maroc. Comparez Orange, Inwi et Maroc Telecom. Quiz personnalisé, speed test gratuit. 100% gratuit et sans engagement.",
  keywords: "forfait maroc, internet maroc, mobile maroc, fibre optique maroc, adsl maroc, orange maroc, inwi, maroc telecom, comparateur forfait",
  authors: [{ name: "MonForfait.ma" }],
  openGraph: {
    title: "MonForfait.ma - Trouvez Votre Forfait Idéal au Maroc",
    description: "Comparez tous les forfaits internet et mobile du Maroc en 60 secondes. Gratuit et sans engagement.",
    url: "https://monforfait.ma",
    siteName: "MonForfait.ma",
    locale: "fr_MA",
    type: "website",
    images: [
      {
        url: "/branding/logo-light.png",
        width: 1200,
        height: 630,
        alt: "MonForfait.ma - Comparateur de Forfaits"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MonForfait.ma - Comparateur de Forfaits au Maroc",
    description: "Trouvez le forfait parfait parmi Orange, Inwi et Maroc Telecom",
    images: ["/branding/logo-light.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" }
    ]
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
        <link rel="canonical" href="https://monforfait.ma" />
        <meta name="theme-color" content="#3B82F6" />

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
      </head>
      <body className="antialiased">
        {children}
        {/* <CompareBar /> - Temporarily disabled for launch */}
      </body>
    </html>
  );
}
