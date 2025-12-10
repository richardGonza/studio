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
        Schema::table('persons', function (Blueprint $table) {
            $table->date('cedula_vencimiento')->nullable();
            $table->string('nivel_academico')->nullable();
            $table->string('puesto')->nullable();
            $table->string('profesion')->nullable();
            $table->string('sector')->nullable();

            // Work Address
            $table->string('trabajo_provincia')->nullable();
            $table->string('trabajo_canton')->nullable();
            $table->string('trabajo_distrito')->nullable();
            $table->text('trabajo_direccion')->nullable();

            // Institution details
            $table->text('institucion_direccion')->nullable();

            // Economic Activity
            $table->string('actividad_economica')->nullable();
            $table->string('tipo_sociedad')->nullable();
            $table->text('nombramientos')->nullable();
            $table->string('estado_puesto')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('persons', function (Blueprint $table) {
            $table->dropColumn([
                'cedula_vencimiento',
                'nivel_academico',
                'puesto',
                'profesion',
                'sector',
                'trabajo_provincia',
                'trabajo_canton',
                'trabajo_distrito',
                'trabajo_direccion',
                'institucion_direccion',
                'actividad_economica',
                'tipo_sociedad',
                'nombramientos',
                'estado_puesto',
            ]);
        });
    }
};
