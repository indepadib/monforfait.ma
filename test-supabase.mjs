import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gpoylrecftylldgslkdh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwb3lscmVjZnR5bGxkZ3Nsa2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzEwNzksImV4cCI6MjA4NTEwNzA3OX0.AcMla0hXab5qV8XovA2RaRN6cqlyMhP8n_-5vkXtJVs'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
    const payload = {
        user_name: 'Test Name',
        user_email: 'test@example.com',
        user_phone: '0600000000',
        city: 'Casablanca',
        status: 'new_qualified',
        is_pro: false,
        needs_details: {
            address: 'Test Address',
            quiz_answers: {},
            captured_at: new Date().toISOString(),
            lead_source: 'quiz_pre_results'
        }
    };
    
    console.log("Attempting insert...");
    const { data, error } = await supabase.from('leads').insert(payload).select()
    
    if (error) {
        console.error("EXACT ERROR:", JSON.stringify(error, null, 2));
    } else {
        console.log("Success:", data);
    }
}

testInsert();
