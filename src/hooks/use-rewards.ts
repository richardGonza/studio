'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAuthToken } from '@/lib/auth';
import type {
  DashboardData,
  ProfileData,
  BalanceData,
  Badge,
  Transaction,
  Challenge,
  ChallengeProgress,
  CatalogItem,
  Redemption,
  ApiResponse,
} from '@/types/rewards';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Helper para hacer peticiones autenticadas
 */
async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay sesión activa');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}`);
  }

  const result = await response.json();
  return result.data ?? result;
}

/**
 * Hook para el dashboard de rewards
 */
export function useRewardsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchWithAuth<DashboardData>('/rewards/dashboard');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, isLoading, error, refetch: fetchDashboard };
}

/**
 * Hook para el perfil de rewards
 */
export function useRewardsProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchWithAuth<ProfileData>('/rewards/profile');
      setProfile(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, isLoading, error, refetch: fetchProfile };
}

/**
 * Hook para el balance de puntos
 */
export function useRewardsBalance() {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetchWithAuth<BalanceData>('/rewards/balance');
      setBalance(result);
    } catch (err) {
      console.error('Error fetching balance:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, isLoading, refetch: fetchBalance };
}

/**
 * Hook para el historial de transacciones
 */
export function useTransactionHistory(limit: number = 20) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetchWithAuth<Transaction[]>(`/rewards/history?limit=${limit}`);
      setTransactions(result);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { transactions, isLoading, refetch: fetchHistory };
}

/**
 * Hook para badges
 */
export function useBadges() {
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBadges = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [earned, available] = await Promise.all([
        fetchWithAuth<Badge[]>('/rewards/badges'),
        fetchWithAuth<Badge[]>('/rewards/badges/available'),
      ]);

      setEarnedBadges(earned);
      setAvailableBadges(available);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return { earnedBadges, availableBadges, isLoading, error, refetch: fetchBadges };
}

/**
 * Hook para progreso de badges
 */
export function useBadgeProgress() {
  const [progress, setProgress] = useState<{
    totalBadges: number;
    earnedCount: number;
    earned: Badge[];
    inProgress: Badge[];
    locked: Badge[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetchWithAuth<typeof progress>('/rewards/badges/progress');
      setProgress(result);
    } catch (err) {
      console.error('Error fetching badge progress:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, isLoading, refetch: fetchProgress };
}

/**
 * Hook para challenges
 */
export function useChallenges(status: string = 'active') {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChallenges = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchWithAuth<Challenge[]>(`/rewards/challenges?status=${status}`);
      setChallenges(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const joinChallenge = useCallback(async (challengeId: number) => {
    try {
      await fetchWithAuth(`/rewards/challenges/${challengeId}/join`, {
        method: 'POST',
      });
      await fetchChallenges();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error al unirse al desafío' 
      };
    }
  }, [fetchChallenges]);

  return { challenges, isLoading, error, refetch: fetchChallenges, joinChallenge };
}

/**
 * Hook para un challenge específico
 */
export function useChallengeDetail(challengeId: number) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [progress, setProgress] = useState<ChallengeProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChallenge = useCallback(async () => {
    try {
      setIsLoading(true);
      const [challengeData, progressData] = await Promise.all([
        fetchWithAuth<{ challenge: Challenge; participation: ChallengeProgress | null }>(
          `/rewards/challenges/${challengeId}`
        ),
        fetchWithAuth<ChallengeProgress>(`/rewards/challenges/${challengeId}/progress`).catch(() => null),
      ]);

      setChallenge(challengeData.challenge);
      setProgress(progressData);
    } catch (err) {
      console.error('Error fetching challenge:', err);
    } finally {
      setIsLoading(false);
    }
  }, [challengeId]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  return { challenge, progress, isLoading, refetch: fetchChallenge };
}

/**
 * Hook para el catálogo
 */
export function useCatalog(category?: string) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCatalog = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = category ? `?category=${category}` : '';
      const result = await fetchWithAuth<{
        items: CatalogItem[];
        user_points: number;
        user_level: number;
      }>(`/rewards/catalog${params}`);

      setItems(result.items);
      setUserPoints(result.user_points);
      setUserLevel(result.user_level);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const redeemItem = useCallback(async (
    itemId: number, 
    deliveryInfo?: Record<string, unknown>,
    notes?: string
  ) => {
    try {
      const result = await fetchWithAuth<{
        redemption_id: number;
        status: string;
        points_spent: number;
        new_balance: number;
      }>(`/rewards/catalog/${itemId}/redeem`, {
        method: 'POST',
        body: JSON.stringify({ delivery_info: deliveryInfo, notes }),
      });

      await fetchCatalog();
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error al canjear item',
      };
    }
  }, [fetchCatalog]);

  return { items, userPoints, userLevel, isLoading, error, refetch: fetchCatalog, redeemItem };
}

/**
 * Hook para redenciones
 */
export function useRedemptions(status?: string) {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRedemptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = status ? `?status=${status}` : '';
      const result = await fetchWithAuth<Redemption[]>(`/rewards/redemptions${params}`);
      setRedemptions(result);
    } catch (err) {
      console.error('Error fetching redemptions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchRedemptions();
  }, [fetchRedemptions]);

  return { redemptions, isLoading, refetch: fetchRedemptions };
}
