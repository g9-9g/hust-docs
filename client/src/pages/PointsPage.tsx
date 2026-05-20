import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ThumbsUp, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyPointsQuery } from '@/hooks/queries';
import { formatRelativeDate } from '@/lib/utils';
import type { PointReason } from '@/types';

const REASON_LABEL: Record<PointReason, string> = {
  UPVOTE_RECEIVED: 'Tài liệu được upvote',
  DOWNLOAD_MILESTONE: 'Tài liệu đạt mốc lượt tải',
};

function ReasonIcon({ reason }: { reason: PointReason }) {
  return reason === 'UPVOTE_RECEIVED' ? (
    <ThumbsUp className="h-4 w-4 text-hust" />
  ) : (
    <Download className="h-4 w-4 text-hust" />
  );
}

export default function PointsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyPointsQuery({ page, limit: 20 });

  return (
    <div className="container max-w-3xl py-6 space-y-6">
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-hust/10">
            <Award className="h-7 w-7 text-hust" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tổng điểm đóng góp</p>
            {isLoading ? (
              <Skeleton className="mt-1 h-8 w-20" />
            ) : (
              <p className="text-3xl font-bold text-hust">{data?.balance ?? 0}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Lịch sử điểm</h2>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : !data || data.transactions.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              Chưa có giao dịch điểm nào. Hãy đăng tải tài liệu chất lượng để nhận điểm khi
              được cộng đồng upvote hoặc tải về.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-2">
              {data.transactions.map((t) => (
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
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeDate(t.createdAt)}
                      </p>
                    </div>
                    <span className="shrink-0 text-base font-semibold text-emerald-600">
                      +{t.amount}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>

            {(data.page > 1 || data.hasMore) && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Trước
                </Button>
                <span className="text-sm text-muted-foreground">Trang {data.page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.hasMore}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
