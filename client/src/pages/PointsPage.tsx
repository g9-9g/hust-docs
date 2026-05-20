import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ThumbsUp, Download, Upload, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useMyPointsQuery, useMyRedemptionsQuery } from '@/hooks/queries';
import { formatRelativeDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { GiftType, PointReason, RedemptionStatus } from '@/types';

const REASON_LABEL: Record<PointReason, string> = {
  UPVOTE_RECEIVED: 'Tài liệu được upvote',
  DOWNLOAD_MILESTONE: 'Tài liệu đạt mốc lượt tải',
  UPLOAD_DOCUMENT: 'Đăng tải tài liệu',
  REDEEM_REWARD: 'Đổi quà',
};

function ReasonIcon({ reason }: { reason: PointReason }) {
  const cls = 'h-4 w-4 text-hust';
  if (reason === 'UPVOTE_RECEIVED') return <ThumbsUp className={cls} />;
  if (reason === 'DOWNLOAD_MILESTONE') return <Download className={cls} />;
  if (reason === 'UPLOAD_DOCUMENT') return <Upload className={cls} />;
  return <Gift className={cls} />;
}

const GIFT_TYPE_LABEL: Record<GiftType, string> = {
  BADGE: 'Huy hiệu',
  AVATAR_FRAME: 'Khung avatar',
  VOUCHER: 'Voucher',
  OFFLINE_GIFT: 'Quà tặng',
  OTHER: 'Khác',
};

const STATUS_META: Record<RedemptionStatus, { label: string; variant: 'success' | 'secondary' | 'outline' }> = {
  completed: { label: 'Hoàn tất', variant: 'success' },
  pending: { label: 'Đang xử lý', variant: 'secondary' },
  cancelled: { label: 'Đã huỷ', variant: 'outline' },
};

function Pagination({
  page,
  hasMore,
  onPrev,
  onNext,
}: {
  page: number;
  hasMore: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (page <= 1 && !hasMore) return null;
  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={onPrev}>
        Trước
      </Button>
      <span className="text-sm text-muted-foreground">Trang {page}</span>
      <Button variant="outline" size="sm" disabled={!hasMore} onClick={onNext}>
        Sau
      </Button>
    </div>
  );
}

function PointsHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyPointsQuery({ page, limit: 20 });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data || data.transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-sm text-muted-foreground">
          Chưa có giao dịch điểm nào. Hãy đăng tải tài liệu chất lượng để nhận điểm khi được cộng
          đồng upvote hoặc tải về.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {data.transactions.map((t) => {
          const positive = t.amount >= 0;
          return (
            <Card key={t.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hust/10">
                  <ReasonIcon reason={t.reason} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{REASON_LABEL[t.reason]}</p>
                  {t.documentTitle && (
                    <p className="truncate text-xs text-muted-foreground">
                      {t.documentId ? (
                        <Link to={`/documents/${t.documentId}`} className="hover:underline">
                          {t.documentTitle}
                        </Link>
                      ) : (
                        t.documentTitle
                      )}
                    </p>
                  )}
                  {t.note && !t.documentTitle && (
                    <p className="truncate text-xs text-muted-foreground">{t.note}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatRelativeDate(t.createdAt)}</p>
                </div>
                <span
                  className={cn(
                    'shrink-0 text-base font-semibold',
                    positive ? 'text-emerald-600' : 'text-destructive',
                  )}
                >
                  {positive ? `+${t.amount}` : t.amount}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Pagination
        page={data.page}
        hasMore={data.hasMore}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
    </>
  );
}

function RedemptionHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyRedemptionsQuery({ page, limit: 20 });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data || data.redemptions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center text-sm text-muted-foreground">
          Bạn chưa đổi quà nào.
          <Button asChild size="sm" className="gap-1.5">
            <Link to="/rewards">
              <Gift className="h-4 w-4" /> Khám phá kho quà
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {data.redemptions.map((r) => {
          const status = STATUS_META[r.status];
          return (
            <Card key={r.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hust/10">
                  <Gift className="h-4 w-4 text-hust" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.giftName}</p>
                  <p className="text-xs text-muted-foreground">
                    {GIFT_TYPE_LABEL[r.giftType]} · {formatRelativeDate(r.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-base font-semibold text-destructive">
                    -{r.pointsSpent}
                  </span>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Pagination
        page={data.page}
        hasMore={data.hasMore}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
    </>
  );
}

export default function PointsPage() {
  const { data: pointsData, isLoading } = useMyPointsQuery({ page: 1, limit: 20 });

  return (
    <div className="container max-w-3xl py-6 space-y-6">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-hust/10">
            <Award className="h-7 w-7 text-hust" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Tổng điểm đóng góp</p>
            {isLoading ? (
              <Skeleton className="mt-1 h-8 w-20" />
            ) : (
              <p className="text-3xl font-bold text-hust">{pointsData?.balance ?? 0}</p>
            )}
          </div>
          <Button asChild className="gap-1.5">
            <Link to="/rewards">
              <Gift className="h-4 w-4" /> Đổi quà
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="points">
        <TabsList>
          <TabsTrigger value="points">Lịch sử điểm</TabsTrigger>
          <TabsTrigger value="redemptions">Lịch sử đổi quà</TabsTrigger>
        </TabsList>
        <TabsContent value="points" className="space-y-3">
          <PointsHistory />
        </TabsContent>
        <TabsContent value="redemptions" className="space-y-3">
          <RedemptionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
