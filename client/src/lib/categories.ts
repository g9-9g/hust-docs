import type { DocumentCategory } from '@/types';

export const CATEGORY_LABEL: Record<DocumentCategory, string> = {
  LECTURE_SLIDE: 'Slide bài giảng',
  PAST_EXAM: 'Đề thi cũ',
  SOLUTION: 'Lời giải',
  NOTE: 'Note cá nhân',
  PROJECT_SAMPLE: 'Bài tập lớn / Project',
  REFERENCE: 'Tài liệu tham khảo',
  LAB_REPORT: 'Lab / Report',
  OTHER: 'Khác',
};

export const CATEGORY_OPTIONS: { value: DocumentCategory; label: string }[] = (
  Object.keys(CATEGORY_LABEL) as DocumentCategory[]
).map((value) => ({ value, label: CATEGORY_LABEL[value] }));
