<?php

declare(strict_types=1);

namespace App\Services\Rewards\Badges;

use App\Models\Rewards\RewardUser;
use App\Models\Rewards\RewardBadge;
use App\Models\Rewards\RewardUserBadge;
use App\Models\Rewards\RewardTransaction;
use App\Events\Rewards\BadgeEarned;
use Illuminate\Support\Facades\DB;

class BadgeService
{
    protected CriteriaRegistry $registry;

    public function __construct(?CriteriaRegistry $registry = null)
    {
        $this->registry = $registry ?? new CriteriaRegistry();
    }

    /**
     * Verifica y otorga badges después de un evento.
     */
    public function checkAndAwardBadges(RewardUser $user, string $event, array $context = []): array
    {
        $awardedBadges = [];

        // Obtener badges que escuchan este evento
        $relevantBadges = $this->getBadgesForEvent($event);

        foreach ($relevantBadges as $badge) {
            if ($this->userHasBadge($user, $badge)) {
                continue;
            }

            if ($this->evaluateBadge($user, $badge, $context)) {
                $userBadge = $this->awardBadge($user, $badge, $context);
                if ($userBadge) {
                    $awardedBadges[] = $userBadge;
                }
            }
        }

        return $awardedBadges;
    }

    /**
     * Evalúa si un usuario cumple los criterios.
     */
    public function evaluateBadge(RewardUser $user, RewardBadge $badge, array $context = []): bool
    {
        $criteriaType = $badge->criteria_type;
        $criteriaConfig = $badge->criteria_config ?? [];

        if (!$this->registry->has($criteriaType)) {
            return false;
        }

        $criteria = $this->registry->get($criteriaType);
        return $criteria->evaluate($user, $criteriaConfig, $context);
    }

    /**
     * Calcula progreso hacia un badge (0.0 - 1.0).
     */
    public function getProgress(RewardUser $user, RewardBadge $badge): float
    {
        $criteriaType = $badge->criteria_type;
        $criteriaConfig = $badge->criteria_config ?? [];

        if (!$this->registry->has($criteriaType)) {
            return 0;
        }

        $criteria = $this->registry->get($criteriaType);
        return $criteria->getProgress($user, $criteriaConfig);
    }

    /**
     * Otorga un badge.
     */
    public function awardBadge(RewardUser $user, RewardBadge $badge, array $context = []): ?RewardUserBadge
    {
        if ($this->userHasBadge($user, $badge)) {
            return null;
        }

        return DB::transaction(function () use ($user, $badge, $context) {
            $userBadge = RewardUserBadge::create([
                'reward_user_id' => $user->id,
                'reward_badge_id' => $badge->id,
                'earned_at' => now(),
                'metadata' => ['context' => $context],
            ]);

            // Recompensas del badge
            if ($badge->points_reward > 0) {
                RewardTransaction::create([
                    'reward_user_id' => $user->id,
                    'type' => 'badge_reward',
                    'amount' => $badge->points_reward,
                    'currency' => 'points',
                    'description' => "Badge: {$badge->name}",
                    'reference_type' => 'badge_earned',
                    'reference_id' => $badge->id,
                    'balance_after' => $user->total_points + $badge->points_reward,
                ]);
                $user->increment('total_points', $badge->points_reward);
                $user->increment('lifetime_points', $badge->points_reward);
            }

            if ($badge->xp_reward > 0) {
                $user->increment('experience_points', $badge->xp_reward);
            }

            event(new BadgeEarned($user, $badge, $userBadge));

            return $userBadge;
        });
    }

    /**
     * Verifica si el usuario ya tiene un badge.
     */
    public function userHasBadge(RewardUser $user, RewardBadge $badge): bool
    {
        return RewardUserBadge::where('reward_user_id', $user->id)
            ->where('reward_badge_id', $badge->id)
            ->exists();
    }

    /**
     * Obtiene los badges del usuario.
     */
    public function getUserBadges(RewardUser $user): array
    {
        return $user->badges()
            ->with('category')
            ->orderByDesc('pivot_earned_at')
            ->get()
            ->map(fn ($badge) => [
                'id' => $badge->id,
                'slug' => $badge->slug,
                'name' => $badge->name,
                'description' => $badge->description,
                'icon' => $badge->icon,
                'rarity' => $badge->rarity,
                'category' => $badge->category?->name,
                'earned_at' => $badge->pivot->earned_at,
            ])
            ->toArray();
    }

    /**
     * Obtiene los badges disponibles con progreso.
     */
    public function getAvailableBadges(RewardUser $user): array
    {
        $userBadgeIds = $user->badges()->pluck('reward_badges.id')->toArray();

        return RewardBadge::where('is_active', true)
            ->where('is_secret', false)
            ->whereNotIn('id', $userBadgeIds)
            ->with('category')
            ->get()
            ->map(fn ($badge) => [
                'id' => $badge->id,
                'slug' => $badge->slug,
                'name' => $badge->name,
                'description' => $badge->description,
                'icon' => $badge->icon,
                'rarity' => $badge->rarity,
                'category' => $badge->category?->name,
                'progress' => $this->getProgress($user, $badge),
                'points_reward' => $badge->points_reward,
                'xp_reward' => $badge->xp_reward,
            ])
            ->toArray();
    }

    /**
     * Obtiene badges que escuchan un evento específico.
     */
    protected function getBadgesForEvent(string $event): \Illuminate\Support\Collection
    {
        $matchingCriteria = $this->registry->getCriteriaForEvent($event);
        $criteriaTypes = array_keys($matchingCriteria);

        return RewardBadge::where('is_active', true)
            ->whereIn('criteria_type', $criteriaTypes)
            ->get();
    }
}
