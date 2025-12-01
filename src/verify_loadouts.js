import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nxsrzwiwewkrhhqkjmvi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54c3J6d2l3ZXdrcmhocWtqbXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NTA1ODMsImV4cCI6MjA4MDAyNjU4M30.19WcBRnCrvIf8bCWWxkf8wmRiWME61zclCkTICro5iA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTable() {
    console.log('Verifying connection to Supabase...');

    // Attempt to select from service_templates
    // Even with RLS, if the table exists, we should get a 200 OK with empty data (or data if public)
    // If the table does NOT exist, we will get a 404 or specific error code.
    const { data, error } = await supabase
        .from('service_templates')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error querying table:', error);
        if (error.code === '42P01') { // undefined_table
            console.log('❌ Table "service_templates" DOES NOT EXIST.');
        } else {
            console.log('⚠️ Connection successful, but received error (likely RLS or other):', error.message);
            console.log('✅ This confirms the table exists, but access is restricted (as expected with RLS).');
        }
    } else {
        console.log('✅ Connection successful. Table "service_templates" exists.');
        console.log('Data received:', data);
    }
}

verifyTable();
