import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { env } from '../../config/env.js';
import { HttpError } from '../../middlewares/error.middleware.js';

// Cache JWKS client để tránh fetch lại mỗi request (jwks-rsa đã cache key in-memory).
const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${env.azureTenantId}/discovery/v2.0/keys`,
  cache: true,
  cacheMaxAge: 24 * 60 * 60 * 1000, // 24h
  rateLimit: true,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  if (!header.kid) {
    callback(new Error('Missing kid in token header'));
    return;
  }
  client.getSigningKey(header.kid, (err, key) => {
    if (err || !key) {
      callback(err ?? new Error('Signing key not found'));
      return;
    }
    callback(null, key.getPublicKey());
  });
}

export interface MicrosoftClaims {
  oid: string;
  email: string;
  name: string;
}

// Verify ID token do Microsoft cấp. Trả về claims đã chuẩn hoá hoặc throw 401.
export function verifyMicrosoftIdToken(idToken: string): Promise<MicrosoftClaims> {
  if (!env.azureTenantId || !env.azureClientId) {
    return Promise.reject(
      new HttpError(500, 'Azure AD chưa được cấu hình (AZURE_TENANT_ID / AZURE_CLIENT_ID).'),
    );
  }
  return new Promise((resolve, reject) => {
    jwt.verify(
      idToken,
      getKey,
      {
        audience: env.azureClientId,
        issuer: `https://login.microsoftonline.com/${env.azureTenantId}/v2.0`,
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err || !decoded || typeof decoded === 'string') {
          reject(new HttpError(401, 'Microsoft ID token không hợp lệ'));
          return;
        }
        const payload = decoded as jwt.JwtPayload & {
          oid?: string;
          email?: string;
          preferred_username?: string;
          upn?: string;
          name?: string;
        };
        const email = (payload.email ?? payload.preferred_username ?? payload.upn ?? '').toLowerCase();
        if (!payload.oid || !email) {
          reject(new HttpError(401, 'Token thiếu claim oid hoặc email'));
          return;
        }
        resolve({
          oid: payload.oid,
          email,
          name: payload.name ?? email.split('@')[0],
        });
      },
    );
  });
}
