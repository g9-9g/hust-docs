import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/store/auth';
import { toast } from '@/components/ui/toast';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự').max(80),
  username: z
    .string()
    .min(3, 'Tối thiểu 3 ký tự')
    .max(32)
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Chỉ chứa chữ, số, _ . -'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').max(100),
});
type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const register = useAuth((s) => s.register);
  const loading = useAuth((s) => s.loading);
  const navigate = useNavigate();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', username: '', email: '', password: '' },
  });

  async function onSubmit(values: RegisterValues) {
    try {
      await register(values);
      toast({
        title: 'Đăng ký thành công',
        description: 'Chào mừng bạn đến với HUST Docs!',
        variant: 'success',
      });
      navigate('/');
    } catch (err: any) {
      toast({
        title: 'Đăng ký thất bại',
        description: err?.response?.data?.message ?? 'Vui lòng kiểm tra lại thông tin',
        variant: 'error',
      });
    }
  }

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Tạo tài khoản mới</CardTitle>
          <CardDescription>Tham gia cộng đồng chia sẻ tài liệu sinh viên Bách khoa.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Đã có tài khoản?{' '}
                <Link to="/login" className="font-medium text-hust hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
