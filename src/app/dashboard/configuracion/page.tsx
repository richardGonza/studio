'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { patronos, Patrono } from '@/lib/data';

export default function ConfiguracionPage() {
  const { toast } = useToast();

  // Estado para el Crédito Regular
  const [regularConfig, setRegularConfig] = useState({
    minAmount: '500000',
    maxAmount: '10000000',
    interestRate: '24',
    minTerm: '12',
    maxTerm: '72',
  });

  // Estado para el Micro-Crédito
  const [microConfig, setMicroConfig] = useState({
    minAmount: '100000',
    maxAmount: '1000000',
    interestRate: '36',
    minTerm: '6',
    maxTerm: '24',
  });

  const handleRegularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegularConfig((prev) => ({ ...prev, [id]: value }));
  };

  const handleMicroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setMicroConfig((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = (creditType: 'Crédito Regular' | 'Micro-crédito') => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="font-semibold">Parámetros Guardados</span>
        </div>
      ),
      description: `La configuración para ${creditType} ha sido actualizada.`,
      duration: 3000,
    });
  };

  return (
    <Tabs defaultValue="prestamos">
      <TabsList className="mb-4">
        <TabsTrigger value="prestamos">Préstamos</TabsTrigger>
        <TabsTrigger value="patronos">Patronos</TabsTrigger>
        <TabsTrigger value="api">API ERP</TabsTrigger>
      </TabsList>
      <TabsContent value="prestamos">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Crédito Regular</CardTitle>
              <CardDescription>
                Parámetros para los créditos regulares de deducción de planilla.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regular-minAmount">Monto Mínimo (₡)</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    value={regularConfig.minAmount}
                    onChange={handleRegularChange}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regular-maxAmount">Monto Máximo (₡)</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    value={regularConfig.maxAmount}
                    onChange={handleRegularChange}
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="regular-interestRate">
                  Tasa de Interés Anual (%)
                </Label>
                <Input
                  id="interestRate"
                  type="number"
                  value={regularConfig.interestRate}
                  onChange={handleRegularChange}
                  className="font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regular-minTerm">Plazo Mínimo (meses)</Label>
                  <Input
                    id="minTerm"
                    type="number"
                    value={regularConfig.minTerm}
                    onChange={handleRegularChange}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regular-maxTerm">Plazo Máximo (meses)</Label>
                  <Input
                    id="maxTerm"
                    type="number"
                    value={regularConfig.maxTerm}
                    onChange={handleRegularChange}
                    className="font-mono"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave('Crédito Regular')}>Guardar Cambios</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Micro-crédito</CardTitle>
              <CardDescription>
                Parámetros para micro-créditos de rápida aprobación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="micro-minAmount">Monto Mínimo (₡)</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    value={microConfig.minAmount}
                    onChange={handleMicroChange}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="micro-maxAmount">Monto Máximo (₡)</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    value={microConfig.maxAmount}
                    onChange={handleMicroChange}
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="micro-interestRate">
                  Tasa de Interés Anual (%)
                </Label>
                <Input
                  id="interestRate"
                  type="number"
                  value={microConfig.interestRate}
                  onChange={handleMicroChange}
                  className="font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="micro-minTerm">Plazo Mínimo (meses)</Label>
                  <Input
                    id="minTerm"
                    type="number"
                    value={microConfig.minTerm}
                    onChange={handleMicroChange}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="micro-maxTerm">Plazo Máximo (meses)</Label>
                  <Input
                    id="maxTerm"
                    type="number"
                    value={microConfig.maxTerm}
                    onChange={handleMicroChange}
                    className="font-mono"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave('Micro-crédito')}>Guardar Cambios</Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="patronos">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                  <CardTitle>Patronos</CardTitle>
                  <CardDescription>
                    Gestiona la lista de instituciones y patronos para deducción de planilla.
                  </CardDescription>
              </div>
               <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Agregar Patrono
                </Button>
            </div>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Patrono</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Fecha de Cobro</TableHead>
                  <TableHead>
                    <span className="sr-only">Acciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patronos.map((patrono) => (
                  <TableRow key={patrono.id}>
                    <TableCell className="font-medium">{patrono.name}</TableCell>
                    <TableCell>{patrono.category}</TableCell>
                    <TableCell>{patrono.paymentDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Alternar menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
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
      </TabsContent>
      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de API</CardTitle>
            <CardDescription>
              Gestiona la conexión con el sistema ERP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="max-w-md space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">URL del ERP</Label>
                <Input
                  id="api-url"
                  placeholder="https://erp.example.com/api"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">Clave de API (API Key)</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Ingresa tu clave de API"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline">Probar Conexión</Button>
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
