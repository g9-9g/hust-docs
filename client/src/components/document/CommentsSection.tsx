import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Trash2,
  LogIn,
  Reply,
  X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { confirm } from '@/components/ui/confirm';
import { cn } from '@/lib/utils';
import { formatRelativeDate, cleanFullName } from '@/lib/utils';
import { useAuth } from '@/store/auth';
import {
  useCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from '@/hooks/queries';
import type { CommentItem, CommentReply, CommentSort } from '@/api/comments';

const MAX_LENGTH = 1000;
const PAGE_SIZE = 10;

interface CommentsSectionProps {
  documentId: string;
}

export function CommentsSection({ documentId }: CommentsSectionProps) {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();

  const [sort, setSort] = useState<CommentSort>('newest');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [content, setContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const { data, isLoading, isFetching } = useCommentsQuery(documentId, sort, limit);
  const createMut = useCreateCommentMutation(documentId);
  const deleteMut = useDeleteCommentMutation(documentId);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const hasMore = data?.hasMore ?? false;

  const trimmedLength = useMemo(() => content.trim().length, [content]);
  const tooLong = content.length > MAX_LENGTH;
  const canSubmit = !!user && trimmedLength > 0 && !tooLong && !createMut.isPending;

  function reportError(err: unknown, fallback: string) {
    const message =
      (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
      fallback;
    toast({ title: 'Lỗi', description: message, variant: 'error' });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    createMut.mutate(
      { content: content.trim() },
      {
        onSuccess: () => setContent(''),
        onError: (err) => reportError(err, 'Không thể gửi bình luận.'),
      },
    );
  }

  function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyingTo) return;
    const trimmed = replyContent.trim();
    if (!trimmed || trimmed.length > MAX_LENGTH || createMut.isPending) return;
    createMut.mutate(
      { content: trimmed, parentId: replyingTo.id },
      {
        onSuccess: () => {
          setReplyContent('');
          setReplyingTo(null);
        },
        onError: (err) => reportError(err, 'Không thể gửi trả lời.'),
      },
    );
  }

  async function handleDelete(c: CommentReply) {
    const isOwn = user?.id === c.user.id;
    const ok = await confirm({
      title: isOwn ? 'Xóa bình luận?' : 'Xóa bình luận vi phạm?',
      description: isOwn
        ? 'Nội dung sẽ được ẩn và đánh dấu là đã xóa. Hành động này không thể hoàn tác.'
        : 'Thao tác admin: nội dung sẽ được ẩn và đánh dấu là đã xóa.',
      confirmText: 'Xóa',
      cancelText: 'Hủy',
      variant: 'destructive',
    });
    if (!ok) return;
    deleteMut.mutate(c.id, {
      onError: (err) => reportError(err, 'Không thể xóa bình luận.'),
    });
  }

  function startReply(c: CommentItem | CommentReply) {
    if (!user) {
      navigate('/login');
      return;
    }
    if (c.isDeleted) return;
    // Reply luôn gắn vào comment gốc (server tự resolve nếu là reply lồng).
    setReplyingTo({ id: c.id, name: cleanFullName(c.user.fullName) || c.user.username });
    setReplyContent('');
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-hust" />
            <h2 className="font-semibold">Bình luận</h2>
            <Badge variant="secondary" className="font-normal">
              {total}
            </Badge>
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as CommentSort)}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {user ? (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <CommentAvatar
              fullName={user.fullName}
              avatarUrl={user.avatarUrl}
              className="h-9 w-9"
            />
            <div className="flex-1 space-y-2">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chia sẻ nhận xét về tài liệu…"
                maxLength={MAX_LENGTH + 50}
                rows={3}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'text-xs',
                    tooLong ? 'text-destructive' : 'text-muted-foreground',
                  )}
                >
                  {content.length}/{MAX_LENGTH}
                </span>
                <Button type="submit" size="sm" className="gap-2" disabled={!canSubmit}>
                  <Send className="h-4 w-4" />
                  Gửi
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="rounded-lg bg-secondary/60 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm">
              <p className="font-medium">Đăng nhập để bình luận</p>
              <p className="text-muted-foreground text-xs">
                Chia sẻ nhận xét, đánh giá chất lượng tài liệu với cộng đồng.
              </p>
            </div>
            <Button size="sm" className="gap-2" onClick={() => navigate('/login')}>
              <LogIn className="h-4 w-4" />
              Đăng nhập
            </Button>
          </div>
        )}

        <Separator />

        {isLoading ? (
          <CommentSkeleton />
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Chưa có bình luận. Hãy là người đầu tiên!
          </p>
        ) : (
          <ul className="divide-y">
            {items.map((c) => (
              <li key={c.id} className="py-4 first:pt-2 last:pb-2 space-y-3">
                <CommentRow
                  c={c}
                  canReply={!!user && !c.isDeleted}
                  onReply={() => startReply(c)}
                  onDelete={() => handleDelete(c)}
                  deleting={deleteMut.isPending}
                  viewerId={user?.id ?? null}
                />

                {replyingTo?.id === c.id && user && (
                  <form
                    onSubmit={handleSubmitReply}
                    className="ml-12 flex gap-3 rounded-lg bg-secondary/40 p-3"
                  >
                    <CommentAvatar
                      fullName={user.fullName}
                      avatarUrl={user.avatarUrl}
                      className="h-8 w-8"
                    />
                    <div className="flex-1 space-y-2">
                      <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Trả lời ${replyingTo.name}…`}
                        maxLength={MAX_LENGTH + 50}
                        rows={2}
                        autoFocus
                        className="resize-none bg-background"
                      />
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            'text-xs',
                            replyContent.length > MAX_LENGTH
                              ? 'text-destructive'
                              : 'text-muted-foreground',
                          )}
                        >
                          {replyContent.length}/{MAX_LENGTH}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent('');
                            }}
                          >
                            <X className="h-4 w-4" />
                            Hủy
                          </Button>
                          <Button
                            type="submit"
                            size="sm"
                            className="gap-2"
                            disabled={
                              replyContent.trim().length === 0 ||
                              replyContent.length > MAX_LENGTH ||
                              createMut.isPending
                            }
                          >
                            <Send className="h-4 w-4" />
                            Trả lời
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {c.replies.length > 0 && (
                  <ul className="ml-12 space-y-3 border-l-2 border-secondary pl-4">
                    {c.replies.map((r) => (
                      <li key={r.id}>
                        <CommentRow
                          c={r}
                          canReply={false}
                          onReply={() => undefined}
                          onDelete={() => handleDelete(r)}
                          deleting={deleteMut.isPending}
                          viewerId={user?.id ?? null}
                          compact
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}

        {hasMore && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setLimit((n) => n + PAGE_SIZE)}
            disabled={isFetching}
          >
            {isFetching ? 'Đang tải…' : 'Xem thêm bình luận'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface CommentRowProps {
  c: CommentReply;
  canReply: boolean;
  onReply: () => void;
  onDelete: () => void;
  deleting: boolean;
  viewerId: string | null;
  compact?: boolean;
}

function CommentRow({ c, canReply, onReply, onDelete, deleting, viewerId, compact }: CommentRowProps) {
  return (
    <div className="flex gap-3">
      <CommentAvatar
        fullName={c.user.fullName}
        avatarUrl={c.user.avatarUrl}
        className={compact ? 'h-8 w-8' : 'h-9 w-9'}
      />
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
          <span className="inline-flex items-center gap-1 font-medium">
            {cleanFullName(c.user.fullName) || c.user.username}
          </span>
          <span className="text-xs text-muted-foreground">@{c.user.username}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeDate(c.createdAt)}
          </span>
        </div>
        <p
          className={cn(
            'text-sm leading-relaxed whitespace-pre-wrap break-words',
            c.isDeleted && 'italic text-muted-foreground',
          )}
        >
          {c.content}
        </p>
        {canReply && (
          <button
            type="button"
            onClick={onReply}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Reply className="h-3.5 w-3.5" />
            Trả lời
          </button>
        )}
      </div>
      {c.canDelete && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
          onClick={onDelete}
          disabled={deleting}
          title={viewerId === c.user.id ? 'Xóa bình luận' : 'Xóa (admin)'}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

function CommentAvatar({
  fullName,
  avatarUrl,
  className,
}: {
  fullName: string;
  avatarUrl: string | null;
  className?: string;
}) {
  const initial = (cleanFullName(fullName) || fullName || '?').charAt(0).toUpperCase();
  return (
    <Avatar className={cn('shrink-0', className)}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
      <AvatarFallback className="bg-hust text-white text-sm">{initial}</AvatarFallback>
    </Avatar>
  );
}

function CommentSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
