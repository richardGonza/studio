<?php

declare(strict_types=1);

namespace App\Listeners\Rewards;

use App\Events\Rewards\ChallengeCompleted;
use App\Services\Rewards\RewardService;
use App\Services\Rewards\Badges\BadgeService;
use App\Services\Rewards\CacheService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleChallengeCompleted implements ShouldQueue
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
    public function handle(ChallengeCompleted $event): void
    {
        $rewardUser = $event->rewardUser;
        $challenge = $event->challenge;

        // 1. Otorgar puntos del challenge
        if ($challenge->points_reward && $challenge->points_reward > 0) {
            $this->rewardService->awardPoints(
                $rewardUser,
                $challenge->points_reward,
                'challenge_completed',
                [
                    'challenge_id' => $challenge->id,
                    'challenge_name' => $challenge->name,
                ]
            );
        }

        // 2. Otorgar XP del challenge
        if ($challenge->xp_reward && $challenge->xp_reward > 0) {
            $this->rewardService->awardExperience(
                $rewardUser,
                $challenge->xp_reward,
                'challenge_completed',
                [
                    'challenge_id' => $challenge->id,
                    'challenge_name' => $challenge->name,
                ]
            );
        }

        // 3. Verificar badges relacionados con challenges
        $this->badgeService->checkAndAwardBadges(
            $rewardUser,
            'challenge_completed',
            [
                'challenge_id' => $challenge->id,
                'challenge_type' => $challenge->type,
                'total_challenges_completed' => $this->getTotalChallengesCompleted($rewardUser),
            ]
        );

        // 4. Invalidar caché
        $this->cacheService->invalidateUser($rewardUser->id);

        // 5. Enviar notificación
        if (config('gamification.notifications.challenge_completed', true)) {
            $this->sendNotification($event);
        }

        \Log::info('Challenge completed processed', [
            'user_id' => $event->getUserId(),
            'challenge' => $challenge->name,
            'points_reward' => $challenge->points_reward,
            'xp_reward' => $challenge->xp_reward,
        ]);
    }

    /**
     * Get total challenges completed by user
     */
    protected function getTotalChallengesCompleted($rewardUser): int
    {
        return $rewardUser->challengeParticipations()
            ->whereNotNull('completed_at')
            ->count();
    }

    /**
     * Send notification to user
     */
    protected function sendNotification(ChallengeCompleted $event): void
    {
        try {
            $user = $event->rewardUser->user;
            
            if ($user) {
                // Aquí se enviaría la notificación
                // $user->notify(new ChallengeCompletedNotification($event->challenge));
            }
        } catch (\Throwable $e) {
            \Log::warning('Failed to send challenge completed notification', [
                'user_id' => $event->getUserId(),
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(ChallengeCompleted $event, \Throwable $exception): void
    {
        \Log::error('Failed to handle ChallengeCompleted event', [
            'user_id' => $event->getUserId(),
            'challenge' => $event->getChallengeName(),
            'error' => $exception->getMessage(),
        ]);
    }
}
