<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AttendanceController extends Controller
{
    public function store(Request $request)
    {
        try {

            $request->validate([
                'employee_id' => 'required|string|max:255',
                'employee_name' => 'required|string|max:255',
                'time_in_out' => ['nullable', 'date_format:H:i']
            ]);

            Attendance::create([
                'employee_id' => $request->employee_id,
                'employee_name' => $request->employee_name,
                'time_in_out' => $request->time_in_out,
                'time_in_out_type' => $this->determineTypeInOut($request->time_in_out)
            ]);
        } catch (\Exception $e) {

            Log::error("Error recording time in/out: " . $e->getMessage());
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }
    public function getEmployeeDetails($employeeId)
    {
        try {

            $employee = User::where('id', $employeeId)->first();

            if (!$employee) {
                return response()->json(['message' => 'Employee not found'], 404);
            }

            return response()->json([
                'attendee_lastname' => $employee->attendee_lastname,
                'attendee_firstname' => $employee->attendee_firstname,
                'attendee_middlename' => $employee->attendee_middlename,
                'attendee_image_path' => $employee->attendee_image_path,
                'attendee_pin' => $employee->attendee_pin
            ]);
        } catch (\Exception $e) {

            Log::error("Error fetching employee details: " . $e->getMessage());
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }
    public function getAttendances()
    {
        try {
            $users = User::select(
                'users.id',
                'users.attendee_lastname',
                'users.attendee_firstname',
                'users.attendee_middlename',
                'users.attendee_sex',
                'users.attendee_pwd',
                'users.attendee_senior_citizen',
                'users.attendee_company',
                'users.attendee_designation',
                'users.attendee_contact_number',
                'users.email',
                'users.attendee_image_path'
            )
                ->join('attendances', 'users.id', '=', 'attendances.employee_id')
                ->whereNotNull('attendances.time_in_out')
                ->distinct()
                ->orderBy('users.id', 'desc')
                ->get();

            return response()->json($users);
        } catch (\Exception $e) {

            Log::error("Error fetching attendance: " . $e->getMessage());
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }
    private function determineTypeInOut($time_in_out)
    {
        $time = date('H:i', strtotime($time_in_out));

        if ($time >= '06:00' && $time <= '12:00') {
            return 'IN_AM';
        } else if ($time >= '12:00' && $time <= '16:00') {
            return 'OUT_AM_IN_PM';
        } else if ($time >= '16:00') {
            return 'OUT_PM';
        }
    }
}
