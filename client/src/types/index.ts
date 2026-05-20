export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl: string | null;
  contributionPoints: number;
  isVerified: boolean;
}

export interface Major {
  id: string;
  code: string;
  name: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  majorId: string;
}

export type DocumentCategory =
  | 'LECTURE_SLIDE'
  | 'PAST_EXAM'
  | 'SOLUTION'
  | 'NOTE'
  | 'PROJECT_SAMPLE'
  | 'REFERENCE'
  | 'LAB_REPORT'
  | 'OTHER';

export interface DocumentUploader {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  isVerified: boolean;
}

export interface DocumentSubjectRef {
  id: string;
  name: string;
  code: string;
}

export interface DocumentMajorRef {
  id: string;
  name: string;
  code: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  tags: string[];
  teacherName: string | null;
  semester: string | null;
  academicYear: string | null;
  subjectId: string;
  majorId: string;
  uploaderId: string;
  subject?: DocumentSubjectRef | null;
  major?: DocumentMajorRef | null;
  uploader?: DocumentUploader | null;
  originalName: string;
  mimeType: string;
  size: number;
  extension: string;
  extraPaths?: string[];
  extraOriginalNames?: string[];
  previewPath?: string | null;
  previewMimeType?: string | null;
  viewCount: number;
  downloadCount: number;
  upvoteCount: number;
  downvoteCount: number;
  myVote?: 'UP' | 'DOWN' | null;
  status: 'public' | 'pending' | 'hidden' | 'deleted';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PointReason = 'UPVOTE_RECEIVED' | 'DOWNLOAD_MILESTONE';

export interface PointsTransaction {
  id: string;
  amount: number;
  reason: PointReason;
  documentId: string | null;
  documentTitle: string | null;
  createdAt: string;
}

export interface PointsSummary {
  balance: number;
  transactions: PointsTransaction[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ListResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
