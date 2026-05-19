import { Link, useLocation, useNavigate } from 'react-router-dom';
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

const loginSchema = z.object({
  emailOrUsername: z.string().min(3, 'Tối thiểu 3 ký tự'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});
type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const login = useAuth((s) => s.login);
  const loading = useAuth((s) => s.loading);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrUsername: '', password: '' },
  });

  async function onSubmit(values: LoginValues) {
    try {
      await login(values.emailOrUsername, values.password);
      toast({ title: 'Đăng nhập thành công', variant: 'success' });
      navigate(from, { replace: true });
    } catch (err: any) {
      toast({
        title: 'Đăng nhập thất bại',
        description: err?.response?.data?.message ?? 'Vui lòng thử lại',
        variant: 'error',
      });
    }
  }

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>Chào mừng quay lại với kho tài liệu HUST.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="emailOrUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email hoặc username</FormLabel>
                    <FormControl>
                      <Input autoComplete="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-medium text-hust hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
