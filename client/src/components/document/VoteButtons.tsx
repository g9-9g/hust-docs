import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/auth';
import { useVoteMutation } from '@/hooks/queries';
import { toast } from '@/components/ui/toast';

interface VoteButtonsProps {
  documentId: string;
  uploaderId: string;
  upvoteCount: number;
  downvoteCount: number;
  myVote: 'UP' | 'DOWN' | null;
}

export function VoteButtons({
  documentId,
  uploaderId,
  upvoteCount,
  downvoteCount,
  myVote,
}: VoteButtonsProps) {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const vote = useVoteMutation(documentId);

  const isOwner = !!user && user.id === uploaderId;

  function handleVote(type: 'UP' | 'DOWN') {
    if (!user) {
      toast({ title: 'Đăng nhập để vote', description: 'Bạn cần đăng nhập để đánh giá tài liệu.' });
      navigate('/login');
      return;
    }
    vote.mutate(type, {
      onError: (err) => {
        const message =
          (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
          'Không thể gửi đánh giá, vui lòng thử lại.';
        toast({ title: 'Vote thất bại', description: message, variant: 'error' });
      },
    });
  }

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Đánh giá tài liệu</p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className={cn(
            'flex-1 gap-2 border-transparent text-white',
            myVote === 'UP'
              ? 'bg-emerald-500 ring-2 ring-emerald-300 hover:bg-emerald-300'
              : 'bg-emerald-500 hover:bg-emerald-300',
          )}
          onClick={() => handleVote('UP')}
          disabled={vote.isPending || isOwner}
        >
          <ArrowBigUp className={cn('h-4 w-4', myVote === 'UP' && 'fill-current')} />
          {upvoteCount}
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'flex-1 gap-2 border-transparent text-white',
            myVote === 'DOWN'
              ? 'bg-red-500 ring-2 ring-red-300 hover:bg-red-300'
              : 'bg-red-500 hover:bg-red-300',
          )}
          onClick={() => handleVote('DOWN')}
          disabled={vote.isPending || isOwner}
        >
          <ArrowBigDown className={cn('h-4 w-4', myVote === 'DOWN' && 'fill-current')} />
          {downvoteCount}
        </Button>
      </div>
      {isOwner && (
        <p className="text-xs text-muted-foreground">Bạn không thể vote tài liệu của chính mình.</p>
      )}
    </div>
  );
}
