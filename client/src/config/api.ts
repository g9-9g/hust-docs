// Base URL mặc định lấy từ env (build-time), có thể override động qua localStorage.
const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const STORAGE_KEY = 'API_BASE_URL';

export function getApiBaseUrl(): string {
  const savedUrl = localStorage.getItem(STORAGE_KEY);
  return savedUrl || DEFAULT_API_BASE_URL;
}

export function setApiBaseUrl(url: string): void {
  localStorage.setItem(STORAGE_KEY, url);
}

export function clearApiBaseUrl(): void {
  localStorage.removeItem(STORAGE_KEY);
}
