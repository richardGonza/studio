<?php

declare(strict_types=1);

namespace App\Listeners\Rewards;

use App\Events\Rewards\RewardRedeemed;
use App\Services\Rewards\CacheService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleRewardRedeemed implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        protected CacheService $cacheService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(RewardRedeemed $event): void
    {
        $rewardUser = $event->rewardUser;

        // 1. Invalidar caché del usuario
        $this->cacheService->invalidateUser($rewardUser->id);

        // 2. Actualizar stock del item si aplica
        $catalogItem = $event->catalogItem;
        if ($catalogItem->stock !== null) {
            // El stock ya fue actualizado en el servicio
            // Aquí podemos hacer acciones adicionales
        }

        // 3. Notificar al admin si requiere aprobación
        if (config('gamification.catalog.require_approval', true)) {
            $this->notifyAdminForApproval($event);
        }

        // 4. Enviar confirmación al usuario
        if (config('gamification.notifications.redemption_approved', true)) {
            $this->sendUserConfirmation($event);
        }

        \Log::info('Reward redeemed processed', [
            'user_id' => $event->getUserId(),
            'item' => $event->getItemName(),
            'points_spent' => $event->getPointsSpent(),
            'status' => $event->getStatus(),
        ]);
    }

    /**
     * Notify admin for approval
     */
    protected function notifyAdminForApproval(RewardRedeemed $event): void
    {
        try {
            // Aquí se notificaría al admin
            // Notification::route('mail', config('gamification.admin_email'))
            //     ->notify(new RedemptionPendingApproval($event->redemption));
        } catch (\Throwable $e) {
            \Log::warning('Failed to notify admin for redemption approval', [
                'redemption_id' => $event->redemption->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send confirmation to user
     */
    protected function sendUserConfirmation(RewardRedeemed $event): void
    {
        try {
            $user = $event->rewardUser->user;
            
            if ($user) {
                // Aquí se enviaría la confirmación
                // $user->notify(new RedemptionConfirmation($event->redemption));
            }
        } catch (\Throwable $e) {
            \Log::warning('Failed to send redemption confirmation', [
                'user_id' => $event->getUserId(),
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(RewardRedeemed $event, \Throwable $exception): void
    {
        \Log::error('Failed to handle RewardRedeemed event', [
            'user_id' => $event->getUserId(),
            'item' => $event->getItemName(),
            'error' => $exception->getMessage(),
        ]);
    }
}
