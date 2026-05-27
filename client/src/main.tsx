import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MsalProvider } from '@azure/msal-react';
import App from './App';
import { msalInstance } from './lib/msal';
import { loginWithMicrosoft as apiLoginWithMicrosoft } from './api/auth';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// MSAL v3+ yêu cầu initialize() trước khi gọi bất kỳ API nào.
// Sau khi init, handleRedirectPromise() sẽ resolve với AuthenticationResult nếu page
// vừa được Microsoft redirect ngược về (sau loginRedirect); null nếu là lần load thường.
async function bootstrapMsal() {
  await msalInstance.initialize();
  try {
    const result = await msalInstance.handleRedirectPromise();
    if (result?.idToken) {
      msalInstance.setActiveAccount(result.account);
      const res = await apiLoginWithMicrosoft(result.idToken);
      localStorage.setItem('accessToken', res.accessToken);
    }
  } catch (err) {
    console.error('[MSAL] handleRedirectPromise failed:', err);
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MsalProvider>
    </React.StrictMode>
  );
}

bootstrapMsal();
