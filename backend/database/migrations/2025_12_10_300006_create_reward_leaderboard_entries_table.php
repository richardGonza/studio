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
        Schema::create('reward_leaderboard_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('leaderboard_id')->constrained('reward_leaderboards')->onDelete('cascade');
            $table->foreignId('reward_user_id')->constrained('reward_users')->onDelete('cascade');
            $table->integer('rank');
            $table->integer('value');
            $table->integer('previous_rank')->nullable();
            $table->date('period_start');
            $table->date('period_end');
            $table->timestamps();

            $table->unique(['leaderboard_id', 'reward_user_id', 'period_start']);
            $table->index(['leaderboard_id', 'period_start', 'rank']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reward_leaderboard_entries');
    }
};
