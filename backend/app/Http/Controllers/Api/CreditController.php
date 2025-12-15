<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Credit;
use App\Models\CreditDocument;
use App\Models\PlanDePago; // Importante: Modelo del plan
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CreditController extends Controller
{
    /**
     * Listar créditos con filtros
     */
    public function index(Request $request)
    {
        $query = Credit::with(['lead', 'opportunity', 'documents']);

        if ($request->has('lead_id')) {
            $query->where('lead_id', $request->lead_id);
        }

        return response()->json($query->latest()->get());
    }

    /**
     * Crear Crédito y Generar Tabla de Amortización (Sistema Francés)
     */
    public function store(Request $request)
    {
        // 1. Validaciones
        $validated = $request->validate([
            'reference' => 'required|unique:credits,reference',
            'title' => 'required|string',
            'status' => 'required|string',
            'category' => 'nullable|string',
            'lead_id' => 'required|exists:persons,id',
            'opportunity_id' => 'nullable|exists:opportunities,id',
            'assigned_to' => 'nullable|string',
            'opened_at' => 'nullable|date',
            'description' => 'nullable|string',
            'tipo_credito' => 'nullable|string',
            'numero_operacion' => 'nullable|string|unique:credits,numero_operacion',
            'deductora_id' => 'nullable|exists:deductoras,id',
            'divisa' => 'nullable|string',
            // Campos requeridos para el cálculo financiero
            'monto_credito' => 'required|numeric|min:1',
            'plazo' => 'required|integer|min:1',
            'tasa_anual' => 'nullable|numeric',
            'fecha_primera_cuota' => 'nullable|date',
        ]);

        // 2. Definir Tasa por defecto si no viene (33.5% anual según ejemplo)
        if (!isset($validated['tasa_anual'])) {
            $validated['tasa_anual'] = 33.50;
        }

        // 3. Transacción de Base de Datos
        $credit = DB::transaction(function () use ($validated) {

            // A. Crear la Cabecera del Crédito
            $credit = Credit::create($validated);

            // B. Generar la Tabla de Amortización (Lógica Francesa)
            $this->generateAmortizationSchedule($credit);

            // C. Copiar documentos del Lead al Crédito
            $lead = Lead::with('documents')->find($validated['lead_id']);
            if ($lead && $lead->documents->count() > 0) {
                foreach ($lead->documents as $leadDocument) {
                    $credit->documents()->create([
                        'name' => $leadDocument->name,
                        'notes' => $leadDocument->notes,
                        'path' => $leadDocument->path,
                        'url' => $leadDocument->url,
                        'mime_type' => $leadDocument->mime_type,
                        'size' => $leadDocument->size,
                    ]);
                }
            }

            return $credit;
        });

        return response()->json($credit->load('planDePagos'), 201);
    }

    /**
     * MOTOR DE CÁLCULO: Genera las cuotas niveladas.
     * Llena todas las columnas requeridas por el Frontend (tsx).
     */
    private function generateAmortizationSchedule(Credit $credit)
    {
        $monto = (float) $credit->monto_credito;
        $plazo = (int) $credit->plazo;
        $tasaAnual = (float) $credit->tasa_anual;

        // Tasa Mensual Decimal (Ej: 29.75% -> 0.2975 -> /12)
        $tasaMensual = ($tasaAnual / 100) / 12;

        // --- 1. Cálculo de Cuota Fija (PMT) ---
        if ($tasaMensual > 0) {
            $potencia = pow(1 + $tasaMensual, $plazo);
            $cuotaFija = $monto * ($tasaMensual * $potencia) / ($potencia - 1);
        } else {
            // Caso borde: tasa 0%
            $cuotaFija = $monto / $plazo;
        }

        // Redondeo financiero estándar
        $cuotaFija = round($cuotaFija, 2);

        // Guardar la cuota calculada en el padre
        if (!$credit->cuota) {
            $credit->cuota = $cuotaFija;
            $credit->save();
        }

        $saldoPendiente = $monto;
        // Fecha base: o la seleccionada o la de apertura o hoy
        $fechaCobro = $credit->fecha_primera_cuota
            ? Carbon::parse($credit->fecha_primera_cuota)
            : ($credit->opened_at ? Carbon::parse($credit->opened_at) : now());

        // --- 2. Generación del Bucle ---
        for ($i = 1; $i <= $plazo; $i++) {

            // Cálculos del periodo
            $interesMes = round($saldoPendiente * $tasaMensual, 2);

            // Ajuste final para la última cuota (Evitar saldo -0.01 o 0.01)
            if ($i == $plazo) {
                $amortizacionMes = $saldoPendiente;
                $cuotaFija = $saldoPendiente + $interesMes; // La última cuota absorbe la diferencia
            } else {
                $amortizacionMes = $cuotaFija - $interesMes;
            }

            $nuevoSaldo = round($saldoPendiente - $amortizacionMes, 2);

            // Manejo de fechas (Mes a mes)
            $fechaInicio = $fechaCobro->copy();
            $fechaCobro->addMonth();

            // Crear registro en plan_de_pagos con TODAS las columnas del frontend
            PlanDePago::create([
                'credit_id' => $credit->id,
                'numero_cuota' => $i,
                'linea' => $credit->category ?? 'General',

                // Datos de Proceso
                'proceso' => 'Generado',
                'fecha_inicio' => $fechaInicio,
                'fecha_corte' => $fechaCobro,
                'fecha_pago' => null, // null para que el front muestre "-"

                // Valores Financieros Planificados
                'tasa_actual' => $tasaAnual,
                'plazo_actual' => $plazo,
                'cuota' => $cuotaFija,
                'cargos' => 0,
                'poliza' => 0,
                'interes_corriente' => $interesMes,
                'interes_moratorio' => 0,
                'amortizacion' => $amortizacionMes,
                'saldo_anterior' => $saldoPendiente,
                'saldo_nuevo' => max(0, $nuevoSaldo), // Seguridad visual

                // Estado
                'dias' => 30,
                'estado' => 'Pendiente',
                'dias_mora' => 0,

                // Columnas de Movimiento (Inicializadas en 0/null)
                'fecha_movimiento' => null,
                'movimiento_total' => 0,
                'movimiento_cargos' => 0,
                'movimiento_poliza' => 0,
                'movimiento_interes_corriente' => 0,
                'movimiento_interes_moratorio' => 0,
                'movimiento_principal' => 0,
                'movimiento_caja_usuario' => null,

                // Metadatos
                'tipo_documento' => null,
                'numero_documento' => null,
                'concepto' => 'Cuota Mensual',
            ]);

            // Actualizar saldo para la siguiente iteración
            $saldoPendiente = $nuevoSaldo;
        }
    }

    /**
     * Mostrar Crédito con relaciones (Plan ordenado)
     */
    public function show($id)
    {
        $credit = Credit::with([
            'lead.documents',
            'opportunity',
            'documents',
            'payments',
            // Ordenar el plan para que salga 1, 2, 3... en la tabla
            'planDePagos' => function($q) {
                $q->orderBy('numero_cuota', 'asc');
            }
        ])->findOrFail($id);

        // Recalcular saldo actual basado en pagos
        $lastPayment = $credit->payments()
            ->where('estado', 'Pagado')
            ->orderBy('numero_cuota', 'desc')
            ->first();

        $credit->saldo = $lastPayment ? $lastPayment->nuevo_saldo : $credit->monto_credito;

        return response()->json($credit);
    }

    /**
     * Resumen de Saldos (Dashboard)
     */
    public function balance($id)
    {
        $credit = Credit::with(['payments', 'lead'])->findOrFail($id);

        $payments = $credit->payments;
        $paidPayments = $payments->where('estado', 'Pagado');

        $totalPrincipalPaid = $paidPayments->sum('amortizacion');
        $totalInterestPaid = $paidPayments->sum('interes_corriente') + $paidPayments->sum('interes_moratorio');
        $totalPaid = $paidPayments->sum('cuota');

        $lastPayment = $paidPayments->sortByDesc('numero_cuota')->first();
        $currentBalance = $lastPayment ? $lastPayment->nuevo_saldo : $credit->monto_credito;

        $nextPayment = $payments->where('estado', '!=', 'Pagado')->sortBy('numero_cuota')->first();

        return response()->json([
            'credit_id' => $credit->id,
            'numero_operacion' => $credit->numero_operacion,
            'client_name' => $credit->lead ? $credit->lead->name : 'N/A',
            'monto_original' => $credit->monto_credito,
            'saldo_actual' => $currentBalance,
            'total_capital_pagado' => $totalPrincipalPaid,
            'total_intereses_pagados' => $totalInterestPaid,
            'total_pagado' => $totalPaid,
            'fecha_ultimo_pago' => $lastPayment ? $lastPayment->fecha_pago : null,
            'proximo_pago' => $nextPayment ? [
                'fecha' => $nextPayment->fecha_cuota,
                'monto' => $nextPayment->cuota
            ] : null,
            'progreso_pagos' => $credit->plazo > 0 ? round(($paidPayments->count() / $credit->plazo) * 100, 2) : 0,
        ]);
    }

    /**
     * Actualizar Cabecera de Crédito
     */
    public function update(Request $request, $id)
    {
        $credit = Credit::findOrFail($id);

        $validated = $request->validate([
            'reference' => 'sometimes|required|unique:credits,reference,' . $id,
            'title' => 'sometimes|required|string',
            'status' => 'sometimes|required|string',
            'category' => 'nullable|string',
            'progress' => 'integer|min:0|max:100',
            'lead_id' => 'sometimes|required|exists:persons,id',
            'opportunity_id' => 'nullable|exists:opportunities,id',
            'assigned_to' => 'nullable|string',
            'opened_at' => 'nullable|date',
            'description' => 'nullable|string',
            'tipo_credito' => 'nullable|string',
            'numero_operacion' => 'nullable|string|unique:credits,numero_operacion,' . $id,
            'monto_credito' => 'nullable|numeric',
            'cuota' => 'nullable|numeric',
            'fecha_ultimo_pago' => 'nullable|date',
            'garantia' => 'nullable|string',
            'fecha_culminacion_credito' => 'nullable|date',
            'tasa_anual' => 'nullable|numeric',
            'plazo' => 'nullable|integer',
            'cuotas_atrasadas' => 'nullable|integer',
            'deductora_id' => 'nullable|exists:deductoras,id',
        ]);

        $credit->update($validated);

        return response()->json($credit);
    }

    public function destroy($id)
    {
        $credit = Credit::findOrFail($id);
        $credit->delete();
        return response()->json(null, 204);
    }

    // --- Gestión de Documentos ---

    public function documents($id)
    {
        $credit = Credit::findOrFail($id);
        return response()->json($credit->documents);
    }

    public function storeDocument(Request $request, $id)
    {
        $credit = Credit::findOrFail($id);

        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'name' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $file = $request->file('file');
        $path = $file->store('credit-documents/' . $credit->id, 'public');

        $document = $credit->documents()->create([
            'name' => $request->name,
            'notes' => $request->notes,
            'path' => $path,
            'url' => asset(Storage::url($path)),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json($document, 201);
    }

    public function destroyDocument($id, $documentId)
    {
        $document = CreditDocument::where('credit_id', $id)->findOrFail($documentId);

        if (Storage::disk('public')->exists($document->path)) {
            Storage::disk('public')->delete($document->path);
        }

        $document->delete();

        return response()->json(null, 204);
    }
}
