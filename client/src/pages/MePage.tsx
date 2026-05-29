import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Check,
  Download,
  Eye,
  FileText,
  Gift as GiftIcon,
  GraduationCap,
  Mail,
  Sparkles,
  ThumbsUp,
  Upload,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarFrame } from '@/components/rewards/AvatarFrame';
import { BadgeChip } from '@/components/rewards/BadgeChip';
import { GiftImage } from '@/components/rewards/GiftImage';
import { resolveGiftIcon } from '@/components/rewards/giftIcons';
import { getTier } from '@/components/rewards/RewardLadder';
import { DocumentCard } from '@/components/document/DocumentCard';
import { toast } from '@/components/ui/toast';
import { confirm } from '@/components/ui/confirm';
import {
  useEquipMutation,
  useGiftsQuery,
  useMyDocumentsQuery,
  useMyProfileQuery,
  useMyRedemptionsQuery,
  useUseRedemptionMutation,
} from '@/hooks/queries';
import { useAuth } from '@/store/auth';
import { cleanFullName, formatRelativeDate } from '@/lib/utils';
import type { MyDocumentsParams } from '@/api/users';
import type { Gift, GiftType } from '@/types';

const SORT_OPTIONS: { value: NonNullable<MyDocumentsParams['sort']>; label: string }[] = [
  { value: 'latest', label: 'Mới nhất' },
  { value: 'mostDownloaded', label: 'Tải nhiều' },
  { value: 'mostUpvoted', label: 'Upvote nhiều' },
  { value: 'mostViewed', label: 'Xem nhiều' },
];

const STATUS_META: Record<
  'public' | 'pending' | 'hidden' | 'deleted',
  { label: string; variant: 'success' | 'secondary' | 'outline' }
> = {
  public: { label: 'Công khai', variant: 'success' },
  pending: { label: 'Chờ duyệt', variant: 'secondary' },
  hidden: { label: 'Đã ẩn', variant: 'outline' },
  deleted: { label: 'Đã xoá', variant: 'outline' },
};

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Award;
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${accent ?? 'bg-hust/10'}`}
        >
          <Icon className="h-5 w-5 text-hust" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold leading-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

const GIFT_TYPE_LABEL: Record<GiftType, string> = {
  BADGE: 'Huy hiệu',
  AVATAR_FRAME: 'Khung avatar',
  VOUCHER: 'Voucher',
  OFFLINE_GIFT: 'Quà tặng',
  OTHER: 'Khác',
};

const isCosmetic = (t: GiftType) => t === 'BADGE' || t === 'AVATAR_FRAME';

function CosmeticPreview({ gift }: { gift: Gift }) {
  if (gift.type === 'BADGE') {
    const Icon = resolveGiftIcon(gift.icon);
    const accent = gift.accentColor || '#9f1239';
    return (
      <div
        className="flex h-full w-full items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${accent}26, ${accent}08)` }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl shadow"
          style={{ background: accent }}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-secondary/50">
      <AvatarFrame frameGradient={gift.frameGradient}>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hust text-base font-bold text-white">
          H
        </div>
      </AvatarFrame>
    </div>
  );
}

function MyCollection() {
  const refreshUser = useAuth((s) => s.refreshUser);
  const { data: giftsData, isLoading: giftsLoading } = useGiftsQuery();
  const { data: redemptionsData, isLoading: redemptionsLoading } = useMyRedemptionsQuery({
    page: 1,
    limit: 50,
  });
  const equipMutation = useEquipMutation();
  const useMutation = useUseRedemptionMutation();

  const gifts = giftsData?.gifts ?? [];
  const ownedCosmeticIds = useMemo(() => new Set(giftsData?.ownedGiftIds ?? []), [giftsData]);
  const equippedBadgeId = giftsData?.equippedBadgeGiftId ?? null;
  const equippedFrameId = giftsData?.equippedFrameGiftId ?? null;

  const ownedCosmetics = gifts.filter((g) => isCosmetic(g.type) && ownedCosmeticIds.has(g.id));
  const giftById = useMemo(() => new Map(gifts.map((g) => [g.id, g])), [gifts]);
  const vouchers = (redemptionsData?.redemptions ?? []).filter((r) => r.giftType === 'VOUCHER');

  const isLoading = giftsLoading || redemptionsLoading;
  const empty = ownedCosmetics.length === 0 && vouchers.length === 0;

  function isEquipped(gift: Gift) {
    return gift.id === equippedBadgeId || gift.id === equippedFrameId;
  }

  function toggleEquip(gift: Gift) {
    const slot = gift.type === 'BADGE' ? 'badge' : 'frame';
    const equipped = isEquipped(gift);
    equipMutation.mutate(
      { giftId: equipped ? null : gift.id, slot },
      {
        onSuccess: async () => {
          toast({
            title: equipped ? 'Đã bỏ trang bị' : 'Đã trang bị',
            description: gift.name,
            variant: 'success',
          });
          await refreshUser();
        },
        onError: () => {
          toast({ title: 'Không thể cập nhật trang bị', variant: 'error' });
        },
      },
    );
  }

  async function handleUseVoucher(redemptionId: string, giftName: string) {
    const ok = await confirm({
      title: 'Sử dụng voucher?',
      description: `Bạn có chắc muốn sử dụng “${giftName}”? Sau khi xác nhận, voucher sẽ chuyển sang trạng thái Đã sử dụng và không thể hoàn tác.`,
      confirmText: 'Sử dụng',
      cancelText: 'Huỷ',
    });
    if (!ok) return;
    useMutation.mutate(redemptionId, {
      onSuccess: () => {
        toast({ title: 'Đã đánh dấu voucher đã sử dụng', variant: 'success' });
      },
      onError: (err: unknown) => {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Vui lòng thử lại';
        toast({ title: 'Không thể sử dụng voucher', description: message, variant: 'error' });
      },
    });
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (empty) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-hust/10">
            <Sparkles className="h-6 w-6 text-hust" />
          </div>
          <div>
            <p className="font-medium">Bộ sưu tập đang trống</p>
            <p className="text-sm text-muted-foreground">
              Đổi điểm lấy quà ở Kho quà để bắt đầu sưu tập.
            </p>
          </div>
          <Button asChild size="sm" className="gap-1.5">
            <Link to="/rewards">
              <GiftIcon className="h-4 w-4" /> Khám phá kho quà
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ownedCosmetics.map((gift) => {
        const equipped = isEquipped(gift);
        return (
          <Card key={gift.id} className="flex items-center gap-3 p-3">
            <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg">
              <CosmeticPreview gift={gift} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{gift.name}</p>
              <p className="text-xs text-muted-foreground">{GIFT_TYPE_LABEL[gift.type]}</p>
              <Button
                size="sm"
                variant={equipped ? 'secondary' : 'outline'}
                className="mt-2"
                disabled={equipMutation.isPending}
                onClick={() => toggleEquip(gift)}
              >
                {equipped ? 'Bỏ trang bị' : 'Trang bị'}
              </Button>
            </div>
          </Card>
        );
      })}

      {vouchers.map((r) => {
        const used = !!r.usedAt;
        const gift = giftById.get(r.giftId);
        const isUsing = useMutation.isPending && useMutation.variables === r.id;
        return (
          <Card key={r.id} className={`flex items-center gap-3 p-3 ${used ? 'opacity-60' : ''}`}>
            <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg">
              <GiftImage src={gift?.imageUrl ?? null} name={r.giftName} className="h-full w-full" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{r.giftName}</p>
              <p className="text-xs text-muted-foreground">
                {GIFT_TYPE_LABEL[r.giftType]} ·{' '}
                {used
                  ? `Đã dùng ${formatRelativeDate(r.usedAt!)}`
                  : formatRelativeDate(r.createdAt)}
              </p>
              {used ? (
                <Badge variant="outline" className="mt-2 gap-1">
                  <Check className="h-3 w-3" /> Đã sử dụng
                </Badge>
              ) : (
                <Button
                  size="sm"
                  className="mt-2"
                  disabled={isUsing}
                  onClick={() => handleUseVoucher(r.id, r.giftName)}
                >
                  {isUsing ? 'Đang xử lý…' : 'Sử dụng'}
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function TierBadge({ achievedPoints }: { achievedPoints: number }) {
  const tier = getTier(achievedPoints);
  if (!tier) return null;
  const Icon = tier.icon;
  return (
    <span
      title={`Mốc ${tier.name}`}
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{
        color: tier.accentColor,
        borderColor: `${tier.accentColor}40`,
        background: `${tier.accentColor}14`,
      }}
    >
      <Icon className="h-3.5 w-3.5" style={{ color: tier.accentColor }} />
      <span className="whitespace-nowrap">{tier.name}</span>
    </span>
  );
}

export default function MePage() {
  const { data: profile, isLoading: profileLoading } = useMyProfileQuery();
  const [sort, setSort] = useState<NonNullable<MyDocumentsParams['sort']>>('latest');
  const [page, setPage] = useState(1);
  const { data: docs, isLoading: docsLoading, isFetching } = useMyDocumentsQuery({
    page,
    limit: 12,
    sort,
  });

  const user = profile?.user;
  const stats = profile?.stats;
  const initial = (cleanFullName(user?.fullName) || user?.username || '?').charAt(0).toUpperCase();

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <Card className="overflow-hidden">
        <div className="h-24 w-full bg-gradient-to-r from-hust via-hust/80 to-rose-400" />
        <CardContent className="-mt-12 space-y-4 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <AvatarFrame
                frameGradient={user?.equippedAvatarFrame?.frameGradient}
                className="ring-4 ring-background"
              >
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarFallback className="bg-hust text-2xl font-semibold text-white">
                    {initial}
                  </AvatarFallback>
                </Avatar>
              </AvatarFrame>
              <div className="pb-2 space-y-1">
                {profileLoading || !user ? (
                  <>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold leading-tight">
                        {cleanFullName(user.fullName) || user.username}
                      </h1>
                      {user.equippedBadge && (
                        <BadgeChip
                          name={user.equippedBadge.name}
                          icon={user.equippedBadge.icon}
                          accentColor={user.equippedBadge.accentColor}
                          size="sm"
                        />
                      )}
                      <TierBadge
                        achievedPoints={user.achievedPoints ?? user.contributionPoints ?? 0}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </>
                )}
              </div>
            </div>
            <Button asChild variant="outline" className="gap-1.5">
              <Link to="/me/points">
                <GiftIcon className="h-4 w-4" /> Điểm &amp; Quà
              </Link>
            </Button>
          </div>

          {user && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-4 w-4" /> {user.email}
              </span>
              {user.studentId && (
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" /> MSSV {user.studentId}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          icon={Award}
          label="Điểm đóng góp"
          value={profileLoading ? '—' : user?.contributionPoints ?? 0}
        />
        <StatCard
          icon={FileText}
          label="Tài liệu đã đăng"
          value={profileLoading ? '—' : stats?.totalDocuments ?? 0}
        />
        <StatCard
          icon={Download}
          label="Tổng lượt tải"
          value={profileLoading ? '—' : stats?.totalDownloads ?? 0}
        />
        <StatCard
          icon={ThumbsUp}
          label="Tổng upvote"
          value={profileLoading ? '—' : stats?.totalUpvotes ?? 0}
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Bộ sưu tập của tôi</h2>
            <p className="text-sm text-muted-foreground">
              Quà bạn đã đổi. Bấm “Sử dụng” để dùng voucher.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link to="/me/points">Xem tất cả</Link>
          </Button>
        </div>
        <MyCollection />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Tài liệu của tôi</h2>
            <p className="text-sm text-muted-foreground">
              {stats ? `${stats.totalDocuments} tài liệu` : 'Đang tải...'}
              {stats && stats.totalViews > 0 && (
                <>
                  {' '}
                  · <Eye className="inline h-3.5 w-3.5 -mt-0.5" /> {stats.totalViews} lượt xem
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setSort(opt.value);
                  setPage(1);
                }}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  sort === opt.value
                    ? 'border-hust bg-hust text-white'
                    : 'border-border text-muted-foreground hover:bg-secondary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {docsLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-lg" />
            ))}
          </div>
        ) : !docs || docs.items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-hust/10">
                <Upload className="h-7 w-7 text-hust" />
              </div>
              <div>
                <p className="font-medium">Bạn chưa đăng tải tài liệu nào</p>
                <p className="text-sm text-muted-foreground">
                  Chia sẻ tài liệu để nhận điểm đóng góp và quà tặng.
                </p>
              </div>
              <Button asChild className="gap-1.5">
                <Link to="/upload">
                  <Upload className="h-4 w-4" /> Đăng tải ngay
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {docs.items.map((doc) => (
                <div key={doc.id} className="relative">
                  <DocumentCard document={doc} />
                  {doc.status !== 'public' && (
                    <Badge
                      variant={STATUS_META[doc.status].variant}
                      className="absolute right-3 top-3 shadow-sm"
                    >
                      {STATUS_META[doc.status].label}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            {(page > 1 || docs.hasMore) && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Trước
                </Button>
                <span className="text-sm text-muted-foreground">Trang {docs.page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!docs.hasMore || isFetching}
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
