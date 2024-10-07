import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AttendanceSheetTable() {

    const [listOfAttendees, setListOfAttendees] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/get-list-of-attendees');
                setListOfAttendees(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const loadingRow = () => {
        return (
            <div className="p-4 w-full">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-slate-200 rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className='flex justify-end mt-4'>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4'>Print Report</button>
            </div>
            <div className="bg-white rounded shadow p-4">
                <h2 className="text-xl font-bold text-right">ATTENDANCE SHEET</h2>
                <p className='text-sm mb-4 text-right'>Conduct of #ThinkNew for Bagong Pilipinas: Certificate of Innovation Mentoring for<br />Select ARTA Employees and Innvoation Workshop for Priority Public Sectors (Agriculture, Mining, and Energy) on 14-18 October 2024</p>
                <div className="overflow-x-auto">
                    {loading ? loadingRow() : (
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-white text-center">
                                    <th></th>
                                    <th className="px-4 py-2 border">LAST NAME</th>
                                    <th className="px-4 py-2 border">FIRST NAME</th>
                                    <th className="px-4 py-2 border text-xs -rotate-90">SEX</th>
                                    <th className="px-4 py-2 border text-xs -rotate-90">PWD</th>
                                    <th className="px-4 py-2 border text-xs -rotate-90">SENIOR<br />CITIZEN</th>
                                    <th className="px-4 py-2 border">COMPANY</th>
                                    <th className="px-4 py-2 border">DESIGNATION</th>
                                    <th className="px-4 py-2 border">CONTACT #</th>
                                    <th className="px-4 py-2 border">EMAIL ADDRESS</th>
                                    <th className="px-4 py-2 border">SIGNATURE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listOfAttendees.length > 0 ? (
                                    listOfAttendees.map((attendee, index) => (
                                        <tr key={index} className="border-t">
                                            <td>{index + 1}</td>
                                            <td className="px-4 py-2 border">{attendee.attendee_lastname}</td>
                                            <td className="px-4 py-2 border">{attendee.attendee_firstname} {attendee.attendee_middlename ? attendee.attendee_middlename.charAt(0) + '.' : ''}</td>
                                            <td className="px-4 py-2 border">{attendee.attendee_sex}</td>
                                            <td className="px-4 py-2 border">{attendee.attendee_pwd}</td>
                                            <td className="px-4 py-2 border">{attendee.attendee_senior_citizen}</td>
                                            <td className="px-4 py-2 border">{attendee.attendee_company}</td>
                                            <td className="px-4 py-2 border">{attendee.attendee_designation}</td>
                                            <td className="px-4 py-2 border">{attendee.attendee_contact_number}</td>
                                            <td className="px-4 py-2 border">{attendee.email}</td>
                                            <td className="px-4 py-2 border">
                                                <div className='flex justify-center'>
                                                    <img
                                                        className='h-10 w-10 object-cover rounded-full'
                                                        src={`/storage/${attendee.attendee_image_path}`}
                                                        alt='Attendee Signature'
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={11} className="text-center py-4 text-center">No attendance records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div >
    );
}