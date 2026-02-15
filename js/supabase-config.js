// ===== Supabase 클라이언트 초기화 =====
var SUPABASE_URL = 'https://kuzcfqbzkojcsmwhkybp.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1emNmcWJ6a29qY3Ntd2hreWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNDk0NjksImV4cCI6MjA4NjYyNTQ2OX0.uLndibmXbDfKuMrBmekG5TDpL7kFvdX7AoI8GTKUxGI';

var _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
