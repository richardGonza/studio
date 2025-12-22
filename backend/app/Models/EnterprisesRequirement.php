<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnterprisesRequirement extends Model
{
    use HasFactory;

    protected $fillable = [
        'enterprise_id',
        'name',
        'file_extension',
        'upload_date',
        'last_updated',
    ];

    protected $casts = [
        'upload_date' => 'date',
        'last_updated' => 'date',
    ];

    public function enterprise()
    {
        return $this->belongsTo(Enterprise::class);
    }
}
