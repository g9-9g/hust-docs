import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Gift as GiftIcon, History, LogIn, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { AvatarFrame } from '@/components/rewards/AvatarFrame';
import { GiftImage } from '@/components/rewards/GiftImage';
import { RewardCelebration } from '@/components/rewards/RewardCelebration';
import { RewardLadder } from '@/components/rewards/RewardLadder';
import { resolveGiftIcon } from '@/components/rewards/giftIcons';
import { useGiftsQuery, useRedeemGiftMutation, useEquipMutation } from '@/hooks/queries';
import { useAuth } from '@/store/auth';
import type { Gift, GiftType } from '@/types';

const TYPE_TABS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'BADGE', label: 'Huy hiệu' },
  { value: 'AVATAR_FRAME', label: 'Khung avatar' },
  { value: 'VOUCHER', label: 'Voucher' },
  { value: 'other', label: 'Khác' },
];

const TYPE_LABEL: Record<GiftType, string> = {
  BADGE: 'Huy hiệu',
  AVATAR_FRAME: 'Khung avatar',
  VOUCHER: 'Voucher',
  OFFLINE_GIFT: 'Quà tặng',
  OTHER: 'Khác',
};

const isCosmetic = (t: GiftType) => t === 'BADGE' || t === 'AVATAR_FRAME';

function matchesTab(type: GiftType, tab: string) {
  if (tab === 'all') return true;
  if (tab === 'other') return type === 'OFFLINE_GIFT' || type === 'OTHER';
  return type === tab;
}

/** Preview cosmetic bằng CSS — dùng cho phần hình của card. */
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
          className="flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg"
          style={{ background: accent }}
        >
          <Icon className="h-10 w-10 text-white" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-secondary/50">
      <AvatarFrame frameGradient={gift.frameGradient}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-hust text-2xl font-bold text-white">
          H
        </div>
      </AvatarFrame>
    </div>
  );
}

interface GiftCardProps {
  gift: Gift;
  balance: number | null;
  owned: boolean;
  equipped: boolean;
  isAuthed: boolean;
  onRedeem: (gift: Gift) => void;
}

function GiftCard({ gift, balance, owned, equipped, isAuthed, onRedeem }: GiftCardProps) {
  const navigate = useNavigate();
  const soldOut = gift.stock !== null && gift.stock <= 0;
  const notEnough = balance !== null && balance < gift.pointsCost;

  let action: { label: string; disabled: boolean; onClick?: () => void };
  if (!isAuthed) {
    action = { label: 'Đăng nhập để đổi', disabled: false, onClick: () => navigate('/login') };
  } else if (owned && isCosmetic(gift.type)) {
    action = { label: equipped ? 'Đang dùng' : 'Đã sở hữu', disabled: true };
  } else if (soldOut) {
    action = { label: 'Hết hàng', disabled: true };
  } else if (notEnough) {
    action = { label: 'Không đủ điểm', disabled: true };
  } else {
    action = { label: 'Đổi quà', disabled: false, onClick: () => onRedeem(gift) };
  }

  return (
    <Card className="group flex flex-col overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:border-hust/30 hover:shadow-lg">
      <div className="relative h-40">
        {isCosmetic(gift.type) ? (
          <CosmeticPreview gift={gift} />
        ) : (
          <GiftImage src={gift.imageUrl} name={gift.name} className="h-full w-full" />
        )}
        <Badge variant="secondary" className="absolute left-2 top-2 gap-1 backdrop-blur">
          {TYPE_LABEL[gift.type]}
        </Badge>
        {owned && isCosmetic(gift.type) && (
          <Badge variant="success" className="absolute right-2 top-2 gap-1">
            <Check className="h-3 w-3" /> Đã sở hữu
          </Badge>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold leading-tight">{gift.name}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{gift.description}</p>

        <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-semibold text-hust">
            <Award className="h-4 w-4" />
            {gift.pointsCost} điểm
          </span>
          {gift.stock !== null && (
            <span className={soldOut ? 'text-destructive' : ''}>
              {soldOut ? 'Hết hàng' : `Còn ${gift.stock}`}
            </span>
          )}
        </div>

        <Button
          className="mt-1 w-full"
          variant={action.disabled ? 'secondary' : 'default'}
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function RewardsPage() {
  const user = useAuth((s) => s.user);
  const refreshUser = useAuth((s) => s.refreshUser);
  const { data, isLoading } = useGiftsQuery();
  const redeemMutation = useRedeemGiftMutation();
  const equipMutation = useEquipMutation();

  const [tab, setTab] = useState('all');
  const [confirmGift, setConfirmGift] = useState<Gift | null>(null);
  const [celebrationGift, setCelebrationGift] = useState<Gift | null>(null);

  const gifts = data?.gifts ?? [];
  const balance = data?.balance ?? null;
  const ownedIds = useMemo(() => new Set(data?.ownedGiftIds ?? []), [data]);
  const equippedBadgeId = data?.equippedBadgeGiftId ?? null;
  const equippedFrameId = data?.equippedFrameGiftId ?? null;

  const visibleGifts = gifts.filter((g) => matchesTab(g.type, tab));
  const ownedCosmetics = gifts.filter((g) => isCosmetic(g.type) && ownedIds.has(g.id));

  function isEquipped(gift: Gift) {
    return gift.id === equippedBadgeId || gift.id === equippedFrameId;
  }

  function confirmRedeem() {
    if (!confirmGift) return;
    const gift = confirmGift;
    redeemMutation.mutate(gift.id, {
      onSuccess: async () => {
        setConfirmGift(null);
        setCelebrationGift(gift);
        toast({
          title: 'Đổi quà thành công',
          description: isCosmetic(gift.type)
            ? `${gift.name} đã được trang bị cho bạn.`
            : `Yêu cầu đổi "${gift.name}" đang được xử lý.`,
          variant: 'success',
        });
        await refreshUser();
      },
      onError: (err: unknown) => {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Vui lòng thử lại';
        toast({ title: 'Không thể đổi quà', description: message, variant: 'error' });
      },
    });
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

  return (
    <div className="bg-secondary/20">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-hust-800 via-hust to-hust-700 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] animate-grid-pan"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
        />
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-amber-300/25 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl animate-blob-slow" />

        <div className="container relative py-14 md:py-20">
          <div
            className={`mx-auto items-center gap-10 ${
              user
                ? 'grid max-w-5xl lg:grid-cols-[minmax(0,1fr)_320px]'
                : 'max-w-2xl'
            }`}
          >
          <div className="text-center">
            <Badge
              variant="outline"
              className="gap-1.5 border-white/30 bg-white/10 text-white backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" /> Đổi điểm lấy quà
            </Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Đổi quà</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 md:text-base">
              Dùng điểm đóng góp đổi lấy huy hiệu, khung avatar và những phần quà hấp dẫn dành cho
              thành viên tích cực của HUST Docs.
            </p>

            {user ? (
              <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-amber-300/90 text-hust shadow-[0_0_24px_rgba(252,211,77,0.6)]">
                  <Award className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="text-xs uppercase tracking-wider text-white/70">Điểm hiện có</p>
                  <p className="text-2xl font-bold leading-tight">
                    {balance ?? user.contributionPoints}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <Button asChild size="lg" variant="secondary" className="gap-2">
                  <Link to="/login">
                    <LogIn className="h-4 w-4" /> Đăng nhập để đổi quà
                  </Link>
                </Button>
              </div>
            )}

            {user && (
              <div className="mt-4">
                <Link
                  to="/me/points"
                  className="inline-flex items-center gap-1.5 text-sm text-white/80 underline-offset-4 hover:text-white hover:underline"
                >
                  <History className="h-4 w-4" /> Xem lịch sử đổi quà
                </Link>
              </div>
            )}
          </div>

            {user && (
              <div className="mx-auto w-full max-w-sm lg:mx-0">
                <RewardLadder balance={balance ?? user.contributionPoints ?? 0} />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container space-y-10 py-10">
        {/* Bộ sưu tập của tôi */}
        {user && ownedCosmetics.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Bộ sưu tập của tôi</h2>
              <p className="text-sm text-muted-foreground">
                Bật/tắt huy hiệu và khung avatar đã sở hữu — thay đổi hiển thị ngay trên Header.
              </p>
            </div>
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
                      <p className="text-xs text-muted-foreground">{TYPE_LABEL[gift.type]}</p>
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
            </div>
          </section>
        )}

        {/* Catalog */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight">Kho quà</h2>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="flex-wrap">
                {TYPE_TABS.map((t) => (
                  <TabsTrigger key={t.value} value={t.value}>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          ) : visibleGifts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 p-12 text-center text-sm text-muted-foreground">
                <GiftIcon className="h-8 w-8 text-muted-foreground/60" />
                Chưa có quà nào trong mục này.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleGifts.map((gift) => (
                <GiftCard
                  key={gift.id}
                  gift={gift}
                  balance={balance}
                  owned={ownedIds.has(gift.id)}
                  equipped={isEquipped(gift)}
                  isAuthed={!!user}
                  onRedeem={setConfirmGift}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal xác nhận đổi quà */}
      <Dialog open={!!confirmGift} onOpenChange={(open) => !open && setConfirmGift(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đổi quà</DialogTitle>
            <DialogDescription>
              Bạn sắp dùng điểm đóng góp để đổi phần quà này.
            </DialogDescription>
          </DialogHeader>
          {confirmGift && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border bg-secondary/30 p-3">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md">
                  {isCosmetic(confirmGift.type) ? (
                    <CosmeticPreview gift={confirmGift} />
                  ) : (
                    <GiftImage
                      src={confirmGift.imageUrl}
                      name={confirmGift.name}
                      className="h-full w-full"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{confirmGift.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Giá: <span className="font-semibold text-hust">{confirmGift.pointsCost}</span>{' '}
                    điểm
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Điểm hiện có</span>
                <span className="font-medium">{balance ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Còn lại sau khi đổi</span>
                <span className="font-semibold text-hust">
                  {(balance ?? 0) - confirmGift.pointsCost}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmGift(null)}>
              Huỷ
            </Button>
            <Button onClick={confirmRedeem} disabled={redeemMutation.isPending}>
              {redeemMutation.isPending ? 'Đang xử lý...' : 'Xác nhận đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RewardCelebration gift={celebrationGift} onDone={() => setCelebrationGift(null)} />
    </div>
  );
}
