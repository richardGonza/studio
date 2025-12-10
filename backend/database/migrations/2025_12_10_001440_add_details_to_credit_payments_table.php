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
        Schema::table('credit_payments', function (Blueprint $table) {
            $table->string('linea')->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_corte')->nullable();
            $table->decimal('tasa_actual', 5, 2)->nullable();
            $table->integer('plazo_actual')->nullable();
            $table->integer('dias')->nullable();
            $table->integer('dias_mora')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('credit_payments', function (Blueprint $table) {
            $table->dropColumn([
                'linea',
                'fecha_inicio',
                'fecha_corte',
                'tasa_actual',
                'plazo_actual',
                'dias',
                'dias_mora'
            ]);
        });
    }
};
