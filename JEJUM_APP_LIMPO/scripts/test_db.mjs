import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ussvkthtsayznnfslplw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzc3ZrdGh0c2F5em5uZnNscGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDY0NDIsImV4cCI6MjA4ODgyMjQ0Mn0.YEJN4q-vo45Lqz5Ms6hlGPo3ELKAYKqQLfTNZA8pFuM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("1. Apagando foto do Rodrigo...");
  const delRes = await supabase.from('community_posts').delete().or('author.ilike.%rodrigo%,author_name.ilike.%rodrigo%');
  console.log("Delete Post:", delRes);

  console.log("2. Verificando as colunas de community_posts...");
  const postRes = await supabase.from('community_posts').select('*').limit(1);
  console.log("Columns Posts:", postRes.data ? Object.keys(postRes.data[0]) : postRes);

  console.log("3. Inserindo no challenge_logs...");
  // test insert with invalid user id? No, anon key cannot insert a random string if it enforces uuid foreign key!
  // Oh, `user_id` inside challenge_logs might be a UUID foreign key to auth.users!
  // I will just fetch logs:
  const logRes = await supabase.from('challenge_logs').select('*');
  console.log("Fetch Logs Error:", logRes.error);
  if (logRes.data) {
     console.log("Total Logs na tabela:", logRes.data.length);
  }
}

run();
