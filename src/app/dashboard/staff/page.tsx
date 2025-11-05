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
// Importamos los datos de ejemplo para el personal.
import { staff } from "@/lib/data";

// Esta es la función principal que define la página de Personal.
export default function StaffPage() {
  return (
    <Card>
      {/* El encabezado de la tarjeta con título, descripción y botón para agregar. */}
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Personal Interno</CardTitle>
                <CardDescription>Gestiona los usuarios del sistema.</CardDescription>
            </div>
            <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Agregar Usuario
            </Button>
        </div>
      </CardHeader>
      {/* El contenido de la tarjeta es la tabla con la lista de usuarios. */}
      <CardContent>
        <Table>
          {/* El encabezado de la tabla define las columnas. */}
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          {/* El cuerpo de la tabla se llena con los datos del personal. */}
          <TableBody>
            {staff.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{user.name}</div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {/* Menú desplegable con acciones para cada usuario. */}
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
                      <DropdownMenuItem>Editar Permisos</DropdownMenuItem>
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
