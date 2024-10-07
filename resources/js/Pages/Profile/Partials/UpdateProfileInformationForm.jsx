import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import Swal from 'sweetalert2';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        attendee_lastname: user.attendee_lastname || '',
        attendee_firstname: user.attendee_firstname || '',
        attendee_middlename: user.attendee_middlename || '',
        attendee_sex: user.attendee_sex || '',
        attendee_pwd: user.attendee_pwd || '',
        attendee_senior_citizen: user.attendee_senior_citizen || '',
        attendee_company: user.attendee_company || '',
        attendee_designation: user.attendee_designation || '',
        attendee_contact_number: user.attendee_contact_number || '',
        email: user.email || '',
        attendee_pin: user.attendee_pin || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>

            {user.attendee_image_path && (
                <div className="mt-2">
                    <img
                        src={`/storage/${user.attendee_image_path}`}
                        className="h-28 w-28 rounded-lg object-cover"
                    />
                </div>
            )}

            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className='relative'>
                    <InputLabel htmlFor="attendee_lastname" value="Lastname" />
                    <TextInput
                        id="attendee_lastname"
                        className="mt-1 block w-full pr-10"
                        value={data.attendee_lastname}
                        onChange={(e) => setData('attendee_lastname', e.target.value)}
                        required
                        isFocused
                        autoComplete="attendee_lastname"
                    />
                    <InputError className="mt-2" message={errors.attendee_lastname} />
                </div>

                <div>
                    <InputLabel htmlFor="attendee_firstname" value="Firstname" />
                    <TextInput
                        id="attendee_firstname"
                        className="mt-1 block w-full"
                        value={data.attendee_firstname}
                        onChange={(e) => setData('attendee_firstname', e.target.value)}
                        required
                        autoComplete="attendee_firstname"
                    />
                    <InputError className="mt-2" message={errors.attendee_firstname} />
                </div>

                <div>
                    <InputLabel htmlFor="attendee_middlename" value="Middlename" />
                    <TextInput
                        id="attendee_middlename"
                        className="mt-1 block w-full"
                        value={data.attendee_middlename}
                        onChange={(e) => setData('attendee_middlename', e.target.value)}
                        required
                        autoComplete="attendee_middlename"
                    />
                    <InputError className="mt-2" message={errors.attendee_middlename} />
                </div>

                <div className="flex space-x-4">
                    <div>
                        <InputLabel htmlFor="attendee_sex" value="Sex" />
                        <select
                            id="attendee_sex"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            value={data.attendee_sex}
                            onChange={(e) => setData('attendee_sex', e.target.value)}
                            required
                        >
                            <option value="" disabled>Select</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                        <InputError className="mt-2" message={errors.attendee_sex} />
                    </div>

                    <div>
                        <InputLabel htmlFor="attendee_pwd" value="PWD?" />
                        <select
                            id="attendee_pwd"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            value={data.attendee_pwd}
                            onChange={(e) => setData('attendee_pwd', e.target.value)}
                        >
                            <option value="" disabled>Select</option>
                            <option value="N/A">N/A</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <InputError className="mt-2" message={errors.attendee_pwd} />
                    </div>

                    <div>
                        <InputLabel htmlFor="attendee_senior_citizen" value="Senior Citizen?" />
                        <select
                            id="attendee_senior_citizen"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            value={data.attendee_senior_citizen}
                            onChange={(e) => setData('attendee_senior_citizen', e.target.value)}
                        >
                            <option value="" disabled>Select</option>
                            <option value="N/A">N/A</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <InputError className="mt-2" message={errors.attendee_senior_citizen} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="attendee_company" value="Company" />
                    <TextInput
                        id="attendee_company"
                        className="mt-1 block w-full"
                        value={data.attendee_company}
                        onChange={(e) => setData('attendee_company', e.target.value)}
                        required
                        autoComplete="attendee_company"
                    />
                    <InputError className="mt-2" message={errors.attendee_company} />
                </div>

                <div>
                    <InputLabel htmlFor="attendee_designation" value="Designation" />
                    <TextInput
                        id="attendee_designation"
                        className="mt-1 block w-full"
                        value={data.attendee_designation}
                        onChange={(e) => setData('attendee_designation', e.target.value)}
                        required
                        autoComplete="attendee_designation"
                    />
                    <InputError className="mt-2" message={errors.attendee_designation} />
                </div>

                <div>
                    <InputLabel htmlFor="attendee_contact_number" value="Contact Number" />
                    <TextInput
                        id="attendee_contact_number"
                        className="mt-1 block w-full"
                        value={data.attendee_contact_number}
                        onChange={(e) => setData('attendee_contact_number', e.target.value)}
                        required
                        autoComplete="attendee_contact_number"
                    />
                    <InputError className="mt-2" message={errors.attendee_contact_number} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="attendee_pin" value="Six (6) digits PIN" />

                    <TextInput
                        id="attendee_pin"
                        className="mt-1 block w-full"
                        value={data.attendee_pin}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value.length <= 6) {
                                setData('attendee_pin', e.target.value);
                            }
                        }}
                        type="password"
                        inputMode="numeric"
                        maxLength="6"
                        required
                    />

                    <InputError className="mt-2" message={errors.attendee_pin} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    {recentlySuccessful ? (
                        Swal.fire({
                            icon: 'success',
                            title: 'Profile Updated',
                            text: 'Your profile information has been updated.',
                            showConfirmButton: true
                        })
                    ) : (
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Something went wrong. Please try again.',
                            showConfirmButton: true
                        })
                    )}

                </div>
            </form>
        </section >
    );
}
