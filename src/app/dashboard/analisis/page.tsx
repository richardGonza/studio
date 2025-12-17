'use client';

import api from '@/lib/axios';
import { useEffect, useState } from 'react';
import { Opportunity, Lead } from '@/lib/data';

// 1. DEFINICIÓN DE TIPOS (Interfaces)
// Define la estructura para que TypeScript sepa qué esperar de la relación anidada.

// Usamos los tipos globales de /lib/data.ts
type AnalisisItem = {
  id: number;
  reference: string;
  monto_credito: number;
  status: string;
  created_at: string;
  opportunity_id?: string;
  lead_id?: string;
  // Campos mapeados
  opportunity?: Opportunity;
  lead?: Lead;
};

export default function AnalisisPage() {
  const [analisisList, setAnalisisList] = useState<AnalisisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // 2. FETCH DE DATOS (Analisis, Oportunidades, Leads)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        // Fetch all in parallel
        const [analisisRes, oppsRes, leadsRes] = await Promise.all([
          api.get('/api/analisis'),
          api.get('/api/opportunities'),
          api.get('/api/leads'),
        ]);
        const analisisData = analisisRes.data as AnalisisItem[];
        // Opportunities may be paginated
        const oppsData = Array.isArray(oppsRes.data.data) ? oppsRes.data.data : oppsRes.data;
        const leadsData = Array.isArray(leadsRes.data.data) ? leadsRes.data.data : leadsRes.data;
        setOpportunities(oppsData);
        setLeads(leadsData);

        // Map opportunity and lead to each analisis item
        const mapped = analisisData.map((item) => {
          // Find opportunity by id (string or number)
          const opportunity = oppsData.find((o: Opportunity) => String(o.id) === String(item.opportunity_id));
          // Find lead by id (string or number)
          let lead: Lead | undefined = undefined;
          if (item.lead_id) {
            lead = leadsData.find((l: Lead) => String(l.id) === String(item.lead_id));
          } else if (opportunity && opportunity.lead) {
            lead = opportunity.lead;
          }
          return {
            ...item,
            opportunity,
            lead,
          };
        });
        setAnalisisList(mapped);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // 3. RENDERIZADO CONDICIONAL (Carga / Error)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Cargando análisis...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  // 4. TABLA PRINCIPAL
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Listado de Análisis</h1>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Referencia</th>
              <th className="px-6 py-3">Cliente (Lead)</th>
              
              {/* NUEVAS COLUMNAS SOLICITADAS */}
              <th className="px-6 py-3 bg-blue-50 text-blue-800">Profesión</th>
              <th className="px-6 py-3 bg-blue-50 text-blue-800">Puesto</th>
              <th className="px-6 py-3 bg-blue-50 text-blue-800">Estado Puesto</th>
              
              <th className="px-6 py-3">Monto</th>
              <th className="px-6 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {analisisList.length > 0 ? (
              analisisList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Referencia */}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.reference}
                  </td>

                  {/* Nombre del Lead */}
                  <td className="px-6 py-4 text-gray-700">
                    {item.lead?.name || 'Sin Asignar'}
                  </td>

                  {/* COLUMNA: Profesión (Acceso anidado) */}
                  <td className="px-6 py-4 text-gray-600">
                    {item.lead?.profesion || '-'}
                  </td>

                  {/* COLUMNA: Puesto */}
                  <td className="px-6 py-4 text-gray-600">
                    {item.lead?.puesto || '-'}
                  </td>

                  {/* COLUMNA: Estado Puesto */}
                  <td className="px-6 py-4 text-gray-600">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${item.lead?.estado_puesto === 'Fijo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                      {item.lead?.estado_puesto || 'N/A'}
                    </span>
                  </td>

                  {/* Monto (Formateado) */}
                  <td className="px-6 py-4 text-gray-700">
                    {new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(item.monto_credito)}
                  </td>

                  {/* Estado del Análisis */}
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold 
                      ${item.status === 'Aprobado' ? 'bg-green-100 text-green-700' : 
                        item.status === 'Rechazado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No hay análisis registrados aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}