import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/store/auth';
import { toast } from '@/components/ui/toast';

// Logo Microsoft 4 ô vuông — không phụ thuộc thêm asset.
function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 23 23" className={className} aria-hidden="true">
      <path fill="#f25022" d="M0 0h11v11H0z" />
      <path fill="#7fba00" d="M12 0h11v11H12z" />
      <path fill="#00a4ef" d="M0 12h11v11H0z" />
      <path fill="#ffb900" d="M12 12h11v11H12z" />
    </svg>
  );
}

export default function LoginPage() {
  const loginWithMicrosoft = useAuth((s) => s.loginWithMicrosoft);
  const loading = useAuth((s) => s.loading);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  async function onClick() {
    try {
      await loginWithMicrosoft();
      toast({ title: 'Đăng nhập thành công', variant: 'success' });
      navigate(from, { replace: true });
    } catch (err: any) {
      // MSAL ném BrowserAuthError khi user đóng popup -> không cần báo lỗi nhiễu.
      if (err?.errorCode === 'user_cancelled' || err?.errorCode === 'popup_window_error') {
        return;
      }
      toast({
        title: 'Đăng nhập thất bại',
        description:
          err?.response?.data?.message ??
          err?.message ??
          'Vui lòng thử lại bằng tài khoản @sis.hust.edu.vn',
        variant: 'error',
      });
    }
  }

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Đăng nhập bằng tài khoản Microsoft sinh viên Bách khoa (
            <span className="font-medium">@sis.hust.edu.vn</span>).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            onClick={onClick}
            disabled={loading}
            variant="outline"
            className="w-full h-12 justify-center gap-3 border-2 text-base font-medium"
          >
            <MicrosoftLogo className="h-5 w-5" />
            {loading ? 'Đang xử lý...' : 'Đăng nhập với Microsoft'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Chỉ tài khoản có đuôi <span className="font-medium">@sis.hust.edu.vn</span> mới được tạo
            trên hệ thống. Email khác sẽ bị từ chối.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
