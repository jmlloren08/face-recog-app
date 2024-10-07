import React, { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef } from 'react';
import InputLabel from '@/Components/InputLabel';

export default function Register() {

    const [isVisibleButtonCapture, setIsVisibleButtonCapture] = useState(false);
    const [isVisibleButtonOpenCamera, setIsVisibleButtonOpenCamera] = useState(true);
    const [isVisibleCanvas, setIsVisibleCanvas] = useState(true);
    const [isVisibleVideo, setIsVisibleVideo] = useState(false);
    const [isRetake, setRetake] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        attendee_lastname: '',
        attendee_firstname: '',
        attendee_middlename: '',
        attendee_sex: '',
        attendee_pwd: '',
        attendee_senior_citizen: '',
        attendee_company: '',
        attendee_designation: '',
        attendee_contact_number: '',
        email: '',
        password: '',
        password_confirmation: '',
        attendee_image_path: null,
        attendee_pin: '',
    });

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    let stream;

    const startCamera = () => {
        setIsVisibleVideo(true);
        setIsVisibleButtonCapture(true);
        setIsVisibleButtonOpenCamera(false);
        setIsVisibleCanvas(false);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((s) => {
                    stream = s;
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                })
                .catch((err) => {
                    console.error('Error accessing camera:', err);
                });
        }
    }

    const captureImage = () => {
        setIsVisibleCanvas(true);
        setIsVisibleButtonOpenCamera(true);
        setRetake(true);
        setIsVisibleVideo(false);
        setIsVisibleButtonCapture(false);

        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        // convert canvas into blob and set data
        canvas.toBlob((blob) => setData('attendee_image_path', blob), 'image/jpg');
    }

    const submit = (e) => {
        e.preventDefault();

        // stop the camera
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        post(route('register'), {
            onFinish: () => {
                reset('attendee_image_path', 'password', 'password_confirmation', 'attendee_pin');
                setIsVisibleVideo(false);
                setIsVisibleCanvas(false);
                setIsVisibleButtonCapture(false);
                setIsVisibleButtonOpenCamera(true);
            },
        });
    };

    return (
        <>
            <Head title="Sign Up" />

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
                    <div className="w-full xl:w-1/2 flex justify-center items-center p-10 mt-12 max-w-md max-h-[80vh] overflow-y-auto">
                        <div className="w-full max-h-[80vh]">
                            <div className="flex justify-center mb-3">
                                <ApplicationLogo className="w-32 h-32 fill-current rounded" />
                            </div>
                            <h2 className="text-2xl font-semibold text-center mb-8">
                                Sign Up to InstaFace
                            </h2>

                            <form onSubmit={submit}>

                                <div className="mb-4">
                                    <InputLabel value="Profile Image" className='mb-2' />
                                    {isVisibleButtonOpenCamera && (
                                        <button
                                            type='button'
                                            onClick={startCamera}
                                            className='bg-blue-500 text-white px-4 py-2 rounded'
                                        >
                                            {isRetake ? 'Retake?' : 'Open Camera'}
                                        </button>
                                    )}
                                    <div className='mb-2 mt-2'>
                                        <video ref={videoRef} style={{ display: `${isVisibleVideo ? 'block' : 'none'}`, width: '100%', height: '100%', transform: 'scaleX(-1)' }} className='rounded' />
                                        <canvas ref={canvasRef} style={{ display: `${isVisibleCanvas ? 'block' : 'none'}`, width: '100%', height: '100%', transform: 'scaleX(-1)' }} className='rounded' />
                                    </div>
                                    {isVisibleButtonCapture && (
                                        <button
                                            type='button'
                                            onClick={captureImage}
                                            className='bg-green-500 text-white px-4 py-2 rounded'
                                        >
                                            Capture Image
                                        </button>
                                    )}
                                    <InputError message={errors.attendee_image_path} className="mt-2" />
                                </div>

                                <div className='mb-4'>
                                    <div className="relative">
                                        <input
                                            id="attendee_lastname"
                                            type="text"
                                            name="attendee_lastname"
                                            value={data.attendee_lastname}
                                            placeholder="Enter your lastname"
                                            autoFocus={true}
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => setData('attendee_lastname', e.target.value.toUpperCase())}
                                            required
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
                                                        d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                                                        fill=""
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                    <InputError message={errors.attendee_lastname} className="mt-2" />
                                </div>

                                <div className='mb-4'>
                                    <div className="relative">
                                        <input
                                            id="attendee_firstname"
                                            type="text"
                                            name="attendee_firstname"
                                            value={data.attendee_firstname}
                                            placeholder="Enter your firstname"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => setData('attendee_firstname', e.target.value.toUpperCase())}
                                            required
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
                                                        d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                                                        fill=""
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                    <InputError message={errors.attendee_firstname} className="mt-2" />
                                </div>

                                <div className='mb-4'>
                                    <div className="relative">
                                        <input
                                            id="attendee_middlename"
                                            type="text"
                                            name="attendee_middlename"
                                            value={data.attendee_middlename}
                                            placeholder="Enter your middlename"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => setData('attendee_middlename', e.target.value.toUpperCase())}
                                            required
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
                                                        d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                                                        fill=""
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                    <InputError message={errors.attendee_middlename} className="mt-2" />
                                </div>

                                <div className="flex space-x-4">
                                    <div className='mb-4'>
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Sex
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="attendee_sex"
                                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                value={data.attendee_sex}
                                                onChange={(e) => setData('attendee_sex', e.target.value)}
                                                required
                                            >
                                                <option value="" disabled>Select</option>
                                                <option value="M">Male</option>
                                                <option value="F">Female</option>
                                            </select>
                                        </div>
                                        <InputError message={errors.attendee_sex} className="mt-2" />
                                    </div>
                                    <div className='mb-4'>
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            PWD?
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="attendee_pwd"
                                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                value={data.attendee_pwd}
                                                onChange={(e) => setData('attendee_pwd', e.target.value)}
                                            >
                                                <option value="" disabled>Select</option>
                                                <option value="N/A">N/A</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <InputError message={errors.attendee_pwd} className="mt-2" />
                                    </div>
                                    <div className='mb-4'>
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Senior Citizen?
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="attendee_senior_citizen"
                                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                value={data.attendee_senior_citizen}
                                                onChange={(e) => setData('attendee_senior_citizen', e.target.value)}
                                            >
                                                <option value="" disabled>Select</option>
                                                <option value="N/A">N/A</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <InputError message={errors.attendee_senior_citizen} className="mt-2" />
                                    </div>
                                </div>

                                <div className='mb-4'>
                                    <div className="relative">
                                        <input
                                            id="attendee_company"
                                            type="text"
                                            name="attendee_company"
                                            value={data.attendee_company}
                                            placeholder="Enter your company"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => setData('attendee_company', e.target.value.toUpperCase())}
                                            required
                                        />
                                        <span className="absolute right-4 top-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <g opacity={0.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                    <InputError message={errors.attendee_company} className="mt-2" />
                                </div>

                                <div className='mb-4'>
                                    <div className="relative">
                                        <input
                                            id="attendee_designation"
                                            type="text"
                                            name="attendee_designation"
                                            value={data.attendee_designation}
                                            placeholder="Enter your designation"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => setData('attendee_designation', e.target.value.toUpperCase())}
                                            required
                                        />
                                        <span className="absolute right-4 top-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <g opacity={0.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                    <InputError message={errors.attendee_designation} className="mt-2" />
                                </div>

                                <div className='mb-4'>
                                    <div className="relative">
                                        <input
                                            id="attendee_contact_number"
                                            type="number"
                                            name="attendee_contact_number"
                                            value={data.attendee_contact_number}
                                            placeholder="Enter your contact number"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => setData('attendee_contact_number', e.target.value)}
                                            required
                                        />
                                        <span className="absolute right-4 top-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <g opacity={0.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                    <InputError message={errors.attendee_contact_number} className="mt-2" />
                                </div>

                                <div className='mb-4'>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            placeholder="Enter your email address"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
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

                                <div className='mb-4'>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            placeholder="Enter your password"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
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

                                <div className='mb-4'>
                                    <div className="relative">
                                        <input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            placeholder="Re-enter your password"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required
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
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <div className="relative">
                                        <input
                                            id="attendee_pin"
                                            type="password"
                                            inputMode="numeric"
                                            name="attendee_pin"
                                            value={data.attendee_pin}
                                            placeholder="Set your 6-digit PIN"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            maxLength="6"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*$/.test(value) && value.length <= 6) {
                                                    setData('attendee_pin', e.target.value);
                                                }
                                            }}
                                            required
                                        />
                                        <span className="absolute right-4 top-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <g opacity={0.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                    <InputError message={errors.attendee_pin} className="mt-2" />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="submit"
                                        value={processing ? 'Processing...' : 'Create account'}
                                        className={`w-full rounded-lg border border-primary p-4 text-white transition hover:bg-opacity-90 ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 cursor-pointer'}`}
                                        disabled={processing}
                                    />
                                </div>

                                <div className="text-center">
                                    <p>
                                        Already have an account?{' '}
                                        <Link
                                            href={route('login')}
                                            className="underline text-primary text-gray-600 hover:text-gray-900"
                                        >
                                            Sign in
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