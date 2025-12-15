<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Credit extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'title',
        'status',
        'category',
        'progress',
        'lead_id',
        'opportunity_id',
        'assigned_to',
        'opened_at',
        'description',
        // New fields
        'tipo_credito',
        'numero_operacion',
        'monto_credito',
        'saldo', // <--- AGREGADO: Vital para el recálculo de deuda
        'cuota',
        'fecha_ultimo_pago',
        'garantia',
        'fecha_culminacion_credito',
        'tasa_anual',
        'plazo',
        'cuotas_atrasadas',
        'deductora_id'
    ];

    protected $casts = [
        'progress' => 'integer',
        'opened_at' => 'date',
        'fecha_ultimo_pago' => 'date',
        'fecha_culminacion_credito' => 'date',
        'monto_credito' => 'decimal:2',
        'saldo' => 'decimal:2', // <--- AGREGADO: Para manejo preciso de moneda
        'cuota' => 'decimal:2',
        'tasa_anual' => 'decimal:2',
    ];

    protected static function booted()
    {
        static::created(function ($credit) {
            // Aseguramos que al crear, el saldo inicial sea igual al monto del crédito
            if (!isset($credit->saldo)) {
                $credit->saldo = $credit->monto_credito;
                $credit->saveQuietly();
            }

            $credit->planDePagos()->create([
                'linea' => '1',
                'numero_cuota' => 0,
                'proceso' => ($credit->opened_at ?? now())->format('Ym'),
                'fecha_inicio' => $credit->opened_at ?? now(),
                'fecha_corte' => $credit->opened_at ?? now(),
                'fecha_pago' => null,
                'tasa_actual' => $credit->tasa_anual ?? 33.5,
                'plazo_actual' => $credit->plazo ?? 0,
                'cuota' => 0,
                'cargos' => 0,
                'poliza' => 0,
                'interes_corriente' => 0,
                'interes_moratorio' => 0,
                'amortizacion' => 0,
                'saldo_anterior' =>  0,
                'saldo_nuevo' => $credit->monto_credito ?? 0,
                'dias' => 0,
                'estado' => 'Vigente',
                'dias_mora' => 0,
                'fecha_movimiento' => $credit->opened_at ?? now(),
                'movimiento_total' => $credit->monto_credito ?? 0,
                'movimiento_cargos' => 0,
                'movimiento_poliza' => 0,
                'movimiento_interes_corriente' => 0,
                'movimiento_interes_moratorio' => 0,
                'movimiento_principal' => $credit->monto_credito ?? 0,
                'movimiento_caja_usuario' => 'Sistema',
                'tipo_documento' => 'Formalización',
                'numero_documento' => $credit->numero_operacion,
                'concepto' => 'Desembolso Inicial',
            ]);
        });
    }

    public function deductora()
    {
        return $this->belongsTo(Deductora::class);
    }

    public function planDePagos()
    {
        return $this->hasMany(PlanDePago::class);
    }

    public function payments()
    {
        return $this->hasMany(CreditPayment::class);
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class, 'lead_id');
    }

    public function opportunity()
    {
        return $this->belongsTo(Opportunity::class);
    }

    public function documents()
    {
        return $this->hasMany(CreditDocument::class);
    }
}
