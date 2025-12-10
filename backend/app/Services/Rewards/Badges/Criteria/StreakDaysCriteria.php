<?php

declare(strict_types=1);

namespace App\Services\Rewards\Badges\Criteria;

use App\Services\Rewards\Badges\BaseBadgeCriteria;
use App\Models\Rewards\RewardUser;

class StreakDaysCriteria extends BaseBadgeCriteria
{
    protected string $type = 'streak_days';
    protected array $events = ['streak_updated', 'daily_sync'];

    public function evaluate(RewardUser $user, array $config, array $context = []): bool
    {
        $requiredDays = $config['days'] ?? 1;
        $useCurrentStreak = $config['use_current'] ?? true;

        $streak = $useCurrentStreak ? $user->current_streak : $user->longest_streak;

        return $streak >= $requiredDays;
    }

    public function getProgress(RewardUser $user, array $config): float
    {
        $requiredDays = $config['days'] ?? 1;
        $useCurrentStreak = $config['use_current'] ?? true;

        if ($requiredDays <= 0) {
            return 1.0;
        }

        $streak = $useCurrentStreak ? $user->current_streak : $user->longest_streak;

        return min(1.0, $streak / $requiredDays);
    }
}
