const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars. Make sure you run this with env vars loaded (e.g. node --env-file=.env.local)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('--- Checking Operators ---');
    const { data: ops, error: opsError } = await supabase.from('operators').select('*');
    if (opsError) {
        console.error('Error fetching operators:', opsError);
    } else {
        console.log(`Found ${ops.length} operators:`, ops.map(o => ({ id: o.id, name: o.name })));
    }

    console.log('\n--- Checking Plans (with join) ---');
    const { data: plans, error: plansError } = await supabase
        .from('plans')
        .select('id, title, operator_id, operators(name)')
        .limit(5);

    if (plansError) {
        console.error('Error fetching plans:', plansError);
    } else {
        console.log('Plans sample:', JSON.stringify(plans, null, 2));
    }
}

check();
