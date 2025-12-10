<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Lead extends Model
{
    use HasFactory;

    // Apunta a la tabla maestra
    protected $table = 'persons';

    protected $fillable = [
        'name',
        'apellido1',
        'apellido2',
        'cedula',
        'email',
        'phone',
        'status',
        'lead_status_id',
        'responsable',
        'person_type_id',
        'whatsapp',
        'tel_casa',
        'tel_amigo',
        'province',
        'canton',
        'distrito',
        'direccion1',
        'direccion2',
        'ocupacion',
        'estado_civil',
        'fecha_nacimiento',
        'relacionado_a',
        'tipo_relacion',
        'is_active',
        'notes',
        'redes_sociales',
        'genero',
        'nacionalidad',
        'telefono2',
        'telefono3',
        'institucion_labora',
        'departamento_cargo',
        'deductora_id',
        'cedula_vencimiento',
        'nivel_academico',
        'puesto',
        'profesion',
        'sector',
        'trabajo_provincia',
        'trabajo_canton',
        'trabajo_distrito',
        'trabajo_direccion',
        'institucion_direccion',
        'actividad_economica',
        'tipo_sociedad',
        'nombramientos',
        'estado_puesto',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'fecha_nacimiento' => 'date',
    ];

    /**
     * El "Global Scope" para filtrar automáticamente
     */
    protected static function booted()
    {
        // Al consultar: Solo trae Leads (tipo 1)
        static::addGlobalScope('is_lead', function (Builder $builder) {
            $builder->where('person_type_id', 1);
        });

        // Al crear: Asigna tipo 1 automáticamente
        static::creating(function ($model) {
            $model->person_type_id = 1;
        });
    }

    // Relaciones
    public function assignedAgent()
    {
        return $this->belongsTo(User::class, 'assigned_to_id');
    }

    public function leadStatus()
    {
        return $this->belongsTo(LeadStatus::class, 'lead_status_id');
    }

    // Relación especial con Oportunidades (por Cédula)
    public function opportunities()
    {
        return $this->hasMany(Opportunity::class, 'lead_cedula', 'cedula');
    }
}
