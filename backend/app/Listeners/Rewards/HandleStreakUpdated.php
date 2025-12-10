<?php

declare(strict_types=1);

namespace App\Listeners\Rewards;

use App\Events\Rewards\StreakUpdated;
use App\Services\Rewards\RewardService;
use App\Services\Rewards\Badges\BadgeService;
use App\Services\Rewards\CacheService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleStreakUpdated implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        protected RewardService $rewardService,
        protected BadgeService $badgeService,
        protected CacheService $cacheService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(StreakUpdated $event): void
    {
        $rewardUser = $event->rewardUser;

        // Solo procesar si la racha aumentó
        if ($event->currentStreak <= $event->previousStreak) {
            return;
        }

        // 1. Verificar si es un milestone para dar bonus
        if ($event->isMilestone()) {
            $this->awardMilestoneBonus($event);
        }

        // 2. Verificar badges de racha
        $this->badgeService->checkAndAwardBadges(
            $rewardUser,
            'streak_updated',
            [
                'previous_streak' => $event->previousStreak,
                'current_streak' => $event->currentStreak,
                'is_new_record' => $event->isNewRecord,
                'longest_streak' => $event->getLongestStreak(),
            ]
        );

        // 3. Invalidar caché
        $this->cacheService->invalidateUser($rewardUser->id);

        // 4. Notificación de milestone
        if ($event->isMilestone() && config('gamification.notifications.streak_milestone', true)) {
            $this->sendMilestoneNotification($event);
        }

        \Log::info('Streak updated processed', [
            'user_id' => $event->getUserId(),
            'from' => $event->previousStreak,
            'to' => $event->currentStreak,
            'is_milestone' => $event->isMilestone(),
            'is_new_record' => $event->isNewRecord,
        ]);
    }

    /**
     * Award bonus points for streak milestones
     */
    protected function awardMilestoneBonus(StreakUpdated $event): void
    {
        $bonuses = config('gamification.streaks.bonuses', []);
        $currentStreak = $event->currentStreak;

        if (isset($bonuses[$currentStreak])) {
            // Dar puntos bonus (por ejemplo, 50 puntos base * multiplicador)
            $baseBonus = 50;
            $multiplier = 1 + $bonuses[$currentStreak];
            $bonusPoints = (int) ($baseBonus * $multiplier);

            $this->rewardService->awardPoints(
                $event->rewardUser,
                $bonusPoints,
                'streak_milestone',
                [
                    'streak_days' => $currentStreak,
                    'bonus_multiplier' => $bonuses[$currentStreak],
                ]
            );
        }
    }

    /**
     * Send milestone notification
     */
    protected function sendMilestoneNotification(StreakUpdated $event): void
    {
        try {
            $user = $event->rewardUser->user;
            
            if ($user) {
                // Aquí se enviaría la notificación
                // $user->notify(new StreakMilestoneNotification($event->currentStreak));
            }
        } catch (\Throwable $e) {
            \Log::warning('Failed to send streak milestone notification', [
                'user_id' => $event->getUserId(),
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(StreakUpdated $event, \Throwable $exception): void
    {
        \Log::error('Failed to handle StreakUpdated event', [
            'user_id' => $event->getUserId(),
            'streak' => $event->currentStreak,
            'error' => $exception->getMessage(),
        ]);
    }
}
