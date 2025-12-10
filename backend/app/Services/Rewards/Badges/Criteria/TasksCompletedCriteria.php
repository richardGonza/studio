<?php

declare(strict_types=1);

namespace App\Services\Rewards\Badges\Criteria;

use App\Services\Rewards\Badges\BaseBadgeCriteria;
use App\Models\Rewards\RewardUser;
use App\Models\Rewards\RewardTransaction;

class TasksCompletedCriteria extends BaseBadgeCriteria
{
    protected string $type = 'tasks_completed';
    protected array $events = ['task_completed', 'daily_sync'];

    public function evaluate(RewardUser $user, array $config, array $context = []): bool
    {
        $requiredTasks = $config['count'] ?? 1;
        $taskType = $config['task_type'] ?? null;

        $completedTasks = $this->getCompletedTasksCount($user, $taskType);

        return $completedTasks >= $requiredTasks;
    }

    public function getProgress(RewardUser $user, array $config): float
    {
        $requiredTasks = $config['count'] ?? 1;
        $taskType = $config['task_type'] ?? null;

        if ($requiredTasks <= 0) {
            return 1.0;
        }

        $completedTasks = $this->getCompletedTasksCount($user, $taskType);

        return min(1.0, $completedTasks / $requiredTasks);
    }

    /**
     * Cuenta las tareas completadas del usuario.
     */
    protected function getCompletedTasksCount(RewardUser $user, ?string $taskType = null): int
    {
        $query = RewardTransaction::where('reward_user_id', $user->id)
            ->where('type', 'earn');

        if ($taskType) {
            $query->where('reference_type', $taskType);
        }

        return $query->count();
    }
}
