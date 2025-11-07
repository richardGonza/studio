// Importamos iconos y componentes de la interfaz de usuario.
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Importamos los datos de ejemplo para los leads.
import { leads } from "@/lib/data";

// Esta es la función principal que define la página de Leads.
export default function LeadsPage() {
  // La función devuelve una tarjeta (Card) que contiene la tabla de leads.
  return (
    <Card>
      {/* El encabezado de la tarjeta con título, descripción y botón para agregar. */}
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Leads</CardTitle>
                <CardDescription>Gestiona los leads.</CardDescription>
            </div>
            <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Agregar Lead
            </Button>
        </div>
      </CardHeader>
      {/* El contenido de la tarjeta es la tabla con la lista de leads. */}
      <CardContent>
        <Table>
          {/* El encabezado de la tabla define las columnas. */}
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead className="hidden md:table-cell">Contacto</TableHead>
              <TableHead className="hidden md:table-cell">Registrado El</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          {/* El cuerpo de la tabla se llena con los datos de los leads. */}
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={lead.avatarUrl} alt={lead.name} />
                      <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{lead.name}</div>
                  </div>
                </TableCell>
                <TableCell>{lead.cedula}</TableCell>
                <TableCell className="hidden md:table-cell">
                    <div className="text-sm text-muted-foreground">{lead.email}</div>
                    <div className="text-sm text-muted-foreground">{lead.phone}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{lead.registeredOn}</TableCell>
                <TableCell>
                  {/* Menú desplegable con acciones para cada lead. */}
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
                      <DropdownMenuItem>Convertir a Oportunidad</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
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
