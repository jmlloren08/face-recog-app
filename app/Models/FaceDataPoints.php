<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FaceDataPoints extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'leftEAR',
        'rightEAR'
    ];
}
