import {
  FileText,
  FileSpreadsheet,
  Presentation,
  FileArchive,
  FileImage,
  FileCode,
  FileType,
  type LucideIcon,
} from 'lucide-react';

export interface FileTypeStyle {
  gradient: string;
  iconColor: string;
  badgeBg: string;
  Icon: LucideIcon;
  label: string;
}

const STYLES: Record<string, FileTypeStyle> = {
  pdf: {
    gradient: 'from-red-50 to-red-100/70',
    iconColor: 'text-red-500/70',
    badgeBg: 'bg-red-500',
    Icon: FileText,
    label: 'PDF',
  },
  doc: {
    gradient: 'from-blue-50 to-blue-100/70',
    iconColor: 'text-blue-500/70',
    badgeBg: 'bg-blue-500',
    Icon: FileText,
    label: 'DOC',
  },
  docx: {
    gradient: 'from-blue-50 to-blue-100/70',
    iconColor: 'text-blue-500/70',
    badgeBg: 'bg-blue-500',
    Icon: FileText,
    label: 'DOCX',
  },
  ppt: {
    gradient: 'from-pink-50 to-pink-100/70',
    iconColor: 'text-pink-500/70',
    badgeBg: 'bg-pink-500',
    Icon: Presentation,
    label: 'PPT',
  },
  pptx: {
    gradient: 'from-pink-50 to-pink-100/70',
    iconColor: 'text-pink-500/70',
    badgeBg: 'bg-pink-500',
    Icon: Presentation,
    label: 'PPTX',
  },
  xls: {
    gradient: 'from-emerald-50 to-emerald-100/70',
    iconColor: 'text-emerald-500/70',
    badgeBg: 'bg-emerald-600',
    Icon: FileSpreadsheet,
    label: 'XLS',
  },
  xlsx: {
    gradient: 'from-emerald-50 to-emerald-100/70',
    iconColor: 'text-emerald-500/70',
    badgeBg: 'bg-emerald-600',
    Icon: FileSpreadsheet,
    label: 'XLSX',
  },
  csv: {
    gradient: 'from-emerald-50 to-emerald-100/70',
    iconColor: 'text-emerald-500/70',
    badgeBg: 'bg-emerald-600',
    Icon: FileSpreadsheet,
    label: 'CSV',
  },
  zip: {
    gradient: 'from-amber-50 to-amber-100/70',
    iconColor: 'text-amber-600/70',
    badgeBg: 'bg-amber-600',
    Icon: FileArchive,
    label: 'ZIP',
  },
  rar: {
    gradient: 'from-amber-50 to-amber-100/70',
    iconColor: 'text-amber-600/70',
    badgeBg: 'bg-amber-600',
    Icon: FileArchive,
    label: 'RAR',
  },
  png: {
    gradient: 'from-violet-50 to-violet-100/70',
    iconColor: 'text-violet-500/70',
    badgeBg: 'bg-violet-500',
    Icon: FileImage,
    label: 'PNG',
  },
  jpg: {
    gradient: 'from-violet-50 to-violet-100/70',
    iconColor: 'text-violet-500/70',
    badgeBg: 'bg-violet-500',
    Icon: FileImage,
    label: 'JPG',
  },
  jpeg: {
    gradient: 'from-violet-50 to-violet-100/70',
    iconColor: 'text-violet-500/70',
    badgeBg: 'bg-violet-500',
    Icon: FileImage,
    label: 'JPEG',
  },
  txt: {
    gradient: 'from-slate-50 to-slate-100/70',
    iconColor: 'text-slate-500/70',
    badgeBg: 'bg-slate-500',
    Icon: FileType,
    label: 'TXT',
  },
};

const DEFAULT_STYLE: FileTypeStyle = {
  gradient: 'from-hust-50 to-hust-100/60',
  iconColor: 'text-hust/40',
  badgeBg: 'bg-hust',
  Icon: FileCode,
  label: 'FILE',
};

export function fileTypeStyle(extension: string): FileTypeStyle {
  return STYLES[extension.toLowerCase()] ?? DEFAULT_STYLE;
}
