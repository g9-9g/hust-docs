import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Upload, FileText, Loader2, X, ImagePlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { uploadDocument } from '@/api/documents';
import { CATEGORY_OPTIONS } from '@/lib/categories';
import { formatFileSize } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import { useMajorsQuery, useSubjectsQuery } from '@/hooks/queries';
import type { DocumentCategory } from '@/types';

const uploadSchema = z.object({
  title: z.string().min(3, 'Tiêu đề tối thiểu 3 ký tự').max(200),
  description: z.string().max(2000).optional().default(''),
  majorId: z.string().min(1, 'Vui lòng chọn chuyên ngành'),
  subjectId: z.string().min(1, 'Vui lòng chọn môn học'),
  category: z.string().min(1, 'Vui lòng chọn loại tài liệu'),
  tags: z.string().optional().default(''),
  teacherName: z.string().max(100).optional().default(''),
  semester: z.string().max(20).optional().default(''),
  academicYear: z.string().max(20).optional().default(''),
});

type UploadValues = z.infer<typeof uploadSchema>;

export default function UploadPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const file = files[0] ?? null;
  const isImageSet = files.length > 0 && files.every((f) => f.type.startsWith('image/'));

  function addFiles(picked: FileList | null) {
    if (!picked || picked.length === 0) return;
    const arr = Array.from(picked);
    const allImages = arr.every((f) => f.type.startsWith('image/'));
    setFiles((prev) => {
      if (prev.length === 0) return arr;
      const prevAllImages = prev.every((f) => f.type.startsWith('image/'));
      if (allImages && prevAllImages) {
        const existing = new Set(prev.map((f) => `${f.name}-${f.size}`));
        return [...prev, ...arr.filter((f) => !existing.has(`${f.name}-${f.size}`))];
      }
      return arr;
    });
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  const form = useForm<UploadValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      description: '',
      majorId: '',
      subjectId: '',
      category: '',
      tags: '',
      teacherName: '',
      semester: '',
      academicYear: '',
    },
  });

  const majorId = form.watch('majorId');
  const { data: majors = [] } = useMajorsQuery();
  const { data: subjects = [] } = useSubjectsQuery(majorId || undefined);

  useEffect(() => {
    form.setValue('subjectId', '');
  }, [majorId, form]);

  const mutation = useMutation({
    mutationFn: (fd: FormData) => uploadDocument(fd),
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({ title: 'Đăng tải thành công!', description: '+10 điểm đóng góp', variant: 'success' });
      navigate(`/documents/${doc.id}`);
    },
    onError: (err: any) => {
      toast({
        title: 'Đăng tải thất bại',
        description: err?.response?.data?.message ?? 'Vui lòng thử lại',
        variant: 'error',
      });
    },
  });

  function onSubmit(values: UploadValues) {
    if (files.length === 0) {
      toast({ title: 'Vui lòng chọn file', variant: 'error' });
      return;
    }
    const fd = new FormData();
    files.forEach((f, i) => fd.append(i === 0 ? 'file' : 'files', f));
    fd.append('title', values.title);
    fd.append('description', values.description ?? '');
    fd.append('majorId', values.majorId);
    fd.append('subjectId', values.subjectId);
    fd.append('category', values.category);
    if (values.tags?.trim()) fd.append('tags', values.tags.trim());
    if (values.teacherName?.trim()) fd.append('teacherName', values.teacherName.trim());
    if (values.semester?.trim()) fd.append('semester', values.semester.trim());
    if (values.academicYear?.trim()) fd.append('academicYear', values.academicYear.trim());
    mutation.mutate(fd);
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold">Đăng tải tài liệu</h1>
        <p className="text-sm text-muted-foreground">
          Chia sẻ tài liệu của bạn để giúp cộng đồng sinh viên Bách khoa cùng học tốt hơn.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">1. Tệp tài liệu</CardTitle>
              <CardDescription>
                PDF, DOC, PPT, XLSX, ZIP hoặc ảnh. Có thể chọn nhiều ảnh cho cùng một tài liệu. Tối đa 50MB/file.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {files.length === 0 ? (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center transition-colors hover:border-hust/40 hover:bg-hust-50/40">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="font-medium">Bấm để chọn file hoặc kéo thả vào đây</p>
                  <p className="text-xs text-muted-foreground">PDF / DOCX / PPTX / XLSX / ZIP / Ảnh (có thể chọn nhiều)</p>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => addFiles(e.target.files)}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.png,.jpg,.jpeg"
                  />
                </label>
              ) : isImageSet ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {files.map((f, i) => (
                      <div key={`${f.name}-${i}`} className="group relative aspect-[4/3] overflow-hidden rounded-lg border bg-secondary/30">
                        <img
                          src={URL.createObjectURL(f)}
                          alt={f.name}
                          className="h-full w-full object-cover"
                          onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-foreground/70 text-background opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label="Xóa ảnh"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <span className="absolute left-1.5 top-1.5 rounded bg-foreground/70 px-1.5 py-0.5 text-[10px] font-medium text-background">
                          #{i + 1}
                        </span>
                      </div>
                    ))}
                    <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-secondary/20 text-muted-foreground transition-colors hover:border-hust/40 hover:bg-hust-50/40 hover:text-hust">
                      <ImagePlus className="h-6 w-6" />
                      <span className="text-xs font-medium">Thêm ảnh</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => addFiles(e.target.files)}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {files.length} ảnh · Tổng {formatFileSize(files.reduce((s, f) => s + f.size, 0))}. Ảnh đầu tiên sẽ là thumbnail.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border bg-secondary/30 p-3">
                  <FileText className="h-8 w-8 shrink-0 text-hust" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{file!.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file!.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFiles([])}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                    aria-label="Xóa file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">2. Thông tin tài liệu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tiêu đề <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Đề thi cuối kỳ Giải tích 1 — Kỳ 2023.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="majorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Chuyên ngành <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn chuyên ngành" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {majors.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Môn học <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={!majorId}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={majorId ? 'Chọn môn học' : 'Chọn chuyên ngành trước'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.code} — {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Loại tài liệu <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v as DocumentCategory)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại tài liệu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả ngắn</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Mô tả ngắn về nội dung tài liệu..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">3. Thông tin bổ sung (tùy chọn)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="teacherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giảng viên</FormLabel>
                      <FormControl>
                        <Input placeholder="VD: TS. Nguyễn Văn A" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Học kỳ</FormLabel>
                        <FormControl>
                          <Input placeholder="20231" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Năm học</FormLabel>
                        <FormControl>
                          <Input placeholder="2023-2024" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="cuoi-ky, de-thi, on-tap" {...field} />
                    </FormControl>
                    <FormDescription>Phân cách bằng dấu phẩy.</FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Hủy
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="min-w-32">
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Đăng tải'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
