import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import FaceRecognition from './FaceRecognition';

export default function Dashboard({ auth }) {
    const userRole = auth.user.user_role;
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight"></h2>}
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {userRole === 'Administrator' ? (
                            <>
                                <div className="p-6 text-gray-900 text-center">SCAN YOUR FACE HERE</div>
                                <div className="flex justify-center">
                                    <FaceRecognition />
                                </div>
                            </>
                        ) : (
                            <div className="p-6 text-gray-900 text-center">
                                <h1 className='text-xl font-bold mb-3'>Thank you for pre-enrolling!</h1>
                                <p className='mb-3'>Please confirm your registration and attendance on the day of the event using facial recognition and your six-digit PIN.</p>
                                <p className='bg-yellow-300 rounded p-2'><span className='font-bold'>NOTE: </span>It is important to remember your six-digit PIN. After your face is recognized, you will need to enter the PIN to confirm your identity for security purposes. You can update your six-digit PIN anytime on the profile page of this web app.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
