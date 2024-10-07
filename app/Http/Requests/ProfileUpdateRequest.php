<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'attendee_lastname' => ['required', 'string', 'max:255'],
            'attendee_firstname' => ['required', 'string', 'max:255'],
            'attendee_middlename' => ['required', 'string', 'max:255'],
            'attendee_sex' => ['required', 'string', 'max:255'],
            'attendee_pwd' => ['nullable', 'string'],
            'attendee_senior_citizen' => ['nullable', 'string'],
            'attendee_company' => ['required', 'string', 'max:255'],
            'attendee_designation' => ['required', 'string', 'max:255'],
            'attendee_contact_number' => ['required', 'string', 'regex:/^09\d{9}$/'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'attendee_pin' => ['required', 'numeric', 'digits:6']
        ];
    }
}
