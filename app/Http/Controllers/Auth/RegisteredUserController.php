<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'attendee_lastname' => 'required|string|max:255',
            'attendee_firstname' => 'required|string|max:255',
            'attendee_middlename' => 'required|string|max:255',
            'attendee_sex' => 'required|string|max:255',
            'attendee_pwd' => 'nullable|string',
            'attendee_senior_citizen' => 'nullable|string',
            'attendee_company' => 'required|string|max:255',
            'attendee_designation' => 'required|string|max:255',
            'attendee_contact_number' => 'required|string|regex:/^09\d{9}$/',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'attendee_image_path' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'attendee_pin' => 'required|numeric|digits:6',
        ]);

        $user = User::create([
            'attendee_lastname' => $request->attendee_lastname,
            'attendee_firstname' => $request->attendee_firstname,
            'attendee_middlename' => $request->attendee_middlename,
            'attendee_sex' => $request->attendee_sex,
            'attendee_company' => $request->attendee_company,
            'attendee_designation' => $request->attendee_designation,
            'attendee_contact_number' => $request->attendee_contact_number,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'attendee_pin' => $request->attendee_pin
        ]);
        // generate the filename using the users id
        $imageName = $user->id . '.jpg';
        $imagePath = $request->file('attendee_image_path')->storeAs('images', $imageName, 'public');
        // update the user attendance image path with the image path
        $user->attendee_image_path = $imagePath;
        $user->save();

        $attendance = Attendance::create([
            'employee_id' => $user->id,
            'employee_name' => $user->attendee_lastname . ', ' . $user->attendee_firstname . ' ' . $user->attendee_middlename
        ]);

        $attendance->save();

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
