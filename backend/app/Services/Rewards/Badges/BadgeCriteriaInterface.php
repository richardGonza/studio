<?php

declare(strict_types=1);

namespace App\Services\Rewards\Badges;

use App\Models\Rewards\RewardUser;

interface BadgeCriteriaInterface
{
    /**
     * Obtiene el identificador único del criterio.
     */
    public function getType(): string;

    /**
     * Obtiene los eventos que disparan la evaluación de este criterio.
     */
    public function getEvents(): array;

    /**
     * Evalúa si el usuario cumple los criterios para obtener el badge.
     */
    public function evaluate(RewardUser $user, array $config, array $context = []): bool;

    /**
     * Calcula el progreso del usuario hacia el badge (0.0 - 1.0).
     */
    public function getProgress(RewardUser $user, array $config): float;
}
