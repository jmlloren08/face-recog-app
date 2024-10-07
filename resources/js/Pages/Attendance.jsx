import AttendanceSheetTable from '@/Components/Custom/AttendanceSheetTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Attendance({ auth }) {
    const userRole = auth.user.user_role;
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight"></h2>}
        >
            <Head title="Attendance" />

            <AttendanceSheetTable />

        </AuthenticatedLayout>
    );
}
