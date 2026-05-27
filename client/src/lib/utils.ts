import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

// HUST Microsoft account thường có dạng "Nguyen Le Minh 20225651" (tên + MSSV 8-9 chữ số).
// Strip phần MSSV ở cuối nếu có.
const STUDENT_ID_TAIL = /\s+\d{8,9}\s*$/;

export function cleanFullName(name: string | null | undefined): string {
  if (!name) return '';
  return name.replace(STUDENT_ID_TAIL, '').trim();
}

// Lấy first name (chữ cuối cùng theo quy ước tiếng Việt) để hiển thị gọn trên navbar.
export function shortDisplayName(name: string | null | undefined): string {
  const cleaned = cleanFullName(name);
  if (!cleaned) return '';
  const parts = cleaned.split(/\s+/);
  return parts[parts.length - 1];
}

export function formatRelativeDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'vừa xong';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} phút trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} giờ trước`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} ngày trước`;
  return date.toLocaleDateString('vi-VN');
}
