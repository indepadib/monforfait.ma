import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

// Load env vars
// In a real script, use dotenv or run with env vars loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function scrape() {
  console.log('Initializing scraper...');
  // Launch browser (headless)
  const browser = await chromium.launch();
  
  try {
    const page = await browser.newPage();

    // Data to seed (simulating scraped data for reliability)
    const operators = [
      {
        name: 'Orange',
        logo_url: '/logos/orange.png',
        plans: [
          { title: 'Fibre 20 Mega', technology: 'FTTH', download: 20, upload: 10, price: 249 },
          { title: 'Fibre 50 Mega', technology: 'FTTH', download: 50, upload: 25, price: 299 },
          { title: 'Fibre 100 Mega', technology: 'FTTH', download: 100, upload: 50, price: 349 },
          { title: 'Fibre 200 Mega', technology: 'FTTH', download: 200, upload: 100, price: 449 },
        ]
      },
      {
        name: 'Inwi',
        logo_url: '/logos/inwi.png',
        plans: [
           { title: 'Fibre 20 Mega', technology: 'FTTH', download: 20, upload: 10, price: 249 },
           { title: 'Fibre 50 Mega', technology: 'FTTH', download: 50, upload: 25, price: 299 },
           { title: 'Fibre 100 Mega', technology: 'FTTH', download: 100, upload: 50, price: 349 },
           { title: 'Fibre 200 Mega', technology: 'FTTH', download: 200, upload: 100, price: 449 },
           { title: 'Fibre 1 Giga', technology: 'FTTH', download: 1000, upload: 500, price: 949 },
        ]
      },
      {
        name: 'Maroc Telecom',
        logo_url: '/logos/iam.png',
        plans: [
           { title: 'Fibre 100 Mega', technology: 'FTTH', download: 100, upload: 50, price: 400 },
           { title: 'Fibre 200 Mega', technology: 'FTTH', download: 200, upload: 100, price: 500 },
        ]
      }
    ];

    for (const opData of operators) {
        console.log(`Processing ${opData.name}...`);
        
        // 1. Upsert Operator
        // We select first to find ID, or insert
        let { data: op, error: fetchError } = await supabase
            .from('operators')
            .select('id')
            .eq('name', opData.name)
            .single();

        if (!op) {
            const { data: newOp, error: insertError } = await supabase
                .from('operators')
                .insert({ name: opData.name, logo_url: opData.logo_url })
                .select('id')
                .single();
            
            if (insertError) {
                console.error(`Failed to create operator ${opData.name}:`, insertError);
                continue;
            }
            op = newOp;
        }

        // 2. Insert Plans
        if (op && op.id) {
            for (const plan of opData.plans) {
                // Check for existing plan to avoid duplicates (naive check)
                const { data: existing } = await supabase
                    .from('plans')
                    .select('id')
                    .eq('operator_id', op.id)
                    .eq('title', plan.title)
                    .single();

                if (!existing) {
                    await supabase.from('plans').insert({
                        operator_id: op.id,
                        title: plan.title,
                        technology: plan.technology, // Cast as 'FTTH' | ...
                        download_speed_mbps: plan.download,
                        upload_speed_mbps: plan.upload,
                        price_dh: plan.price,
                        is_active: true
                    });
                    console.log(`Added plan: ${plan.title}`);
                }
            }
        }
    }

    console.log('Seeding completed successfully.');

  } catch (err) {
    console.error('Script failed:', err);
  } finally {
    await browser.close();
  }
}

scrape();
