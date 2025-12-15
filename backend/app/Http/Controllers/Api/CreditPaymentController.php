<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CreditPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Credit;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Csv;

class CreditPaymentController extends Controller
{
    /**
     * Listar todos los pagos (Historial)
     */
    public function index()
    {
        $payments = CreditPayment::with('credit.lead')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($payments);
    }

    /**
     * Registrar un pago Manual (Ventanilla / General)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'credit_id' => 'required|exists:credits,id',
            'monto'     => 'required|numeric|min:0.01',
            'fecha'     => 'required|date',
            'origen'    => 'nullable|string',
        ]);

        $credit = Credit::findOrFail($validated['credit_id']);

        $payment = DB::transaction(function () use ($credit, $validated) {
            return $this->processPaymentTransaction(
                $credit,
                $validated['monto'],
                $validated['fecha'],
                $validated['origen'] ?? 'Ventanilla',
                $credit->lead->cedula ?? null
            );
        });

        return response()->json([
            'message' => 'Pago aplicado correctamente',
            'payment' => $payment,
            'credit_summary' => [
                'saldo_credito' => $credit->saldo
            ]
        ], 201);
    }

    /**
     * Adelanto de cuotas
     */
    public function adelanto(Request $request)
    {
        $validated = $request->validate([
            'credit_id' => 'required|exists:credits,id',
            'tipo'      => 'nullable|string',
            'monto'     => 'required|numeric|min:0.01',
            'fecha'     => 'required|date',
        ]);

        $credit = Credit::findOrFail($validated['credit_id']);

        $payment = DB::transaction(function () use ($credit, $validated) {
            return $this->processPaymentTransaction(
                $credit,
                $validated['monto'],
                $validated['fecha'],
                'Adelanto',
                $credit->lead->cedula ?? null
            );
        });

        return response()->json([
            'message' => 'Adelanto aplicado y saldos recalculados',
            'payment' => $payment,
            'nuevo_saldo_credito' => $credit->saldo
        ]);
    }

    /**
     * Lógica "Cascada" (Waterfall)
     * - Imputa pagos a columnas de movimiento.
     * - Maneja parciales.
     * - SIN ACUMULACIÓN DE EXCEDENTES (El sobrante se ignora/pierde del saldo a favor).
     */
    private function processPaymentTransaction(Credit $credit, $montoEntrante, $fecha, $source, $cedulaRef = null)
    {
        $dineroDisponible = $montoEntrante;

        $cuotas = $credit->planDePagos()
            ->where('estado', '!=', 'Pagado')
            ->where('numero_cuota', '>', 0)
            ->orderBy('numero_cuota', 'asc')
            ->get();

        $primerCuotaAfectada = null;
        $saldoAnteriorSnapshot = 0;

        $saldoCreditoAntes = $credit->planDePagos()->sum(DB::raw('amortizacion - movimiento_principal'));

        foreach ($cuotas as $cuota) {
            if ($dineroDisponible <= 0.005) break;

            if (!$primerCuotaAfectada) {
                $primerCuotaAfectada = $cuota;
                $saldoAnteriorSnapshot = ($cuota->cuota + $cuota->cargos + $cuota->interes_moratorio) - $cuota->movimiento_total;
            }

            // --- A. Calcular Deuda Pendiente por Conceptos ---
            $pendienteMora = max(0.0, $cuota->interes_moratorio - $cuota->movimiento_interes_moratorio);
            $pendienteInteres = max(0.0, $cuota->interes_corriente - $cuota->movimiento_interes_corriente);
            $pendienteCargos = max(0.0, ($cuota->cargos + $cuota->poliza) - ($cuota->movimiento_cargos + $cuota->movimiento_poliza));
            $pendientePrincipal = max(0.0, $cuota->amortizacion - $cuota->movimiento_principal);

            // --- B. Aplicar Pagos ---

            // Mora
            $pagoMora = min($dineroDisponible, $pendienteMora);
            $cuota->movimiento_interes_moratorio += $pagoMora;
            $dineroDisponible -= $pagoMora;

            // Interés
            $pagoInteres = 0;
            if ($dineroDisponible > 0) {
                $pagoInteres = min($dineroDisponible, $pendienteInteres);
                $cuota->movimiento_interes_corriente += $pagoInteres;
                $dineroDisponible -= $pagoInteres;
            }

            // Cargos
            $pagoCargos = 0;
            if ($dineroDisponible > 0) {
                $pagoCargos = min($dineroDisponible, $pendienteCargos);
                $cuota->movimiento_cargos += $pagoCargos;
                $dineroDisponible -= $pagoCargos;
            }

            // Capital
            $pagoPrincipal = 0;
            if ($dineroDisponible > 0) {
                $pagoPrincipal = min($dineroDisponible, $pendientePrincipal);
                $cuota->movimiento_principal += $pagoPrincipal;
                $dineroDisponible -= $pagoPrincipal;
            }

            // --- C. Actualizar Totales ---
            $totalPagadoEnEstaTransaccion = $pagoMora + $pagoInteres + $pagoCargos + $pagoPrincipal;
            $cuota->movimiento_total += $totalPagadoEnEstaTransaccion;
            $cuota->fecha_movimiento = $fecha;

            $totalExigible = $cuota->cuota + $cuota->interes_moratorio + $cuota->cargos + $cuota->poliza;

            if ($cuota->movimiento_total >= ($totalExigible - 0.05)) {
                $cuota->estado = 'Pagado';
                $cuota->fecha_pago = $fecha;
            } else {
                $cuota->estado = 'Parcial';
            }

            $cuota->save();
        }

        // --- SE ELIMINÓ EL BLOQUE DE SALDO A FAVOR ---
        // Si sobra dinero ($dineroDisponible > 0), no hacemos nada con él en el modelo Credit.

        // 5. Recalcular Saldo Global
        $totalAmortizado = $credit->planDePagos()->sum('movimiento_principal');
        $credit->saldo = max(0.0, $credit->monto_credito - $totalAmortizado);

        $credit->save();

        // 6. Generar Recibo
        $paymentRecord = CreditPayment::create([
            'credit_id'      => $credit->id,
            'numero_cuota'   => $primerCuotaAfectada ? $primerCuotaAfectada->numero_cuota : 0,
            'fecha_cuota'    => $primerCuotaAfectada ? $primerCuotaAfectada->fecha_corte : null,
            'fecha_pago'     => $fecha,
            'monto'          => $montoEntrante,
            'cuota'          => $saldoAnteriorSnapshot,
            'saldo_anterior' => $saldoCreditoAntes,
            'nuevo_saldo'    => $credit->saldo,
            'estado'         => 'Aplicado',
            'interes_corriente' => $credit->planDePagos()->sum('movimiento_interes_corriente'),
            'amortizacion'      => $credit->planDePagos()->sum('movimiento_principal'),
            'source'            => $source,
            'movimiento_total'  => $dineroDisponible > 0 ? $dineroDisponible : 0, // Info de sobrante en el recibo (opcional)
            'cedula'            => $cedulaRef
        ]);

        return $paymentRecord;
    }

    /**
     * Carga masiva (Sin cambios lógicos, solo usa el processPaymentTransaction actualizado)
     */
    public function upload(Request $request)
    {
        // ... (Mismo código de upload que tenías, llamará a la versión sin saldo a favor)
        $validated = $request->validate([ 'file' => 'required|file' ]);
        $file = $request->file('file');
        $path = $file->store('uploads/planillas', 'public');
        $fullPath = storage_path('app/public/' . $path);
        $results = [];
        $delimiter = ',';

        try {
            $readerType = IOFactory::identify($fullPath);
            $reader = IOFactory::createReader($readerType);
            if ($readerType === 'Csv') {
                $handle = fopen($fullPath, 'r');
                if ($handle) {
                    $sample = ''; $lineCount = 0;
                    while (($line = fgets($handle)) !== false && $lineCount < 5) { $sample .= $line; $lineCount++; }
                    fclose($handle);
                    if (substr_count($sample, ';') > substr_count($sample, ',')) $delimiter = ';';
                }
                if ($reader instanceof Csv) $reader->setDelimiter($delimiter);
            }
            $spreadsheet = $reader->load($fullPath);
            $rows = $spreadsheet->getActiveSheet()->toArray(null, true, true, true);
            $header = reset($rows);
            $montoCol = null; $cedulaCol = null;
            foreach ($header as $col => $val) {
                $v = mb_strtolower(trim((string)$val));
                if (str_contains($v, 'monto')) $montoCol = $col;
                if (str_contains($v, 'cedula') || str_contains($v, 'cédula')) $cedulaCol = $col;
            }
            if (!$montoCol || !$cedulaCol || $montoCol === $cedulaCol) {
                return response()->json(['message' => 'Error de columnas'], 422);
            }
            $rowIndex = 0;
            foreach ($rows as $row) {
                $rowIndex++;
                if ($rowIndex === 1) continue;
                $rawCedula = trim((string)($row[$cedulaCol] ?? ''));
                $rawMonto  = trim((string)($row[$montoCol] ?? ''));
                $cleanCedula = preg_replace('/[^0-9]/', '', $rawCedula);
                if ($cleanCedula === '' || $rawMonto === '') {
                    $results[] = ['cedula' => $rawCedula, 'status' => 'skipped']; continue;
                }
                $credit = Credit::whereHas('lead', function($q) use ($rawCedula, $cleanCedula) {
                    $q->where('cedula', $rawCedula)->orWhere('cedula', $cleanCedula);
                })->first();
                if ($credit) {
                    $montoPagado = (float) preg_replace('/[^0-9\.]/', '', str_replace(',', '.', $rawMonto));
                    if ($montoPagado > 0) {
                        $payment = DB::transaction(function () use ($credit, $montoPagado, $rawCedula) {
                            return $this->processPaymentTransaction($credit, $montoPagado, now(), 'Planilla', $rawCedula);
                        });
                        if ($payment) {
                            $results[] = ['cedula' => $rawCedula, 'monto' => $montoPagado, 'status' => 'applied', 'lead' => $credit->lead->name ?? 'N/A'];
                        } else {
                            $results[] = ['cedula' => $rawCedula, 'status' => 'paid_or_error'];
                        }
                    } else { $results[] = ['cedula' => $rawCedula, 'status' => 'zero_amount']; }
                } else { $results[] = ['cedula' => $rawCedula, 'status' => 'not_found']; }
            }
            return response()->json(['message' => 'Proceso completado', 'results' => $results]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(string $id) { return response()->json([], 200); }
    public function update(Request $request, string $id) { return response()->json([], 200); }
    public function destroy(string $id) { return response()->json([], 200); }
}
