'use client';

import React from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

const getStatusVariant = (status: Investment['status']) => {
  switch (status) {
    case 'Activa':
      return 'default';
    case 'Finalizada':
      return 'secondary';
    case 'Liquidada':
      return 'outline';
    default:
      return 'default';
  }
};

export default function InversionesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Inversiones</CardTitle>
                <CardDescription>Gestiona todas las inversiones de capital.</CardDescription>
            </div>
            <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Agregar Inversión
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead># Inversión</TableHead>
              <TableHead>Inversionista</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead>Moneda</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden md:table-cell">Fecha Final</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((investment) => (
              <InvestmentTableRow key={investment.investmentNumber} investment={investment} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function InvestmentTableRow({ investment }: { investment: Investment }) {
  return (
      <TableRow className="hover:bg-muted/50">
        <TableCell>
          <Link
            href={`/dashboard/inversiones/${investment.investmentNumber}`}
            className="font-medium hover:underline"
          >
            {investment.investmentNumber}
          </Link>
        </TableCell>
        <TableCell>
            <div className="font-medium">{investment.investorName}</div>
            <div className="text-sm text-muted-foreground">{investment.investorId}</div>
        </TableCell>
        <TableCell className="text-right font-mono">
          {investment.amount.toLocaleString('de-DE')}
        </TableCell>
        <TableCell>
          <Badge variant="outline">{investment.currency}</Badge>
        </TableCell>
        <TableCell>
          <Badge variant={getStatusVariant(investment.status)}>
            {investment.status}
          </Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {investment.endDate}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Alternar menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/inversiones/${investment.investmentNumber}`}>
                  Ver Detalles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Ver Cupones</DropdownMenuItem>
              <DropdownMenuItem>Liquidar Anticipadamente</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
  );
}
