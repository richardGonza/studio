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
        Schema::create('reward_redemptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reward_user_id')->constrained('reward_users')->onDelete('cascade');
            $table->foreignId('catalog_item_id')->constrained('reward_catalog_items');
            $table->integer('points_spent');
            $table->string('status')->default('pending');  // pending, approved, rejected, delivered, cancelled
            $table->text('notes')->nullable();
            $table->json('delivery_info')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->index(['reward_user_id', 'status']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reward_redemptions');
    }
};
