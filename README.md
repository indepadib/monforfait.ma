# MonForfait.ma 🇲🇦

Comparateur de forfaits internet et mobile au Maroc - Trouvez le meilleur forfait parmi Orange, Inwi et Maroc Telecom en quelques clics.

![MonForfait.ma](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss)

## ✨ Features

- 🔍 **Quiz personnalisé** - 5 étapes pour trouver le forfait idéal
- 📊 **50+ offres réelles** - Orange, Inwi, Maroc Telecom
- ⚡ **Speed test intégré** - Testez votre connexion actuelle
- 🔄 **Comparateur** - Comparez jusqu'à 3 offres côte à côte
- 🤖 **Scraping automatique** - Prix mis à jour quotidiennement
- 📱 **Responsive** - Mobile-first design
- 🌙 **Dark mode** - Support automatique
- 🎯 **Lead capture** - 3 points de conversion optimisés
- 🔒 **Admin dashboard** - Gestion des leads (protégé par mot de passe)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Supabase account

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/morocco-telco-compare.git
cd morocco-telco-compare

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations (in Supabase SQL Editor)
# Execute files in supabase/migrations/ in order

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
morocco-telco-compare/
├── app/                    # Next.js 16 app directory
│   ├── admin/             # Protected admin dashboard
│   ├── compare/           # Side-by-side comparison
│   ├── offers/            # All offers browsing
│   ├── quiz/              # Personalized quiz
│   ├── results/           # Quiz results
│   └── speedtest/         # Speed test tool
├── components/            # Reusable components
│   ├── CompareBar.tsx    # Sticky comparison bar
│   ├── Navigation.tsx    # Global navigation
│   └── OfferCard.tsx     # Offer display card
├── lib/                   # Utilities
│   └── supabaseClient.ts # Supabase configuration
├── scripts/               # Automation scripts
│   ├── auto-scraper.ts   # Daily scraper
│   └── manual-scrape.ts  # One-time population
├── supabase/             # Database schema
│   └── migrations/       # SQL migrations
└── .github/workflows/    # CI/CD
    └── scraper.yml       # Daily scraping job
```

## 🗄️ Database Schema

**Tables:**
- `operators` - Telecom operators (Orange, Inwi, IAM)
- `plans` - All offers (50+ real offers)
- `leads` - User submissions with qualification

**Key Features:**
- Auto-updated prices via scraper
- Lead scoring (cold/warm/hot)
- B2B/B2C segmentation

## 🤖 Automated Scraping

The platform automatically scrapes operator websites daily at 2 AM:

```bash
# Manual scrape (populate initial data)
npm run scrape

# Runs automatically via GitHub Actions
```

**Scraped data:**
- Orange Morocco: 20 offers
- Inwi: 19 offers  
- Maroc Telecom: 12 offers

## 🔐 Admin Dashboard

Access at `/admin` with password protection.

**Features:**
- View all leads
- Filter by status (qualified/pro/speedtest)
- Export to CSV
- Lead valuation (Pro=150 DH, Hot=40 DH, Cold=10 DH)

**Default password:** `monforfait2026` (change in `app/admin/page.tsx`)

## 💰 Monetization Strategy

1. **Lead Sales** - Sell qualified leads to operators (30-50 DH each)
2. **Sponsored listings** - Top placement for operators (500 DH/month)
3. **Affiliate tracking** - Commission on conversions

**Projected revenue:** ~80K DH/month with 38% conversion

## 🎨 Design Philosophy

Minimaliste monochrome design:
- **Neutral:** Zinc 50-950 (grayscale)
- **Accent:** Blue 600 → Purple 600 (gradient)
- **No colorful emojis** - Clean, professional aesthetic

## 📊 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** TailwindCSS 4
- **Database:** Supabase (PostgreSQL)
- **Scraping:** Playwright
- **Deployment:** Netlify (recommended)
- **CI/CD:** GitHub Actions

## 🌍 Deployment

### Netlify (Recommended)

1. Connect GitHub repo to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
4. Deploy!

### Custom Domain

Point `monforfait.ma` DNS to Netlify:
```
A Record: 75.2.60.5
CNAME: www → your-site.netlify.app
```

## 📈 SEO

- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Schema.org structured data
- ✅ Open Graph tags
- ✅ Meta descriptions

## 🔄 Roadmap

- [ ] Google Analytics 4 integration
- [ ] Email automation (welcome, nurture)
- [ ] Blog for SEO content
- [ ] User accounts (favorites, alerts)
- [ ] Mobile app (React Native)

## 📝 License

Proprietary - All rights reserved

## 🤝 Contributing

This is a private project. Contact the owner for collaboration.

## 📧 Contact

**MonForfait.ma**  
Website: https://monforfait.ma  
Support: support@monforfait.ma

---

Made with ❤️ in Morocco 🇲🇦
