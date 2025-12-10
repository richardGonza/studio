'use client';

import React, { useState, useEffect, use } from 'react';
import {
  ArrowLeft,
  Paperclip,
  FileText,
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
  ClipboardCheck,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/axios';
import { CaseChat } from '@/components/case-chat';

// Interfaces
interface CreditDocument {
  id: number;
  credit_id: number;
  name: string;
  notes: string | null;
  url?: string | null;
  path?: string | null;
  mime_type?: string | null;
  size?: number | null;
  created_at: string;
  updated_at: string;
}

interface CreditPayment {
  id: number;
  credit_id: number;
  numero_cuota: number;
  proceso: string | null;
  fecha_cuota: string;
  fecha_pago: string | null;
  cuota: number;
  cargos: number;
  poliza: number;
  interes_corriente: number;
  interes_moratorio: number;
  amortizacion: number;
  saldo_anterior: number;
  nuevo_saldo: number;
  estado: string;
  fecha_movimiento: string | null;
  movimiento_total: number;
  // New fields
  linea?: string | null;
  fecha_inicio?: string | null;
  fecha_corte?: string | null;
  tasa_actual?: number | null;
  plazo_actual?: number | null;
  dias?: number | null;
  dias_mora?: number | null;
}

interface ClientOption {
  id: number;
  name: string;
  cedula: string;
  email: string;
  phone: string;
  ocupacion?: string;
  departamento_cargo?: string;
}

interface CreditItem {
  id: number;
  reference: string;
  title: string;
  status: string | null;
  category: string | null;
  assigned_to: string | null;
  progress: number;
  opened_at: string | null;
  description: string | null;
  lead_id: number;
  opportunity_id: string | null;
  client?: ClientOption | null;
  opportunity?: { id: string; title: string | null } | null;
  created_at?: string | null;
  updated_at?: string | null;
  documents?: CreditDocument[];
  payments?: CreditPayment[];
  tipo_credito?: string | null;
  numero_operacion?: string | null;
  monto_credito?: number | null;
  cuota?: number | null;
  fecha_ultimo_pago?: string | null;
  garantia?: string | null;
  fecha_culminacion_credito?: string | null;
  tasa_anual?: number | null;
  plazo?: number | null;
  cuotas_atrasadas?: number | null;
  deductora?: { id: number; nombre: string } | null;
  divisa?: string | null;
  linea?: string | null;
  primera_deduccion?: string | null;
  saldo?: number | null;
  proceso?: string | null;
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("es-CR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

function formatCurrency(amount?: number | null): string {
  if (amount === null || amount === undefined) return "0.00";
  return new Intl.NumberFormat('es-CR', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

function CreditDetailClient({ id }: { id: string }) {
  const [credit, setCredit] = useState<CreditItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState('pagare');

  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const response = await api.get(`/api/credits/${id}`);
        setCredit(response.data);
      } catch (error) {
        console.error("Error fetching credit:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCredit();
  }, [id]);

  if (loading) {
    return <div className="flex h-full items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!credit) {
    return (
      <div className="text-center p-8">
        <p className="text-lg">Crédito no encontrado</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/creditos">Volver a Créditos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/creditos">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver a Créditos</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">
            Detalle del Crédito: {credit.numero_operacion || credit.reference}
          </h1>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPanelVisible(!isPanelVisible)}
              >
                {isPanelVisible ? (
                  <PanelRightClose className="h-4 w-4" />
                ) : (
                  <PanelRightOpen className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle Panel</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isPanelVisible ? 'Ocultar Panel' : 'Mostrar Panel'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className={isPanelVisible ? 'space-y-6 lg:col-span-3' : 'space-y-6 lg:col-span-5'}>
          {/* Main Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>
                    <Link href={`/dashboard/clientes/${credit.lead_id}`} className="hover:underline">
                      {credit.client?.name || "Cliente Desconocido"}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    Institución: {credit.client?.ocupacion || "-"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={credit.status === 'Activo' ? 'default' : 'secondary'}>
                    {credit.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="grid gap-1">
                <h3 className="font-medium">Monto Otorgado</h3>
                <p className="text-muted-foreground">
                  ₡{formatCurrency(credit.monto_credito)}
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="font-medium">Saldo Actual</h3>
                <p className="font-semibold text-primary">
                  ₡{formatCurrency(credit.saldo)}
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="font-medium">Cuota Mensual</h3>
                <p className="text-muted-foreground">
                  ₡{formatCurrency(credit.cuota)}
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="font-medium">Tasa / Plazo</h3>
                <p className="text-muted-foreground">
                  {credit.tasa_anual}% / {credit.plazo} meses
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="font-medium">Cuotas Atrasadas</h3>
                <p className="font-semibold text-destructive">
                  {credit.cuotas_atrasadas || 0}
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="font-medium">Entidad Deductora</h3>
                <p className="text-muted-foreground">{credit.deductora?.nombre || "-"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Plan de Pagos Table */}
          <Card>
            <CardHeader>
              <CardTitle>Plan de Pagos</CardTitle>
              <CardDescription>Detalle de cuotas y movimientos</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="whitespace-nowrap text-xs">Línea</TableHead>
                    <TableHead className="whitespace-nowrap text-xs">No. Cuota</TableHead>
                    <TableHead className="whitespace-nowrap text-xs">Proceso</TableHead>
                    <TableHead className="whitespace-nowrap text-xs">Fecha Inicio</TableHead>
                    <TableHead className="whitespace-nowrap text-xs">Fecha Corte</TableHead>
                    <TableHead className="whitespace-nowrap text-xs">Fecha Pago</TableHead>
                    <TableHead className="whitespace-nowrap text-xs">Tasa Actual</TableHead>
                    <TableHead className="whitespace-nowrap text-xs">Plazo Actual</TableHead>
                    <TableHead className="whitespace-nowrap text-xs text-right">Cuota</TableHead>
                    <TableHead className="whitespace-nowrap text-xs text-right">Cargos</TableHead>
                    <TableHead className="whitespace-nowrap text-xs text-right">Póliza</TableHead>
                    <TableHead className="whitespace-nowrap text-xs text-right">Int. Corriente</TableHead>
                    <TableHead className="whitespace-nowrap text-xs text-right">Int. Moratorio</TableHead>
                    <TableHead className="whitespace-nowrap text-xs text-right">Amortización</TableHead>
                    <TableHead className="whitespace-nowrap text-xs text-right">Saldo Anterior</TableHead>
                    <TableHead className="whitespace-nowrap text-xs text-right">Saldo Nuevo</TableHead>
                    <TableHead className="whitespace-nowrap text-xs">Días</TableHead>
                    <TableHead className="whitespace-nowrap text-xs">Estado</TableHead>
                    <TableHead className="whitespace-nowrap text-xs">Mora (Días)</TableHead>
                    <TableHead className="whitespace-nowrap text-xs">Fecha Mov.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credit.payments && credit.payments.length > 0 ? (
                    credit.payments.map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-muted/50">
                        <TableCell className="text-xs font-mono">{payment.linea || "-"}</TableCell>
                        <TableCell className="text-xs text-center">{payment.numero_cuota}</TableCell>
                        <TableCell className="text-xs">{payment.proceso || "-"}</TableCell>
                        <TableCell className="text-xs">{formatDate(payment.fecha_inicio)}</TableCell>
                        <TableCell className="text-xs">{formatDate(payment.fecha_corte)}</TableCell>
                        <TableCell className="text-xs">{formatDate(payment.fecha_pago)}</TableCell>
                        <TableCell className="text-xs text-center">{payment.tasa_actual || "-"}</TableCell>
                        <TableCell className="text-xs text-center">{payment.plazo_actual || "-"}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{formatCurrency(payment.cuota)}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{formatCurrency(payment.cargos)}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{formatCurrency(payment.poliza)}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{formatCurrency(payment.interes_corriente)}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{formatCurrency(payment.interes_moratorio)}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{formatCurrency(payment.amortizacion)}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{formatCurrency(payment.saldo_anterior)}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{formatCurrency(payment.nuevo_saldo)}</TableCell>
                        <TableCell className="text-xs text-center">{payment.dias || "-"}</TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-[10px] h-5">
                            {payment.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-center">{payment.dias_mora || "0"}</TableCell>
                        <TableCell className="text-xs">{formatDate(payment.fecha_movimiento)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={20} className="text-center py-8 text-muted-foreground">
                        No hay pagos registrados para este crédito.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                Archivos del Crédito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {credit.documents?.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(file.created_at)}
                        </p>
                      </div>
                    </div>
                    {file.url && (
                        <Button variant="outline" size="sm" asChild>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">Descargar</a>
                        </Button>
                    )}
                  </li>
                ))}
                {(!credit.documents || credit.documents.length === 0) && (
                    <li className="text-sm text-muted-foreground text-center py-2">No hay documentos adjuntos.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        {isPanelVisible && (
          <div className="space-y-6 lg:col-span-2">
            <Card className="h-[calc(100vh-12rem)]">
              <Tabs defaultValue="comunicaciones" className="flex h-full flex-col">
                <TabsList className="m-2">
                  <TabsTrigger value="comunicaciones" className="gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Comunicaciones
                  </TabsTrigger>
                  <TabsTrigger value="tareas" className="gap-1">
                    <ClipboardCheck className="h-4 w-4" />
                    Tareas
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="comunicaciones"
                  className="flex-1 overflow-y-auto"
                >
                  <CaseChat conversationId={credit.reference} />
                </TabsContent>
                <TabsContent value="tareas" className="flex-1 overflow-y-auto p-4">
                  <div className="text-center text-sm text-muted-foreground">
                    Funcionalidad de tareas en desarrollo.
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreditDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <CreditDetailClient id={id} />
}
