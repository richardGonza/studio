<?php

declare(strict_types=1);

namespace App\Listeners\Rewards;

use App\Events\Rewards\LevelUp;
use App\Services\Rewards\Badges\BadgeService;
use App\Services\Rewards\CacheService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleLevelUp implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        protected BadgeService $badgeService,
        protected CacheService $cacheService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(LevelUp $event): void
    {
        $rewardUser = $event->rewardUser;

        // 1. Verificar badges de nivel
        $this->badgeService->checkAndAwardBadges(
            $rewardUser,
            'level_reached',
            [
                'previous_level' => $event->previousLevel,
                'new_level' => $event->newLevel,
                'is_milestone' => $event->isMilestone(),
            ]
        );

        // 2. Invalidar caché del usuario
        $this->cacheService->invalidateUser($rewardUser->id);

        // 3. Enviar notificación si está habilitado
        if (config('gamification.notifications.level_up', true)) {
            $this->sendNotification($event);
        }

        \Log::info('Level up processed', [
            'user_id' => $event->getUserId(),
            'from' => $event->previousLevel,
            'to' => $event->newLevel,
            'is_milestone' => $event->isMilestone(),
        ]);
    }

    /**
     * Send notification to user
     */
    protected function sendNotification(LevelUp $event): void
    {
        try {
            $user = $event->rewardUser->user;
            
            if ($user) {
                // Aquí se enviaría la notificación
                // $user->notify(new LevelUpNotification($event->newLevel));
            }
        } catch (\Throwable $e) {
            \Log::warning('Failed to send level up notification', [
                'user_id' => $event->getUserId(),
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(LevelUp $event, \Throwable $exception): void
    {
        \Log::error('Failed to handle LevelUp event', [
            'user_id' => $event->getUserId(),
            'new_level' => $event->newLevel,
            'error' => $exception->getMessage(),
        ]);
    }
}
