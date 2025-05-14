import { createClient } from '@supabase/supabase-js';
import './components/product-card/product-card.js';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  'https://natqpieuqtsggabuudrw.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHFwaWV1cXRzZ2dhYnV1ZHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwOTkwODgsImV4cCI6MjA2MjY3NTA4OH0.lydSkDtjN0PITWWpU-LUPAmxp9ZrgK1cDDWkTIcpSMA',
);

export default supabase;

// Fix: Make handleSignInWithGoogle available globally for the Google Sign-In callback
window.handleSignInWithGoogle = async function(response) {
  try {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    });
    
    if (error) {
      console.error('Google Sign-In error:', error);
    } else {
      console.log('Successfully signed in with Google:', data);
      // Handle successful sign-in (e.g., refresh UI, redirect)
    }
  } catch (err) {
    console.error('Failed to process Google Sign-In:', err);
  }
};

