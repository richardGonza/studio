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
        Schema::create('reward_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('level')->default(1);
            $table->integer('experience_points')->default(0);
            $table->integer('total_points')->default(0);        // Puntos canjeables
            $table->integer('lifetime_points')->default(0);     // Histórico
            $table->integer('current_streak')->default(0);
            $table->integer('longest_streak')->default(0);
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamp('streak_updated_at')->nullable();
            $table->json('preferences')->nullable();
            $table->timestamps();

            $table->unique('user_id');
            $table->index('level');
            $table->index('total_points');
            $table->index('current_streak');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reward_users');
    }
};
