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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { investors, Investor } from '@/lib/data'; 
import Link from 'next/link';

export default function InversionistasPage() {

  const getStatusVariant = (status: Investor['status']) => {
    switch (status) {
        case 'Activo': return 'default';
        case 'Inactivo': return 'secondary';
        default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inversionistas</CardTitle>
            <CardDescription>
              Gestiona los inversionistas de Credipep.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Agregar Inversionista
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Inversionista</TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead className="hidden md:table-cell">Contacto</TableHead>
              <TableHead>Inversiones Activas</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden md:table-cell">
                Registrado El
              </TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investors.map((investor) => (
              <InvestorTableRow key={investor.id} investor={investor} getStatusVariant={getStatusVariant} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface InvestorTableRowProps {
  investor: Investor;
  getStatusVariant: (status: Investor['status']) => 'default' | 'secondary' | 'outline';
}

const InvestorTableRow = React.memo(function InvestorTableRow({ investor, getStatusVariant }: InvestorTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={investor.avatarUrl} alt={investor.name} />
            <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{investor.name}</div>
        </div>
      </TableCell>
      <TableCell>{investor.cedula}</TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="text-sm text-muted-foreground">
          {investor.email}
        </div>
        <div className="text-sm text-muted-foreground">
          {investor.phone}
        </div>
      </TableCell>
      <TableCell>
        <Button variant="link" asChild>
          <Link
            href={`/dashboard/inversiones?investorId=${encodeURIComponent(
              investor.cedula
            )}`}
          >
            <Badge variant="default">{investor.activeInvestments}</Badge>
          </Link>
        </Button>
      </TableCell>
      <TableCell>
        {investor.status &&
            <Badge variant={getStatusVariant(investor.status)}>
              {investor.status}
            </Badge>
        }
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {investor.registeredOn}
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
            <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
            <DropdownMenuItem>Crear Inversión</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});
