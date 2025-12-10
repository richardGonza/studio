"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Trophy, 
  Flame, 
  Star, 
  ChevronRight, 
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Target,
  Gift,
  Clock
} from "lucide-react";
import Link from "next/link";
import type { 
  UserSummary, 
  Badge as BadgeType, 
  LeaderboardEntry, 
  Transaction,
  Challenge,
  StreakInfo
} from "@/types/rewards";

/**
 * Calcula el XP necesario para el siguiente nivel
 */
function calculateXPForNextLevel(level: number): number {
  const baseXp = 100;
  const multiplier = 1.5;
  return Math.floor(baseXp * Math.pow(level + 1, multiplier));
}

/**
 * Obtiene el color según la rareza del badge
 */
function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: 'bg-gray-100 text-gray-800 border-gray-300',
    uncommon: 'bg-green-100 text-green-800 border-green-300',
    rare: 'bg-blue-100 text-blue-800 border-blue-300',
    epic: 'bg-purple-100 text-purple-800 border-purple-300',
    legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };
  return colors[rarity] || colors.common;
}

/**
 * Obtiene el color según el rank
 */
function getRankStyle(rank: number): string {
  if (rank === 1) return 'text-yellow-500 font-bold';
  if (rank === 2) return 'text-gray-400 font-bold';
  if (rank === 3) return 'text-amber-600 font-bold';
  return 'text-muted-foreground';
}

// ============================================
// ProfileCard - Muestra nivel, XP, puntos
// ============================================
interface ProfileCardProps {
  profile: UserSummary & { name?: string; avatar?: string };
  isLoading?: boolean;
}

export function ProfileCard({ profile, isLoading }: ProfileCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-8 w-16 ml-auto" />
              <Skeleton className="h-3 w-12 ml-auto" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const xpForNextLevel = profile.xpForNextLevel || calculateXPForNextLevel(profile.level);
  const progress = Math.min((profile.experiencePoints / xpForNextLevel) * 100, 100);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {profile.name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{profile.name || 'Usuario'}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500" />
              Nivel {profile.level}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {profile.totalPoints.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">puntos</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">
              XP: {profile.experiencePoints.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              Siguiente nivel: {xpForNextLevel.toLocaleString()}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {Math.round(progress)}% completado
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// StreakCard - Muestra racha actual
// ============================================
interface StreakCardProps {
  streak: {
    current: number;
    longest: number;
    isActiveToday?: boolean;
    streakBonusPercent?: number;
  };
  isLoading?: boolean;
}

export function StreakCard({ streak, isLoading }: StreakCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${streak.isActiveToday ? 'bg-orange-100' : 'bg-muted'}`}>
              <Flame className={`h-8 w-8 ${streak.isActiveToday ? 'text-orange-500' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {streak.current} {streak.current === 1 ? 'día' : 'días'}
              </div>
              <div className="text-sm text-muted-foreground">
                Récord: {streak.longest} días
              </div>
            </div>
          </div>
          {streak.streakBonusPercent && streak.streakBonusPercent > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              +{streak.streakBonusPercent}% bonus
            </Badge>
          )}
        </div>
        {!streak.isActiveToday && streak.current > 0 && (
          <div className="mt-3 text-xs text-amber-600 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            ¡Completa una actividad hoy para mantener tu racha!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// PointsCard - Muestra balance de puntos
// ============================================
interface PointsCardProps {
  points: number;
  lifetimePoints: number;
  isLoading?: boolean;
}

export function PointsCard({ points, lifetimePoints, isLoading }: PointsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-24 mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {points.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              puntos disponibles
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
          Total histórico: {lifetimePoints.toLocaleString()} puntos
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// MiniLeaderboard - Top usuarios
// ============================================
interface MiniLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: number;
  isLoading?: boolean;
  limit?: number;
}

export function MiniLeaderboard({ entries, currentUserId, isLoading, limit = 5 }: MiniLeaderboardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Clasificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Clasificación
        </CardTitle>
        <Link 
          href="/dashboard/rewards/leaderboard" 
          className="text-sm text-primary hover:underline flex items-center"
        >
          Ver todo <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {entries.length > 0 ? entries.slice(0, limit).map((entry) => {
          // Safety check for entry data
          if (!entry?.user) return null;
          
          return (
            <div 
              key={entry.user.id} 
              className={`flex items-center gap-3 py-2 px-2 rounded-lg transition-colors ${
                currentUserId === entry.user.id ? 'bg-primary/5' : 'hover:bg-muted/50'
              }`}
            >
              <span className={`w-6 text-center ${getRankStyle(entry.rank)}`}>
                {entry.rank}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={entry.user.avatar || undefined} />
                <AvatarFallback className="text-xs">
                  {entry.user.name?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <span className="truncate block text-sm">
                  {entry.user.name || 'Usuario'}
                  {currentUserId === entry.user.id && (
                    <span className="text-xs text-muted-foreground ml-1">(tú)</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm">{entry.value?.toLocaleString() || '0'}</span>
                {entry.change !== undefined && entry.change !== 0 && (
                  <span className={entry.change > 0 ? 'text-green-500' : 'text-red-500'}>
                    {entry.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  </span>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-4 text-muted-foreground">
            No hay datos de clasificación disponibles
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// BadgeCard - Muestra un badge individual
// ============================================
interface BadgeCardProps {
  badge: BadgeType;
  showProgress?: boolean;
}

export function BadgeCard({ badge, showProgress = false }: BadgeCardProps) {
  const isEarned = !!badge.earnedAt;
  const progress = badge.progress || 0;

  return (
    <div 
      className={`p-4 rounded-lg border transition-all ${
        isEarned 
          ? 'bg-card hover:shadow-md' 
          : 'bg-muted/30 opacity-75 hover:opacity-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <div 
          className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl ${
            isEarned ? 'bg-primary/10' : 'bg-muted'
          }`}
        >
          {badge.icon || <Award className={`h-6 w-6 ${isEarned ? 'text-primary' : 'text-muted-foreground'}`} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-medium truncate ${!isEarned && 'text-muted-foreground'}`}>
              {badge.name}
            </h4>
            <Badge variant="outline" className={`text-xs ${getRarityColor(badge.rarity)}`}>
              {badge.rarity}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {badge.description}
          </p>
          {showProgress && !isEarned && (
            <div className="mt-2">
              <Progress value={progress * 100} className="h-1.5" />
              <span className="text-xs text-muted-foreground">
                {Math.round(progress * 100)}%
              </span>
            </div>
          )}
          {isEarned && badge.earnedAt && (
            <div className="text-xs text-green-600 mt-1">
              ✓ Obtenido el {new Date(badge.earnedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      {(badge.pointsReward > 0 || badge.xpReward > 0) && (
        <div className="mt-2 pt-2 border-t flex gap-3 text-xs text-muted-foreground">
          {badge.pointsReward > 0 && (
            <span>+{badge.pointsReward} puntos</span>
          )}
          {badge.xpReward > 0 && (
            <span>+{badge.xpReward} XP</span>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// UpcomingBadges - Badges próximos a desbloquear
// ============================================
interface UpcomingBadgesProps {
  badges: BadgeType[];
  isLoading?: boolean;
  limit?: number;
}

export function UpcomingBadges({ badges, isLoading, limit = 4 }: UpcomingBadgesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Próximos Badges</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-1.5 w-full" />
              </div>
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Filtrar y ordenar badges por progreso (mayor progreso primero)
  const sortedBadges = badges
    .filter(b => (b.progress || 0) > 0 && (b.progress || 0) < 1)
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))
    .slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5" />
          Próximos Badges
        </CardTitle>
        <Link 
          href="/dashboard/rewards/badges" 
          className="text-sm text-primary hover:underline flex items-center"
        >
          Ver todos <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {sortedBadges.map((badge) => (
          <div key={badge.id} className="flex items-center gap-3 py-2">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              {badge.icon || <Award className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{badge.name}</div>
              <Progress value={(badge.progress || 0) * 100} className="h-1.5 mt-1" />
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {Math.round((badge.progress || 0) * 100)}%
            </span>
          </div>
        ))}
        {sortedBadges.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No hay badges en progreso
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// RecentActivity - Actividad reciente
// ============================================
interface RecentActivityProps {
  transactions: Transaction[];
  isLoading?: boolean;
  limit?: number;
}

export function RecentActivity({ transactions, isLoading, limit = 5 }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn':
      case 'badge_reward':
      case 'challenge_reward':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'spend':
        return <Gift className="h-4 w-4 text-blue-500" />;
      case 'bonus':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Actividad Reciente</CardTitle>
        <Link 
          href="/dashboard/rewards?tab=history" 
          className="text-sm text-primary hover:underline flex items-center"
        >
          Ver todo <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.slice(0, limit).map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-3 py-2">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
              {getTransactionIcon(transaction.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm truncate">
                {transaction.description || transaction.type}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </div>
            </div>
            <span className={`font-semibold text-sm ${
              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
            </span>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No hay actividad reciente
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// ActiveChallenges - Desafíos activos
// ============================================
interface ActiveChallengesProps {
  challenges: Challenge[];
  isLoading?: boolean;
  limit?: number;
}

export function ActiveChallenges({ challenges, isLoading, limit = 3 }: ActiveChallengesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Desafíos Activos</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-3 border rounded-lg mb-2">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const activeChallenges = challenges
    .filter(c => c.isJoined && !c.isCompleted)
    .slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5" />
          Desafíos Activos
        </CardTitle>
        <Link 
          href="/dashboard/rewards/challenges" 
          className="text-sm text-primary hover:underline flex items-center"
        >
          Ver todos <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {activeChallenges.map((challenge) => {
          const progress = challenge.progress?.overallProgress || 0;
          const daysLeft = Math.ceil(
            (new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          return (
            <Link 
              key={challenge.id} 
              href={`/dashboard/rewards/challenges/${challenge.id}`}
              className="block p-3 border rounded-lg mb-2 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{challenge.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {daysLeft > 0 ? `${daysLeft} días` : 'Último día'}
                </Badge>
              </div>
              <Progress value={progress * 100} className="h-1.5" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{Math.round(progress * 100)}% completado</span>
                <span>
                  {challenge.rewards.points && `+${challenge.rewards.points} pts`}
                </span>
              </div>
            </Link>
          );
        })}
        {activeChallenges.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-2">
              No tienes desafíos activos
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/rewards/challenges">
                Explorar desafíos
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// StatsGrid - Grid de estadísticas
// ============================================
interface StatsGridProps {
  stats: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    change?: number;
  }[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              {stat.icon}
              <span className="text-xs">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.change !== undefined && (
              <div className={`text-xs flex items-center gap-1 ${
                stat.change > 0 ? 'text-green-600' : stat.change < 0 ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                {stat.change > 0 ? <TrendingUp className="h-3 w-3" /> : 
                 stat.change < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================
// GamificationDashboard - Componente principal
// ============================================
import { useRewardsDashboard, useChallenges, useBadgeProgress } from "@/hooks/use-rewards";
import { useLeaderboard } from "@/hooks/use-leaderboard";

export function GamificationDashboard() {
  const { data: dashboardData, isLoading } = useRewardsDashboard();
  const { challenges: activeChallenges, isLoading: challengesLoading } = useChallenges('active');
  const { progress: badgeProgress, isLoading: badgesLoading } = useBadgeProgress();
  const { ranking, isLoading: leaderboardLoading } = useLeaderboard({ period: 'weekly' });
  
  const summary = dashboardData?.summary;
  const recentTransactions = dashboardData?.recentActivity || [];
  const leaderboardEntries = ranking?.entries || [];
  const upcomingBadges = badgeProgress?.inProgress || [];

  // Obtener el userId del localStorage (si existe)
  const currentUserId = typeof window !== 'undefined' 
    ? localStorage.getItem('dsf.user.id') || '' 
    : '';

  return (
    <div className="space-y-6">
      {/* Header con perfil */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <ProfileCard 
            profile={{
              level: summary?.level || 1,
              experiencePoints: summary?.experiencePoints || 0,
              xpForNextLevel: summary?.xpForNextLevel || 100,
              totalPoints: summary?.totalPoints || 0,
              lifetimePoints: summary?.lifetimePoints || 0,
              badgesCount: summary?.badgesCount || 0,
              currentStreak: summary?.currentStreak || 0,
              longestStreak: summary?.longestStreak || 0,
              lastActivityAt: summary?.lastActivityAt || null
            }} 
            isLoading={isLoading} 
          />
        </div>
        <div>
          <StreakCard 
            streak={{ 
              current: summary?.currentStreak || 0, 
              longest: summary?.longestStreak || 0 
            }} 
            isLoading={isLoading} 
          />
        </div>
      </div>

      {/* Stats rápidas */}
      <StatsGrid 
        stats={[
          { 
            label: 'Puntos Totales', 
            value: summary?.totalPoints?.toLocaleString() || '0', 
            icon: <Star className="h-4 w-4" /> 
          },
          { 
            label: 'Nivel', 
            value: summary?.level || 1, 
            icon: <TrendingUp className="h-4 w-4" /> 
          },
          { 
            label: 'Badges', 
            value: summary?.badgesCount || 0, 
            icon: <Award className="h-4 w-4" /> 
          },
          { 
            label: 'Racha', 
            value: `${summary?.currentStreak || 0} días`, 
            icon: <Flame className="h-4 w-4" /> 
          },
        ]}
      />

      {/* Grid principal */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Leaderboard */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Ranking Semanal
            </CardTitle>
            <Link href="/dashboard/rewards/leaderboard">
              <Button variant="ghost" size="sm">
                Ver todo <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <MiniLeaderboard 
              entries={leaderboardEntries || []} 
              currentUserId={currentUserId ? parseInt(currentUserId, 10) : undefined}
              isLoading={leaderboardLoading}
              limit={5}
            />
          </CardContent>
        </Card>

        {/* Desafíos activos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Desafíos Activos
            </CardTitle>
            <Link href="/dashboard/rewards/challenges">
              <Button variant="ghost" size="sm">
                Ver todos <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ActiveChallenges 
              challenges={activeChallenges || []} 
              isLoading={isLoading}
              limit={3}
            />
          </CardContent>
        </Card>
      </div>

      {/* Segunda fila */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Próximos badges */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Próximos Badges
            </CardTitle>
            <Link href="/dashboard/rewards/badges">
              <Button variant="ghost" size="sm">
                Ver todos <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <UpcomingBadges 
              badges={upcomingBadges || []} 
              isLoading={isLoading}
              limit={4}
            />
          </CardContent>
        </Card>

        {/* Actividad reciente */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity 
              transactions={recentTransactions || []} 
              isLoading={isLoading}
              limit={5}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
