'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { projectPlan } from '@/lib/data';
import { ProjectPlanClient } from '@/components/project-plan-client';

/**
 * Página principal del módulo de Proyecto.
 * Muestra los hitos del proyecto y permite marcar tareas como completadas.
 */
export default function ProyectoPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Plan de Proyecto Backend</h1>
        <p className="text-muted-foreground">
          Seguimiento de hitos y tareas para el desarrollo del backend en Laravel.
        </p>
      </div>

      <ProjectPlanClient initialPlan={projectPlan} />
    </div>
  );
}
