<?php

declare(strict_types=1);

namespace App\Services\Rewards\Badges;

use App\Services\Rewards\Badges\Criteria\PointsThresholdCriteria;
use App\Services\Rewards\Badges\Criteria\LevelReachedCriteria;
use App\Services\Rewards\Badges\Criteria\StreakDaysCriteria;
use App\Services\Rewards\Badges\Criteria\TasksCompletedCriteria;

class CriteriaRegistry
{
    /**
     * @var array<string, BadgeCriteriaInterface>
     */
    protected array $criteria = [];

    /**
     * @var array<string, array<string>>
     */
    protected array $eventMap = [];

    public function __construct()
    {
        $this->registerDefaultCriteria();
    }

    /**
     * Registra los criterios por defecto.
     */
    protected function registerDefaultCriteria(): void
    {
        $this->register(new PointsThresholdCriteria());
        $this->register(new LevelReachedCriteria());
        $this->register(new StreakDaysCriteria());
        $this->register(new TasksCompletedCriteria());
    }

    /**
     * Registra un nuevo criterio.
     */
    public function register(BadgeCriteriaInterface $criteria): void
    {
        $type = $criteria->getType();
        $this->criteria[$type] = $criteria;

        // Mapear eventos
        foreach ($criteria->getEvents() as $event) {
            if (!isset($this->eventMap[$event])) {
                $this->eventMap[$event] = [];
            }
            $this->eventMap[$event][] = $type;
        }
    }

    /**
     * Verifica si existe un criterio registrado.
     */
    public function has(string $type): bool
    {
        return isset($this->criteria[$type]);
    }

    /**
     * Obtiene un criterio por tipo.
     */
    public function get(string $type): ?BadgeCriteriaInterface
    {
        return $this->criteria[$type] ?? null;
    }

    /**
     * Obtiene todos los criterios registrados.
     */
    public function all(): array
    {
        return $this->criteria;
    }

    /**
     * Obtiene los criterios que escuchan un evento específico.
     */
    public function getCriteriaForEvent(string $event): array
    {
        $types = $this->eventMap[$event] ?? [];
        $result = [];

        foreach ($types as $type) {
            if (isset($this->criteria[$type])) {
                $result[$type] = $this->criteria[$type];
            }
        }

        return $result;
    }

    /**
     * Obtiene todos los eventos registrados.
     */
    public function getRegisteredEvents(): array
    {
        return array_keys($this->eventMap);
    }
}
