<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Lead;
use App\Models\Client;
use App\Models\Opportunity;
use App\Models\LeadStatus;
use Illuminate\Support\Facades\Hash;

class CrmSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Users (Staff)
        $usersData = [
            ['name' => 'Administrador', 'email' => 'admin@pep.cr'],
            ['name' => 'Carlos Mendez', 'email' => 'carlosm@pep.cr'],
            ['name' => 'Wilmer Marquez', 'email' => 'coder@gomez.cr'],
            ['name' => 'Ahixel Rojas', 'email' => 'ahixel@pep.cr'],
            ['name' => 'Daniel Gómez', 'email' => 'daniel@gomez.cr'],
            ['name' => 'Leonardo Gómez', 'email' => 'leonardo@gomez.cr'],
        ];

        foreach ($usersData as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make('admin123'), // Default password
                ]
            );
        }

        // 2. Seed Lead Statuses
        $statuses = ['Nuevo', 'Contactado', 'Interesado', 'En Proceso', 'Convertido', 'Rechazado'];
        foreach ($statuses as $index => $status) {
            LeadStatus::firstOrCreate(
                ['name' => $status],
                ['slug' => \Illuminate\Support\Str::slug($status), 'order_column' => $index + 1]
            );
        }

        // 3. Seed Leads
        $leadsData = [
            [
                'name' => 'Carla Díaz Solano', 'cedula' => '3-1111-2222', 'email' => 'carla.dias@example.com', 'phone' => '7555-4444',
                'puesto' => 'Interino', 'antiguedad' => '2 años', 'assigned_agent_name' => 'Oficina', 'status' => 'Nuevo',
                'apellido1' => 'Díaz', 'apellido2' => 'Solano', 'fecha_nacimiento' => '1990-05-15', 'estado_civil' => 'Soltero', 'whatsapp' => '7555-4444', 'tel_casa' => '2222-3333', 'province' => 'San José', 'canton' => 'San José', 'distrito' => 'Pavas', 'direccion1' => 'De la embajada americana 200m norte', 'ocupacion' => 'Administrativa', 'source' => 'Facebook'
            ],
            [
                'name' => 'Daniel Alves Mora', 'cedula' => '4-2222-3333', 'email' => 'daniel.alves@example.com', 'phone' => '5432-1876',
                'puesto' => 'En Propiedad', 'antiguedad' => '10 años', 'assigned_agent_name' => 'Carlos Mendez', 'status' => 'Nuevo',
                'apellido1' => 'Alves', 'apellido2' => 'Mora', 'fecha_nacimiento' => '1985-08-20', 'estado_civil' => 'Casado', 'whatsapp' => '5432-1876', 'tel_casa' => '2233-4455', 'province' => 'Alajuela', 'canton' => 'Alajuela', 'distrito' => 'San José', 'direccion1' => 'Barrio San José, casa 25', 'ocupacion' => 'Ingeniero', 'source' => 'Referido'
            ],
            [
                'name' => 'Eduardo Pereira', 'cedula' => '9-0123-4567', 'email' => 'eduardo.p@example.com', 'phone' => '8123-9876',
                'puesto' => 'En Propiedad', 'antiguedad' => '8 años', 'assigned_agent_name' => 'Oficina', 'status' => 'Nuevo',
                'apellido1' => 'Pereira', 'apellido2' => 'Gómez', 'fecha_nacimiento' => '1988-03-10', 'estado_civil' => 'Divorciado', 'whatsapp' => '8123-9876', 'province' => 'Heredia', 'canton' => 'Heredia', 'distrito' => 'San Francisco', 'direccion1' => 'Condominio Las Flores', 'ocupacion' => 'Contador', 'source' => 'Web'
            ],
            [
                'name' => 'Fernanda Núñez', 'cedula' => '1-2345-6789', 'email' => 'fernanda.n@example.com', 'phone' => '7890-1234',
                'puesto' => 'Interino', 'antiguedad' => '6 meses', 'assigned_agent_name' => 'Wilmer Marquez', 'status' => 'Nuevo',
                'apellido1' => 'Núñez', 'apellido2' => 'Rojas', 'fecha_nacimiento' => '1995-12-01', 'estado_civil' => 'Soltero', 'whatsapp' => '7890-1234', 'province' => 'Cartago', 'canton' => 'Cartago', 'distrito' => 'Oriental', 'direccion1' => 'Frente al colegio San Luis', 'ocupacion' => 'Recepcionista', 'source' => 'Instagram'
            ],
        ];

        foreach ($leadsData as $data) {
            $agent = User::where('name', $data['assigned_agent_name'])->first();
            $status = LeadStatus::where('name', $data['status'])->first();

            Lead::updateOrCreate(
                ['cedula' => $data['cedula']],
                [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'],
                    'person_type_id' => 1, // Lead
                    'assigned_to_id' => $agent ? $agent->id : null,
                    'lead_status_id' => $status ? $status->id : null,
                    'ocupacion' => $data['ocupacion'] ?? $data['puesto'],
                    'notes' => "Antigüedad: " . $data['antiguedad'],
                    'is_active' => true,
                    'apellido1' => $data['apellido1'] ?? null,
                    'apellido2' => $data['apellido2'] ?? null,
                    'fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
                    'estado_civil' => $data['estado_civil'] ?? null,
                    'whatsapp' => $data['whatsapp'] ?? null,
                    'tel_casa' => $data['tel_casa'] ?? null,
                    'province' => $data['province'] ?? null,
                    'canton' => $data['canton'] ?? null,
                    'distrito' => $data['distrito'] ?? null,
                    'direccion1' => $data['direccion1'] ?? null,
                    'source' => $data['source'] ?? null,
                ]
            );
        }

                // 4. Seed Clients
        $clientsData = [
            [
                'name' => 'Ana Gómez', 'cedula' => '1-1111-1111', 'email' => 'ana.gomez@example.com', 'phone' => '8888-8888', 'status' => 'Activo',
                'apellido1' => 'Gómez', 'apellido2' => 'Pérez', 'fecha_nacimiento' => '1980-01-01', 'estado_civil' => 'Casado', 'whatsapp' => '8888-8888', 'tel_casa' => '2222-2222', 'province' => 'San José', 'canton' => 'San José', 'distrito' => 'Mata Redonda', 'direccion1' => 'Sabana Norte, Torre 1', 'ocupacion' => 'Doctora', 'genero' => 'Femenino', 'nacionalidad' => 'Costarricense'
            ],
            [
                'name' => 'Carlos Ruiz', 'cedula' => '2-2222-2222', 'email' => 'carlos.ruiz@example.com', 'phone' => '8999-9999', 'status' => 'Activo',
                'apellido1' => 'Ruiz', 'apellido2' => 'Sánchez', 'fecha_nacimiento' => '1975-06-15', 'estado_civil' => 'Soltero', 'whatsapp' => '8999-9999', 'province' => 'Heredia', 'canton' => 'Heredia', 'distrito' => 'Ulloa', 'direccion1' => 'Residencial Los Arcos', 'ocupacion' => 'Abogado', 'genero' => 'Masculino', 'nacionalidad' => 'Costarricense'
            ],
            [
                'name' => 'Beatriz Solano', 'cedula' => '5-5555-5555', 'email' => 'beatriz.s@example.com', 'phone' => '7000-0000', 'status' => 'Inactivo',
                'apellido1' => 'Solano', 'apellido2' => 'Mora', 'fecha_nacimiento' => '1992-09-20', 'estado_civil' => 'Casado', 'whatsapp' => '7000-0000', 'province' => 'Alajuela', 'canton' => 'Alajuela', 'distrito' => 'La Guácima', 'direccion1' => 'Hacienda Los Reyes', 'ocupacion' => 'Arquitecta', 'genero' => 'Femenino', 'nacionalidad' => 'Costarricense'
            ],
        ];

        foreach ($clientsData as $data) {
            // $status = ClientStatus::where('name', $data['status'])->first(); // ClientStatus does not exist yet

            Client::updateOrCreate(
                ['cedula' => $data['cedula']],
                [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'],
                    'person_type_id' => 2, // Client
                    'status' => $data['status'],
                    'is_active' => true,
                    'apellido1' => $data['apellido1'] ?? null,
                    'apellido2' => $data['apellido2'] ?? null,
                    'fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
                    'estado_civil' => $data['estado_civil'] ?? null,
                    'whatsapp' => $data['whatsapp'] ?? null,
                    'tel_casa' => $data['tel_casa'] ?? null,
                    'province' => $data['province'] ?? null,
                    'canton' => $data['canton'] ?? null,
                    'distrito' => $data['distrito'] ?? null,
                    'direccion1' => $data['direccion1'] ?? null,
                    'ocupacion' => $data['ocupacion'] ?? null,
                    'genero' => $data['genero'] ?? null,
                    'nacionalidad' => $data['nacionalidad'] ?? null,
                ]
            );
        }

        // 5. Seed Opportunities
        $opportunitiesData = [
            ['lead_cedula' => '2-0987-6543', 'creditType' => 'Regular', 'amount' => 5000000, 'status' => 'En proceso', 'assignedTo' => 'Wilmer Marquez'],
            ['lead_cedula' => '5-3333-4444', 'creditType' => 'Micro-crédito', 'amount' => 500000, 'status' => 'Convertido', 'assignedTo' => 'Carlos Mendez'],
            ['lead_cedula' => '3-1111-2222', 'creditType' => 'Regular', 'amount' => 2000000, 'status' => 'Rechazada', 'assignedTo' => 'Wilmer Marquez'],
            ['lead_cedula' => '4-2222-3333', 'creditType' => 'Regular', 'amount' => 7000000, 'status' => 'Aceptada', 'assignedTo' => 'Carlos Mendez'],
        ];

        foreach ($opportunitiesData as $data) {
            // Ensure the person exists (some opportunities might reference clients or leads not in the list above, but let's try)
            // In the mock data, '2-0987-6543' is Bruno Costa (Client).
            // '5-3333-4444' is Javier Rodríguez (Client).
            // '3-1111-2222' is Carla Díaz (Lead).
            // '4-2222-3333' is Daniel Alves (Lead).

            $agent = User::where('name', $data['assignedTo'])->first();

            Opportunity::create([
                'lead_cedula' => $data['lead_cedula'],
                'opportunity_type' => $data['creditType'],
                'amount' => $data['amount'],
                'status' => $data['status'],
                'assigned_to_id' => $agent ? $agent->id : null,
                'expected_close_date' => now()->addDays(30),
            ]);
        }
    }
}
