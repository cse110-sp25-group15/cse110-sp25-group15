import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  'https://natqpieuqtsggabuudrw.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHFwaWV1cXRzZ2dhYnV1ZHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwOTkwODgsImV4cCI6MjA2MjY3NTA4OH0.lydSkDtjN0PITWWpU-LUPAmxp9ZrgK1cDDWkTIcpSMA',
);

export default supabase;