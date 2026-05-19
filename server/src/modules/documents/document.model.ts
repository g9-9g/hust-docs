import { DocumentCategory } from '@prisma/client';

export const DOCUMENT_CATEGORIES = [
  DocumentCategory.LECTURE_SLIDE,
  DocumentCategory.PAST_EXAM,
  DocumentCategory.SOLUTION,
  DocumentCategory.NOTE,
  DocumentCategory.PROJECT_SAMPLE,
  DocumentCategory.REFERENCE,
  DocumentCategory.LAB_REPORT,
  DocumentCategory.OTHER,
] as const;

export type { DocumentCategory };

export const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export function isObjectId(value: string): boolean {
  return OBJECT_ID_REGEX.test(value);
}
