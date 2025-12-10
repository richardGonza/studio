<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Credit;
use App\Models\CreditPayment;
use App\Models\Lead;
use App\Models\Person;
use Carbon\Carbon;

class DetailedCreditSeeder extends Seeder
{
    public function run()
    {
        // 1. Ensure we have a Lead/Client
        $lead = Lead::first();
        if (!$lead) {
            $lead = Lead::create([
                'name' => 'Juan Pérez',
                'email' => 'juan.perez@example.com',
                'phone' => '8888-8888',
                'status_id' => 1, // Assuming 1 exists, or we might need to check LeadStatus
                'source' => 'Web',
            ]);
        }

        // 2. Create or Update the Credit
        $operationNumber = 'CR-2023-055';

        $credit = Credit::where('numero_operacion', $operationNumber)->first();

        if (!$credit) {
            $credit = Credit::create([
                'reference' => 'REF-' . uniqid(),
                'title' => 'Préstamo Personal - Consolidación',
                'status' => 'Activo',
                'category' => 'Personal',
                'progress' => 25,
                'lead_id' => $lead->id,
                'assigned_to' => 'Asesor Principal',
                'opened_at' => Carbon::now()->subMonths(5),
                'description' => 'Crédito para consolidación de deudas.',

                // Detailed fields
                'tipo_credito' => 'Fiduciario',
                'numero_operacion' => $operationNumber,
                'monto_credito' => 5000000.00,
                'cuota' => 145000.00,
                'fecha_ultimo_pago' => Carbon::now()->subDays(15),
                'garantia' => 'Pagaré',
                'fecha_culminacion_credito' => Carbon::now()->addMonths(55),
                'tasa_anual' => 18.50,
                'plazo' => 60,
                'cuotas_atrasadas' => 0,
            ]);
        } else {
            // Update existing to match sample requirements if needed
            $credit->update([
                'monto_credito' => 5000000.00,
                'cuota' => 145000.00,
                'tasa_anual' => 18.50,
                'plazo' => 60,
            ]);
        }

        // 3. Create Payments (Plan de Pagos)
        // Clear existing payments for this credit to avoid duplicates
        CreditPayment::where('credit_id', $credit->id)->delete();

        $startDate = Carbon::now()->subMonths(5);
        $balance = 5000000.00;
        $rate = 18.50;
        $monthlyRate = $rate / 12 / 100;
        $term = 60;

        // Generate 5 past payments and 5 future payments as sample
        for ($i = 1; $i <= 10; $i++) {
            $fechaInicio = $startDate->copy()->addMonths($i - 1);
            $fechaCorte = $startDate->copy()->addMonths($i);
            $fechaPago = $i <= 5 ? $fechaCorte->copy()->addDays(rand(0, 5)) : null; // First 5 paid

            $days = $fechaInicio->diffInDays($fechaCorte);

            // Simple amortization calc
            $interest = $balance * $monthlyRate;
            $paymentAmount = 145000.00;
            $amortization = $paymentAmount - $interest;
            $newBalance = $balance - $amortization;

            $status = $i <= 5 ? 'Pagado' : 'Pendiente';
            $proceso = $i <= 5 ? 'Cobro Automático' : 'Proyección';

            CreditPayment::create([
                'credit_id' => $credit->id,
                'numero_cuota' => $i,
                'proceso' => $proceso,
                'fecha_cuota' => $fechaCorte->format('Y-m-d'),
                'fecha_pago' => $fechaPago ? $fechaPago->format('Y-m-d') : null,
                'cuota' => $paymentAmount,
                'cargos' => 0,
                'poliza' => 2500.00,
                'interes_corriente' => $interest,
                'interes_moratorio' => 0,
                'amortizacion' => $amortization,
                'saldo_anterior' => $balance,
                'nuevo_saldo' => $newBalance,
                'estado' => $status,
                'fecha_movimiento' => $fechaPago ? $fechaPago->format('Y-m-d') : null,
                'movimiento_total' => $fechaPago ? $paymentAmount : 0,

                // New Detailed Fields
                'linea' => 'LP-001',
                'fecha_inicio' => $fechaInicio->format('Y-m-d'),
                'fecha_corte' => $fechaCorte->format('Y-m-d'),
                'tasa_actual' => $rate,
                'plazo_actual' => $term - $i + 1,
                'dias' => $days,
                'dias_mora' => 0,
            ]);

            $balance = $newBalance;
        }

        $this->command->info("Credit $operationNumber seeded with payments.");
    }
}
