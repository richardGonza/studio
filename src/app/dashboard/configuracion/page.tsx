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

export default function ConfiguracionPage() {
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
              <Button>Guardar Cambios</Button>
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
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="patronos">
        <Card>
          <CardHeader>
            <CardTitle>Patronos</CardTitle>
            <CardDescription>
              Gestiona la lista de instituciones y patronos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Tabla para administrar las instituciones empleadoras, quién
              cobra y las fechas de cobro.
            </p>
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
