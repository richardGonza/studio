<?php

declare(strict_types=1);

namespace App\Services\Rewards\Badges;

use App\Models\Rewards\RewardUser;

abstract class BaseBadgeCriteria implements BadgeCriteriaInterface
{
    protected string $type = '';
    protected array $events = [];

    public function getType(): string
    {
        return $this->type;
    }

    public function getEvents(): array
    {
        return $this->events;
    }

    abstract public function evaluate(RewardUser $user, array $config, array $context = []): bool;

    public function getProgress(RewardUser $user, array $config): float
    {
        // Implementación por defecto: 0 o 1 basado en evaluate
        return $this->evaluate($user, $config) ? 1.0 : 0.0;
    }

    /**
     * Helper para obtener un valor de configuración con valor por defecto.
     */
    protected function getConfigValue(array $config, string $key, mixed $default = null): mixed
    {
        return $config[$key] ?? $default;
    }
}
