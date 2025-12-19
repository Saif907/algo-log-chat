// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// 1. Import the provider
import { HelmetProvider } from 'react-helmet-async';
// ✅ 2. Import PostHog
import posthog from 'posthog-js';

// ✅ 3. Initialize PostHog (Before rendering)
// This safely checks if the key exists so it doesn't crash in dev if missing
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;

if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only', // Saves money on the free tier
    // disable_session_recording: true, // Uncomment this line if you want to turn off video recording
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 4. Wrap your App component */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);