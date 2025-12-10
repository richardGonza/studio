<?php

declare(strict_types=1);

namespace App\Services\Rewards\Badges\Criteria;

use App\Services\Rewards\Badges\BaseBadgeCriteria;
use App\Models\Rewards\RewardUser;

class PointsThresholdCriteria extends BaseBadgeCriteria
{
    protected string $type = 'points_threshold';
    protected array $events = ['points_earned', 'daily_sync'];

    public function evaluate(RewardUser $user, array $config, array $context = []): bool
    {
        $threshold = $config['threshold'] ?? 0;
        return $user->lifetime_points >= $threshold;
    }

    public function getProgress(RewardUser $user, array $config): float
    {
        $threshold = $config['threshold'] ?? 1;
        if ($threshold <= 0) {
            return 1.0;
        }
        return min(1.0, $user->lifetime_points / $threshold);
    }
}
