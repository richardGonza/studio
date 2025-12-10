<?php

declare(strict_types=1);

namespace App\Services\Rewards\Badges\Criteria;

use App\Services\Rewards\Badges\BaseBadgeCriteria;
use App\Models\Rewards\RewardUser;

class LevelReachedCriteria extends BaseBadgeCriteria
{
    protected string $type = 'level_reached';
    protected array $events = ['level_up', 'daily_sync'];

    public function evaluate(RewardUser $user, array $config, array $context = []): bool
    {
        $requiredLevel = $config['level'] ?? 1;
        return $user->level >= $requiredLevel;
    }

    public function getProgress(RewardUser $user, array $config): float
    {
        $requiredLevel = $config['level'] ?? 1;
        if ($requiredLevel <= 1) {
            return 1.0;
        }
        return min(1.0, ($user->level - 1) / ($requiredLevel - 1));
    }
}
