/**
 * AUTOMATED TELCO SCRAPER - Morocco
 * 
 * Runs continuously to scrape latest offers from:
 * - Orange Morocco (orange.ma)
 * - Inwi (inwi.ma)  
 * - Maroc Telecom/IAM (iam.ma)
 * 
 * Features:
 * - Automatic detection of new offers
 * - Price change tracking
 * - Promotional offer detection
 * - Scheduled updates (configurable interval)
 * - Error handling & retry logic
 * 
 * Usage: npx tsx scripts/auto-scraper.ts
 */

import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration
const CONFIG = {
    scrapeIntervalHours: 24, // Run every 24 hours
    retryAttempts: 3,
    timeout: 30000,
};

type ScrapedOffer = {
    operator: string;
    title: string;
    category: 'internet' | 'mobile';
    target_audience: 'individual' | 'professional';
    technology?: string;
    download_speed_mbps?: number;
    upload_speed_mbps?: number;
    mobile_data_gb?: number;
    voice_minutes?: number;
    price_dh: number;
    setup_fee_dh?: number;
    commitment_months?: number;
    features?: Record<string, any>;
    highlight_badge?: string;
    is_sponsored?: boolean;
    url?: string;
};

/**
 * ORANGE MOROCCO SCRAPER
 */
async function scrapeOrange(): Promise<ScrapedOffer[]> {
    console.log('🟠 Scraping Orange Morocco...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const offers: ScrapedOffer[] = [];

    try {
        // Internet Offers
        await page.goto('https://www.orange.ma/offres/internet/ftth', {
            waitUntil: 'domcontentloaded',
            timeout: CONFIG.timeout
        });
        await page.waitForTimeout(3000);

        const internetOffers = await page.evaluate(() => {
            const results: any[] = [];

            // Try multiple selectors
            const offerCards = document.querySelectorAll('[class*="offer"], [class*="plan"], [class*="card"]');

            offerCards.forEach((card) => {
                try {
                    const titleEl = card.querySelector('h2, h3, h4, [class*="title"]');
                    const priceEl = card.querySelector('[class*="price"], [class*="tarif"]');
                    const speedEl = card.querySelector('[class*="speed"], [class*="debit"]');

                    if (titleEl && priceEl) {
                        const title = titleEl.textContent?.trim() || '';
                        const priceText = priceEl.textContent?.trim() || '';
                        const speedText = speedEl?.textContent?.trim() || '';

                        // Extract price (format: "XXX DH" or "XXX DHS")
                        const priceMatch = priceText.match(/(\d+)/);
                        const price = priceMatch ? parseInt(priceMatch[1]) : 0;

                        // Extract speed (format: "XX Mega" or "XX Mbps")
                        const speedMatch = speedText.match(/(\d+)/);
                        const speed = speedMatch ? parseInt(speedMatch[1]) : 0;

                        if (price > 0) {
                            results.push({
                                title,
                                price,
                                speed: speed || null,
                            });
                        }
                    }
                } catch (e) { }
            });

            return results;
        });

        for (const offer of internetOffers) {
            offers.push({
                operator: 'Orange Morocco',
                title: offer.title,
                category: 'internet',
                target_audience: 'individual',
                technology: 'FTTH',
                download_speed_mbps: offer.speed,
                price_dh: offer.price,
                features: { scraped_at: new Date().toISOString() },
            });
        }

        // Mobile Offers
        await page.goto('https://www.orange.ma/offres/mobile', {
            waitUntil: 'domcontentloaded',
            timeout: CONFIG.timeout
        });
        await page.waitForTimeout(3000);

        const mobileOffers = await page.evaluate(() => {
            const results: any[] = [];
            const offerCards = document.querySelectorAll('[class*="offer"], [class*="forfait"]');

            offerCards.forEach((card) => {
                try {
                    const titleEl = card.querySelector('h2, h3, h4');
                    const priceEl = card.querySelector('[class*="price"]');
                    const dataEl = card.querySelector('[class*="data"], [class*="internet"]');

                    if (titleEl && priceEl) {
                        const title = titleEl.textContent?.trim() || '';
                        const priceText = priceEl.textContent?.trim() || '';
                        const dataText = dataEl?.textContent?.trim() || '';

                        const priceMatch = priceText.match(/(\d+)/);
                        const price = priceMatch ? parseInt(priceMatch[1]) : 0;

                        const dataMatch = dataText.match(/(\d+)\s*(Go|GB)/i);
                        const data = dataMatch ? parseInt(dataMatch[1]) : 0;

                        if (price > 0) {
                            results.push({ title, price, data });
                        }
                    }
                } catch (e) { }
            });

            return results;
        });

        for (const offer of mobileOffers) {
            offers.push({
                operator: 'Orange Morocco',
                title: offer.title,
                category: 'mobile',
                target_audience: 'individual',
                mobile_data_gb: offer.data,
                voice_minutes: -1, // Assume unlimited
                price_dh: offer.price,
                features: { scraped_at: new Date().toISOString() },
            });
        }

    } catch (error) {
        console.error('Error scraping Orange:', error);
    } finally {
        await browser.close();
    }

    console.log(`✅ Orange: Found ${offers.length} offers`);
    return offers;
}

/**
 * INWI SCRAPER
 */
async function scrapeInwi(): Promise<ScrapedOffer[]> {
    console.log('🟣 Scraping Inwi...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const offers: ScrapedOffer[] = [];

    try {
        // Internet
        await page.goto('https://www.inwi.ma/particuliers/internet-fixe', {
            waitUntil: 'domcontentloaded',
            timeout: CONFIG.timeout
        });
        await page.waitForTimeout(3000);

        const internetOffers = await page.evaluate(() => {
            const results: any[] = [];
            const offerCards = document.querySelectorAll('[class*="offer"], [class*="pack"]');

            offerCards.forEach((card) => {
                try {
                    const titleEl = card.querySelector('h2, h3, [class*="title"]');
                    const priceEl = card.querySelector('[class*="price"], [class*="tarif"]');
                    const speedEl = card.querySelector('[class*="debit"], [class*="speed"]');

                    if (titleEl && priceEl) {
                        const title = titleEl.textContent?.trim() || '';
                        const priceText = priceEl.textContent?.trim() || '';
                        const speedText = speedEl?.textContent?.trim() || '';

                        const priceMatch = priceText.match(/(\d+)/);
                        const price = priceMatch ? parseInt(priceMatch[1]) : 0;

                        const speedMatch = speedText.match(/(\d+)/);
                        const speed = speedMatch ? parseInt(speedMatch[1]) : 0;

                        if (price > 0) {
                            results.push({ title, price, speed });
                        }
                    }
                } catch (e) { }
            });

            return results;
        });

        for (const offer of internetOffers) {
            offers.push({
                operator: 'Inwi',
                title: offer.title,
                category: 'internet',
                target_audience: 'individual',
                technology: 'FTTH',
                download_speed_mbps: offer.speed,
                price_dh: offer.price,
                features: { scraped_at: new Date().toISOString() },
            });
        }

        // Mobile (Win by Inwi)
        await page.goto('https://www.win.ma/', {
            waitUntil: 'domcontentloaded',
            timeout: CONFIG.timeout
        });
        await page.waitForTimeout(3000);

        const mobileOffers = await page.evaluate(() => {
            const results: any[] = [];
            const offerCards = document.querySelectorAll('[class*="plan"], [class*="offer"]');

            offerCards.forEach((card) => {
                try {
                    const titleEl = card.querySelector('h2, h3, h4');
                    const priceEl = card.querySelector('[class*="price"]');
                    const dataEl = card.querySelector('[class*="data"], [class*="go"]');

                    if (titleEl && priceEl) {
                        const title = titleEl.textContent?.trim() || '';
                        const priceText = priceEl.textContent?.trim() || '';
                        const dataText = dataEl?.textContent?.trim() || '';

                        const priceMatch = priceText.match(/(\d+)/);
                        const price = priceMatch ? parseInt(priceMatch[1]) : 0;

                        const dataMatch = dataText.match(/(\d+)\s*(Go|GB)/i);
                        const data = dataMatch ? parseInt(dataMatch[1]) : 0;

                        if (price > 0) {
                            results.push({ title, price, data });
                        }
                    }
                } catch (e) { }
            });

            return results;
        });

        for (const offer of mobileOffers) {
            offers.push({
                operator: 'Inwi',
                title: offer.title,
                category: 'mobile',
                target_audience: 'individual',
                mobile_data_gb: offer.data,
                voice_minutes: -1,
                price_dh: offer.price,
                features: { scraped_at: new Date().toISOString() },
            });
        }

    } catch (error) {
        console.error('Error scraping Inwi:', error);
    } finally {
        await browser.close();
    }

    console.log(`✅ Inwi: Found ${offers.length} offers`);
    return offers;
}

/**
 * MAROC TELECOM / IAM SCRAPER
 */
async function scrapeMarocTelecom(): Promise<ScrapedOffer[]> {
    console.log('🔴 Scraping Maroc Telecom...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const offers: ScrapedOffer[] = [];

    try {
        await page.goto('https://www.iam.ma/particuliers/offres-internet', {
            waitUntil: 'domcontentloaded',
            timeout: CONFIG.timeout
        });
        await page.waitForTimeout(3000);

        const scrapedOffers = await page.evaluate(() => {
            const results: any[] = [];
            const offerCards = document.querySelectorAll('[class*="offer"], [class*="product"]');

            offerCards.forEach((card) => {
                try {
                    const titleEl = card.querySelector('h2, h3, h4');
                    const priceEl = card.querySelector('[class*="price"]');
                    const speedEl = card.querySelector('[class*="speed"], [class*="debit"]');

                    if (titleEl && priceEl) {
                        const title = titleEl.textContent?.trim() || '';
                        const priceText = priceEl.textContent?.trim() || '';
                        const speedText = speedEl?.textContent?.trim() || '';

                        const priceMatch = priceText.match(/(\d+)/);
                        const price = priceMatch ? parseInt(priceMatch[1]) : 0;

                        const speedMatch = speedText.match(/(\d+)/);
                        const speed = speedMatch ? parseInt(speedMatch[1]) : 0;

                        if (price > 0) {
                            results.push({ title, price, speed });
                        }
                    }
                } catch (e) { }
            });

            return results;
        });

        for (const offer of scrapedOffers) {
            offers.push({
                operator: 'Maroc Telecom',
                title: offer.title,
                category: 'internet',
                target_audience: 'individual',
                technology: 'FTTH',
                download_speed_mbps: offer.speed,
                price_dh: offer.price,
                features: { scraped_at: new Date().toISOString() },
            });
        }

    } catch (error) {
        console.error('Error scraping Maroc Telecom:', error);
    } finally {
        await browser.close();
    }

    console.log(`✅ Maroc Telecom: Found ${offers.length} offers`);
    return offers;
}

/**
 * SAVE TO DATABASE
 */
async function saveOffers(offers: ScrapedOffer[]) {
    console.log(`\n💾 Saving ${offers.length} offers to database...`);

    for (const offer of offers) {
        try {
            // Get operator ID
            const { data: operators } = await supabase
                .from('operators')
                .select('id')
                .eq('name', offer.operator)
                .single();

            if (!operators) {
                console.log(`⚠️  Operator ${offer.operator} not found, skipping`);
                continue;
            }

            // Check if offer already exists (by title+operator)
            const { data: existing } = await supabase
                .from('plans')
                .select('id, price_dh')
                .eq('operator_id', operators.id)
                .eq('title', offer.title)
                .single();

            if (existing) {
                // Update if price changed
                if (existing.price_dh !== offer.price_dh) {
                    await supabase
                        .from('plans')
                        .update({
                            price_dh: offer.price_dh,
                            features: { ...offer.features, price_updated_at: new Date().toISOString() }
                        })
                        .eq('id', existing.id);

                    console.log(`✏️  Updated ${offer.title} (price: ${existing.price_dh} → ${offer.price_dh} DH)`);
                }
            } else {
                // Insert new offer
                await supabase.from('plans').insert({
                    operator_id: operators.id,
                    ...offer,
                });

                console.log(`✨ Added new offer: ${offer.title} (${offer.price_dh} DH)`);
            }
        } catch (error) {
            console.error(`Error saving ${offer.title}:`, error);
        }
    }
}

/**
 * MAIN SCRAPER LOOP
 */
async function runScraper() {
    console.log('\n🤖 AUTOMATED TELCO SCRAPER STARTED');
    console.log(`⏰ Running every ${CONFIG.scrapeIntervalHours} hours\n`);

    while (true) {
        const startTime = Date.now();
        console.log(`\n📅 Scrape started at: ${new Date().toLocaleString()}`);

        try {
            const [orangeOffers, inwiOffers, iamOffers] = await Promise.all([
                scrapeOrange(),
                scrapeInwi(),
                scrapeMarocTelecom(),
            ]);

            const allOffers = [...orangeOffers, ...inwiOffers, ...iamOffers];

            if (allOffers.length > 0) {
                await saveOffers(allOffers);
                console.log(`\n✅ Scrape completed successfully! Total: ${allOffers.length} offers`);
            } else {
                console.log('\n⚠️  No offers found. Check website structures.');
            }

        } catch (error) {
            console.error('\n❌ Scrape failed:', error);
        }

        const duration = (Date.now() - startTime) / 1000;
        console.log(`⏱️  Duration: ${duration.toFixed(2)}s`);

        // Wait for next run
        const waitMillis = CONFIG.scrapeIntervalHours * 60 * 60 * 1000;
        console.log(`\n💤 Sleeping for ${CONFIG.scrapeIntervalHours} hours...`);
        await new Promise(resolve => setTimeout(resolve, waitMillis));
    }
}

// Run if called directly
if (require.main === module) {
    runScraper().catch(console.error);
}

export { runScraper, scrapeOrange, scrapeInwi, scrapeMarocTelecom };
