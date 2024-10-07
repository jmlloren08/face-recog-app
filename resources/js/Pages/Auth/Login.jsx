import React from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Sign In" />
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="flex w-full max-w-6xl bg-white shadow-lg">
                    {/* left side */}
                    <div className="hidden w-1/2 bg-gray-50 p-10 xl:flex flex-col justify-center items-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-6">
                                Welcome to InstaFace!
                            </h2>
                            <p className="text-gray-600">
                                An Event Registration System using Facial Recognition
                            </p>
                            {/* animated facial recognition */}
                            <span className="mt-15 inline-block">
                                <svg
                                    width="350"
                                    height="350"
                                    viewBox="0 0 350 350"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* Face */}
                                    <circle cx="175" cy="175" r="80" fill="#FFD700" />
                                    {/* Eyes */}
                                    <circle cx="155" cy="160" r="10" fill="#fff" />
                                    <circle cx="195" cy="160" r="10" fill="#fff" />
                                    <circle cx="155" cy="160" r="5" fill="#000" />
                                    <circle cx="195" cy="160" r="5" fill="#000" />
                                    {/* Mouth */}
                                    <path d="M155 190 Q175 210 195 190" stroke="#000" strokeWidth="2" fill="none" />

                                    {/* Detection box */}
                                    <rect
                                        x="85"
                                        y="85"
                                        width="180"
                                        height="180"
                                        stroke="#0F0"
                                        strokeWidth="5"
                                        fill="none"
                                        opacity="0"
                                    >
                                        <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
                                        <animate attributeName="strokeWidth" values="5;10;5" dur="1s" repeatCount="indefinite" />
                                    </rect>
                                </svg>
                            </span>
                        </div>
                    </div>
                    {/* right side */}
                    <div className="w-full xl:w-1/2 flex justify-center items-center p-10">
                        <div className="w-full max-w-md">
                            <div className="flex justify-center sm:mt-12 mb-3">
                                <ApplicationLogo className="w-32 h-32 fill-current rounded" />
                            </div>
                            <h2 className="text-2xl font-semibold text-center mb-8">
                                Sign In to InstaFace
                            </h2>

                            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                            <form onSubmit={submit}>

                                <div className='mb-4'>

                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Email
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            placeholder="Enter your email"
                                            autoFocus={true}
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => setData('email', e.target.value)}
                                        />

                                        <span className="absolute right-4 top-4">
                                            <svg
                                                className="fill-current"
                                                width="22"
                                                height="22"
                                                viewBox="0 0 22 22"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g opacity="0.5">
                                                    <path
                                                        d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                                                        fill=""
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>

                                    <InputError message={errors.email} className="mt-2" />

                                </div>

                                <div className="mb-4">

                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            placeholder="6+ Characters, 1 Capital letter"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => setData('password', e.target.value)}
                                        />

                                        <span className="absolute right-4 top-4">
                                            <svg
                                                className="fill-current"
                                                width="22"
                                                height="22"
                                                viewBox="0 0 22 22"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g opacity="0.5">
                                                    <path
                                                        d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                                                        fill=""
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>

                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="submit"
                                        value={processing ? 'Processing...' : 'Sign In'}
                                        className={`w-full rounded-lg border border-primary p-4 text-white transition hover:bg-opacity-90 ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 cursor-pointer'}`}
                                        disabled={processing}
                                    />
                                </div>

                                <div className="flex w-full items-center justify-center">
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="underline text-md text-gray-600 hover:text-gray-900"
                                        >
                                            Forgot your password?
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-6 text-center">
                                    <p>
                                        Don’t have any account?{' '}
                                        <Link
                                            href={route('register')}
                                            className="underline text-primary text-gray-600 hover:text-gray-900"
                                        >
                                            Sign Up
                                        </Link>
                                    </p>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}