// La directiva "use client" indica que este componente se ejecutará en el navegador del usuario,
// lo que nos permite usar hooks de React como 'useState' o 'useEffect' para interactividad.
"use client"

// Importamos los componentes necesarios para crear gráficos de la librería 'recharts'.
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
// Importamos componentes de tarjeta (Card) para organizar la información en bloques visuales.
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// Importamos íconos de la librería 'lucide-react'.
import { Users, Gavel, Handshake, Building, Activity } from 'lucide-react';
// Importamos los datos de ejemplo (mock data) que usaremos para poblar el dashboard.
import { cases, notifications, users, volunteers, branches } from '@/lib/data';
// Importamos el componente Avatar para mostrar imágenes de perfil.
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Importamos componentes de la UI de gráficos para tooltips y contenedores.
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

// Datos para el gráfico de barras. Contamos cuántos casos hay en cada estado.
const chartData = [
  { status: 'Abierto', count: cases.filter(c => c.status === 'Abierto').length },
  { status: 'En Progreso', count: cases.filter(c => c.status === 'En Progreso').length },
  { status: 'En Espera', count: cases.filter(c => c.status === 'En Espera').length },
  { status: 'Cerrado', count: cases.filter(c => c.status === 'Cerrado').length },
  { status: 'Sentencia', count: cases.filter(c => c.status === 'Sentencia').length },
];

// Configuración para el gráfico, como la etiqueta y el color de las barras.
const chartConfig = {
  count: {
    label: "Casos",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

// Esta es la función principal que define la página del Dashboard.
export default function DashboardPage() {
  // La función devuelve el layout de la página del dashboard.
  return (
    <div className="space-y-6">
      {/* Una cuadrícula (grid) para mostrar las tarjetas con estadísticas principales. */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">+2 desde ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Activos</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cases.filter(c => c.status !== 'Cerrado').length}</div>
            <p className="text-xs text-muted-foreground">+3 esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voluntarios</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteers.length}</div>
            <p className="text-xs text-muted-foreground">+1 nuevo este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntos Autorizados</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground">Total de puntos autorizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Otra cuadrícula para mostrar el gráfico y la actividad reciente. */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Estado de Casos</CardTitle>
            <CardDescription>Un resumen de todos los casos por su estado actual.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* El contenedor del gráfico que lo hace responsivo. */}
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="status" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> Actividad Reciente
            </CardTitle>
            <CardDescription>Un resumen de las últimas notificaciones del sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Usamos 'map' para crear un elemento de lista por cada notificación. */}
              {notifications.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={`https://picsum.photos/seed/activity${item.id}/40/40`} />
                    <AvatarFallback>LC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
