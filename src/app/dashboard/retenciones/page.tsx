'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { investments, Investment } from '@/lib/data';
import Link from 'next/link';

/**
 * Componente de la página de Retenciones.
 * Permitirá generar y visualizar los reportes de retenciones.
 */
export default function RetencionesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Reporte de Retenciones</CardTitle>
                <CardDescription>
                Detalle de las retenciones aplicadas a los cupones de intereses de los inversionistas.
                </CardDescription>
            </div>
            <Button>
                <FileDown className="mr-2 h-4 w-4" />
                Generar Reporte
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <RetencionesTable />
      </CardContent>
    </Card>
  );
}

function RetencionesTable() {
    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Inversión</TableHead>
              <TableHead className="text-right">Monto Invertido</TableHead>
              <TableHead className="text-center">Interés (%)</TableHead>
              <TableHead>Moneda</TableHead>
              <TableHead>Periodicidad</TableHead>
              <TableHead>Fecha Pagado</TableHead>
              <TableHead className="text-right">Monto Retenido (15%)</TableHead>
              <TableHead className="text-right">Monto Pagado (Neto)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.filter(inv => inv.status === 'Activa').map((investment) => {
              const annualInterest = investment.amount * (investment.rate / 100);
              let periodsPerYear = 1;
              switch (investment.interestFrequency) {
                case 'Mensual':
                  periodsPerYear = 12;
                  break;
                case 'Trimestral':
                  periodsPerYear = 4;
                  break;
                case 'Semestral':
                  periodsPerYear = 2;
                  break;
                case 'Anual':
                  periodsPerYear = 1;
                  break;
              }
              const couponInterestBruto = annualInterest / periodsPerYear;
              const couponRetention = couponInterestBruto * 0.15;
              const couponPaymentNeto = couponInterestBruto - couponRetention;

              // Simulación de una fecha de pago para el ejemplo
              const paymentDate = new Date();
              paymentDate.setMonth(paymentDate.getMonth() -1);


              return (
                <TableRow key={investment.investmentNumber}>
                  <TableCell>
                    <Link href={`/dashboard/inversiones/${investment.investmentNumber}`} className="font-medium hover:underline">
                        {investment.investmentNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {new Intl.NumberFormat('es-CR', { style: 'currency', currency: investment.currency }).format(investment.amount)}
                  </TableCell>
                  <TableCell className="text-center font-mono">{investment.rate.toFixed(2)}%</TableCell>
                  <TableCell>{investment.currency}</TableCell>
                  <TableCell>{investment.interestFrequency}</TableCell>
                  <TableCell>{paymentDate.toLocaleDateString('es-CR')}</TableCell>
                  <TableCell className="text-right font-mono text-destructive">
                    -{new Intl.NumberFormat('es-CR', { style: 'currency', currency: investment.currency }).format(couponRetention)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold text-primary">
                    {new Intl.NumberFormat('es-CR', { style: 'currency', currency: investment.currency }).format(couponPaymentNeto)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
    );
}