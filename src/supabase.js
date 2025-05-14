import { createClient } from '@supabase/supabase-js';
import './components/product-card/product-card.js';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  'https://natqpieuqtsggabuudrw.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHFwaWV1cXRzZ2dhYnV1ZHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwOTkwODgsImV4cCI6MjA2MjY3NTA4OH0.lydSkDtjN0PITWWpU-LUPAmxp9ZrgK1cDDWkTIcpSMA',
);

// Function to update UI based on auth state
const updateAuthUI = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');
  const userInfo = document.getElementById('user-info');
  const userEmail = document.getElementById('user-email');
  
  if (session) {
    // User is logged in
    loginButton.classList.add('hidden');
    logoutButton.classList.remove('hidden');
    userInfo.classList.remove('hidden');
    userEmail.textContent = session.user.email;
  } else {
    // User is logged out
    loginButton.classList.remove('hidden');
    logoutButton.classList.add('hidden');
    userInfo.classList.add('hidden');
    userEmail.textContent = '';
  }
};

// Add button event listeners after DOM content is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');

  // Set up auth state change listener
  supabase.auth.onAuthStateChange((event, _session) => {
    console.log('Auth state changed:', event);
    updateAuthUI();
  });

  // Initial auth check
  await updateAuthUI();

  loginButton?.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // Redirect back to the same page after login
      },
    });
    if (error) {console.error('Login error:', error.message);}
  });

  logoutButton?.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {console.error('Logout error:', error.message);}
    else {updateAuthUI();} // Update UI immediately after logout
  });
});

export default supabase;