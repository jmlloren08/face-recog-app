import React, { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

import { InputText } from 'primereact/inputtext';

export default function Register() {

    const [isVisibleButtonCapture, setIsVisibleButtonCapture] = useState(false);
    const [isVisibleButtonOpenCamera, setIsVisibleButtonOpenCamera] = useState(true);
    const [isVisibleCanvas, setIsVisibleCanvas] = useState(true);
    const [isVisibleVideo, setIsVisibleVideo] = useState(false);
    const [isRetake, setRetake] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
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
                reset('password', 'password_confirmation', 'attendee_image_path', 'attendee_pin');
                setIsVisibleVideo(false);
                setIsVisibleCanvas(false);
                setIsVisibleButtonCapture(false);
                setIsVisibleButtonOpenCamera(true);
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>

                <div className="mb-2">
                    <InputLabel value="Profile Image" className='mb-2' />
                    {isVisibleButtonOpenCamera && (
                        <button
                            type='button'
                            onClick={startCamera}
                            className='bg-blue-500 text-white px-4 py-2 rounded'
                        >
                            {isRetake ? 'Retake' : 'Open Camera'}
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

                <div className="card flex flex-column md:flex-row gap-3">
                    <div className="p-inputgroup flex-1">
                        <InputText
                            placeholder='Lastname'
                        />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputError message={errors.attendee_lastname} className="mt-2" />
                    </div>
                </div>

                <div className='mt-4'>
                    <InputLabel htmlFor="attendee_firstname" value="Firstname" />
                    <TextInput
                        id="attendee_firstname"
                        name="attendee_firstname"
                        value={data.attendee_firstname}
                        className="mt-1 block w-full"
                        autoComplete="attendee_firstname"
                        onChange={(e) => setData('attendee_firstname', e.target.value)}
                        required
                    />
                    <InputError message={errors.attendee_firstname} className="mt-2" />
                </div>

                <div className='mt-4'>
                    <InputLabel htmlFor="attendee_middlename" value="Middlename" />
                    <TextInput
                        id="attendee_middlename"
                        name="attendee_middlename"
                        value={data.attendee_middlename}
                        className="mt-1 block w-full"
                        autoComplete="attendee_middlename"
                        onChange={(e) => setData('attendee_middlename', e.target.value)}
                        required
                    />
                    <InputError message={errors.attendee_middlename} className="mt-2" />
                </div>

                <div className="flex space-x-4 mt-4">
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

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="attendee_pin" value="PIN (6 digits)" />
                    <TextInput
                        id="attendee_pin"
                        type="password"
                        inputMode="numeric"
                        name="attendee_pin"
                        value={data.attendee_pin}
                        className="mt-1 block w-full"
                        maxLength="6"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value.length <= 6) {
                                setData('attendee_pin', e.target.value);
                            }
                        }}
                        required
                    />
                    <InputError message={errors.attendee_pin} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('login')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout >
    );
}
