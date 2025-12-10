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
        Schema::create('reward_badges', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('description');
            $table->string('icon');
            $table->foreignId('category_id')->nullable()->constrained('reward_badge_categories')->onDelete('set null');
            $table->enum('rarity', ['common', 'uncommon', 'rare', 'epic', 'legendary'])->default('common');
            $table->string('criteria_type');              // Tipo de evaluador
            $table->json('criteria_config')->nullable();  // Configuración JSON
            $table->integer('points_reward')->default(0);
            $table->integer('xp_reward')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_secret')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('criteria_type');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reward_badges');
    }
};
