'use client';
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
import { clients, Client } from '@/lib/data';
import Link from 'next/link';

export default function ClientesPage() {

  const getStatusVariant = (status: Client['clientStatus']) => {
    switch (status) {
        case 'Activo': return 'default';
        case 'Moroso': return 'destructive';
        case 'En cobro': return 'destructive';
        case 'Inactivo': return 'secondary';
        case 'Fallecido': return 'outline';
        default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Gestiona los clientes existentes de Credipep.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Agregar Cliente
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead className="hidden md:table-cell">Contacto</TableHead>
              <TableHead>Créditos Activos</TableHead>
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
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={client.avatarUrl} alt={client.name} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{client.name}</div>
                  </div>
                </TableCell>
                <TableCell>{client.cedula}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="text-sm text-muted-foreground">
                    {client.email}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {client.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="link" asChild>
                    <Link
                      href={`/dashboard/creditos?debtorId=${encodeURIComponent(
                        client.cedula
                      )}`}
                    >
                      <Badge variant="default">{client.activeCredits}</Badge>
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>
                  {client.clientStatus &&
                      <Badge variant={getStatusVariant(client.clientStatus)}>
                        {client.clientStatus}
                      </Badge>
                  }
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {client.registeredOn}
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
                      <DropdownMenuItem>Crear Crédito</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
