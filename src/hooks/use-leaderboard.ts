'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAuthToken } from '@/lib/auth';
import type { LeaderboardEntry } from '@/types/rewards';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export type LeaderboardMetric = 'points' | 'experience' | 'streak' | 'level' | 'lifetime_points';
export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all_time';

export interface LeaderboardData {
  metric: string;
  period: string;
  entries: LeaderboardEntry[];
  generatedAt: string;
}

export interface UserPosition {
  position: number;
  value: number;
  totalParticipants: number;
  percentile: number;
}

export interface NearbyUsers {
  userPosition: number;
  entries: LeaderboardEntry[];
}

interface UseLeaderboardOptions {
  metric?: LeaderboardMetric;
  period?: LeaderboardPeriod;
  limit?: number;
  autoFetch?: boolean;
}

/**
 * Hook principal para el leaderboard
 */
export function useLeaderboard(options: UseLeaderboardOptions = {}) {
  const {
    metric: initialMetric = 'points',
    period: initialPeriod = 'monthly',
    limit = 50,
    autoFetch = true,
  } = options;

  const [ranking, setRanking] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [metric, setMetric] = useState<LeaderboardMetric>(initialMetric);
  const [period, setPeriod] = useState<LeaderboardPeriod>(initialPeriod);

  const fetchRanking = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setError(new Error('No hay sesión activa'));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        metric,
        period,
        limit: String(limit),
      });

      const response = await fetch(`${API_BASE}/rewards/leaderboard?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar leaderboard');
      }

      const result = await response.json();
      setRanking(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }, [metric, period, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchRanking();
    }
  }, [fetchRanking, autoFetch]);

  return {
    ranking,
    isLoading,
    error,
    metric,
    period,
    setMetric,
    setPeriod,
    refetch: fetchRanking,
  };
}

/**
 * Hook para la posición del usuario en el leaderboard
 */
export function useMyLeaderboardPosition(
  metric: LeaderboardMetric = 'points',
  period: LeaderboardPeriod = 'monthly'
) {
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUsers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosition = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setError(new Error('No hay sesión activa'));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({ metric, period });

      const response = await fetch(`${API_BASE}/rewards/leaderboard/position?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar posición');
      }

      const result = await response.json();
      setPosition(result.data.position);
      setNearbyUsers(result.data.nearby_users);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }, [metric, period]);

  useEffect(() => {
    fetchPosition();
  }, [fetchPosition]);

  return { position, nearbyUsers, isLoading, error, refetch: fetchPosition };
}

/**
 * Hook para estadísticas completas del leaderboard
 */
export function useLeaderboardStats() {
  const [stats, setStats] = useState<Record<string, Record<string, UserPosition | null>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setError(new Error('No hay sesión activa'));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/rewards/leaderboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
      }

      const result = await response.json();
      setStats(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}

/**
 * Hook para múltiples leaderboards (comparación)
 */
export function useMultipleLeaderboards(
  configs: { metric: LeaderboardMetric; period: LeaderboardPeriod }[]
) {
  const [leaderboards, setLeaderboards] = useState<Record<string, LeaderboardData>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const promises = configs.map(async ({ metric, period }) => {
        const params = new URLSearchParams({ metric, period, limit: '10' });
        const response = await fetch(`${API_BASE}/rewards/leaderboard?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Error');

        const result = await response.json();
        return { key: `${metric}_${period}`, data: result.data };
      });

      const results = await Promise.all(promises);
      const newLeaderboards: Record<string, LeaderboardData> = {};

      results.forEach(({ key, data }) => {
        newLeaderboards[key] = data;
      });

      setLeaderboards(newLeaderboards);
    } catch (err) {
      console.error('Error fetching leaderboards:', err);
    } finally {
      setIsLoading(false);
    }
  }, [configs]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { leaderboards, isLoading, refetch: fetchAll };
}
