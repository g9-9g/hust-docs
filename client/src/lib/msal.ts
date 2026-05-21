import { PublicClientApplication, type Configuration } from '@azure/msal-browser';

const tenantId = import.meta.env.VITE_AZURE_TENANT_ID ?? '';
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID ?? '';
const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI ?? window.location.origin;

const config: Configuration = {
  auth: {
    clientId,
    // Lock tenant -> chỉ user trong tenant HUST mới qua được màn Microsoft sign-in.
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
};

export const msalInstance = new PublicClientApplication(config);

// Scope tối thiểu để lấy ID token có claim email/oid.
export const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
};
