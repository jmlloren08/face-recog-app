<?php

namespace App\Http\Controllers;

use App\Models\FaceDataPoints;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FacialDataPointsController extends Controller
{
    public function store(Request $request)
    {
        try {

            $request->validate([
                'employee_id' => 'required|string|max:255',
                'leftEAR' => 'required|decimal:8,15',
                'rightEAR' => 'required|decimal:8,15'
            ]);

            FaceDataPoints::create([
                'employee_id' => $request->employee_id,
                'leftEAR' => $request->leftEAR,
                'rightEAR' => $request->rightEAR
            ]);
        } catch (\Exception $e) {
            Log::error("Error storing facial data points: " . $e->getMessage());
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }
}
