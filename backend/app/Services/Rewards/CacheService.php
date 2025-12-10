<?php

declare(strict_types=1);

namespace App\Services\Rewards;

use Illuminate\Support\Facades\Cache;

class CacheService
{
    private const PREFIX = 'rewards:';
    private const TTL_USER = 3600;          // 1 hora
    private const TTL_LEADERBOARD = 300;    // 5 minutos
    private const TTL_BADGES = 1800;        // 30 minutos

    /**
     * Obtiene datos del usuario desde caché.
     */
    public function getUser(int $userId): ?array
    {
        return Cache::get($this->userKey($userId));
    }

    /**
     * Guarda datos del usuario en caché.
     */
    public function setUser(int $userId, array $data): void
    {
        Cache::put($this->userKey($userId), $data, self::TTL_USER);
    }

    /**
     * Invalida caché del usuario.
     */
    public function invalidateUser(int $userId): void
    {
        Cache::forget($this->userKey($userId));
        Cache::forget($this->userBadgesKey($userId));
        Cache::forget($this->userStatsKey($userId));
    }

    /**
     * Obtiene badges del usuario desde caché.
     */
    public function getUserBadges(int $userId): ?array
    {
        return Cache::get($this->userBadgesKey($userId));
    }

    /**
     * Guarda badges del usuario en caché.
     */
    public function setUserBadges(int $userId, array $badges): void
    {
        Cache::put($this->userBadgesKey($userId), $badges, self::TTL_BADGES);
    }

    /**
     * Obtiene leaderboard desde caché.
     */
    public function getLeaderboard(string $metric, string $period): ?array
    {
        return Cache::get($this->leaderboardKey($metric, $period));
    }

    /**
     * Guarda leaderboard en caché.
     */
    public function setLeaderboard(string $metric, string $period, array $data): void
    {
        Cache::put($this->leaderboardKey($metric, $period), $data, self::TTL_LEADERBOARD);
    }

    /**
     * Invalida caché de leaderboard.
     */
    public function invalidateLeaderboard(string $metric, string $period): void
    {
        Cache::forget($this->leaderboardKey($metric, $period));
    }

    /**
     * Invalida todos los leaderboards.
     */
    public function invalidateAllLeaderboards(): void
    {
        $metrics = ['points', 'experience', 'streak', 'level', 'badges'];
        $periods = ['daily', 'weekly', 'monthly', 'all_time'];

        foreach ($metrics as $metric) {
            foreach ($periods as $period) {
                $this->invalidateLeaderboard($metric, $period);
            }
        }
    }

    /**
     * Guarda estadísticas del usuario en caché.
     */
    public function setUserStats(int $userId, array $stats): void
    {
        Cache::put($this->userStatsKey($userId), $stats, self::TTL_USER);
    }

    /**
     * Obtiene estadísticas del usuario desde caché.
     */
    public function getUserStats(int $userId): ?array
    {
        return Cache::get($this->userStatsKey($userId));
    }

    // Key generators
    private function userKey(int $userId): string
    {
        return self::PREFIX . "user:{$userId}";
    }

    private function userBadgesKey(int $userId): string
    {
        return self::PREFIX . "user:{$userId}:badges";
    }

    private function userStatsKey(int $userId): string
    {
        return self::PREFIX . "user:{$userId}:stats";
    }

    private function leaderboardKey(string $metric, string $period): string
    {
        return self::PREFIX . "leaderboard:{$metric}:{$period}";
    }
}
