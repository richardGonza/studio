<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reward_challenge_participations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challenge_id')->constrained('reward_challenges')->onDelete('cascade');
            $table->foreignId('reward_user_id')->constrained('reward_users')->onDelete('cascade');
            $table->json('progress')->nullable();
            $table->timestamp('joined_at');
            $table->timestamp('completed_at')->nullable();
            $table->json('rewards_claimed')->nullable();
            $table->timestamps();

            $table->unique(['challenge_id', 'reward_user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reward_challenge_participations');
    }
};
