

import React, { useEffect, useState } from 'react';
import { Plane, Hotel, Calendar, Mail, Search, Download, X, Edit2, Save, User, Phone } from 'lucide-react';
import { BACKEND_URL } from '../../utils/url';
import axios from 'axios';

const statusColors = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
};

export default function MainSection() {

    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [editingPassenger, setEditingPassenger] = useState(null);
    const [passengerForm, setPassengerForm] = useState({
        title: '',
        firstName: '',
        lastName: '',
        nationality: ''
    });


    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [pnr, setPnr] = useState("");
    const [status, setStatus] = useState();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/booking`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setTickets(response.data);
                console.log(response.data);
                setFilteredTickets(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // If status is 401, navigate to the login page
                    // navigate("/");
                }
                // setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    useEffect(() => {
        let filteredData = tickets;

        if (fromDate) {
            filteredData = filteredData.filter(ticket => new Date(ticket.createdAt) >= new Date(fromDate));
        }
        if (toDate) {
            filteredData = filteredData.filter(ticket => new Date(ticket.createdAt) <= new Date(toDate));
        }
        if (pnr) {
            filteredData = filteredData.filter(ticket => ticket.pnr === pnr);
        }
        if (status) {
            filteredData = filteredData.filter(ticket => ticket.status === status.toLowerCase());
        }

        setFilteredTickets(filteredData);

    }, [fromDate, toDate, pnr, status]);

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const startEditingPassenger = (passenger) => {
        setEditingPassenger(passenger._id);
        setPassengerForm({
            title: passenger.title,
            firstName: passenger.firstName,
            lastName: passenger.lastName,
            nationality: passenger.nationality
        });
    };

    const savePassengerEdit = async (bookingId,passengerId) => {
        console.log(bookingId,passengerId)
        // In a real app, you would make an API call here
        try {
            const response = await axios.put(`${BACKEND_URL}/booking/updateBookingData/${bookingId}/passenger/${passengerId}`, { passengerDetails: passengerForm, pnr: pnr }, {
                headers: {
                    "Content-Type": "application/json",
                },
            } // Sending passengers data in the request body
            );
            setSelectedBooking((prevBooking) => ({
                ...prevBooking,
                passengers: prevBooking.passengers.map((passenger) =>
                    passenger._id === passengerId ? { ...passenger, ...passengerForm } : passenger
                ),
            }));
    
            // Update the main tickets list
            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket._id === bookingId
                        ? {
                            ...ticket,
                            passengers: ticket.passengers.map((passenger) =>
                                passenger._id === passengerId ? { ...passenger, ...passengerForm } : passenger
                            ),
                        }
                        : ticket
                )
            );
    
            setFilteredTickets((prevFilteredTickets) =>
                prevFilteredTickets.map((ticket) =>
                    ticket._id === bookingId
                        ? {
                            ...ticket,
                            passengers: ticket.passengers.map((passenger) =>
                                passenger._id === passengerId ? { ...passenger, ...passengerForm } : passenger
                            ),
                        }
                        : ticket
                )
            );

        } catch (error) {

        }
        setEditingPassenger(null);
    };

    const cancelEditing = () => {
        setEditingPassenger(null);
    };

    return (
        <div className="p-6 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Booking Dashboard</h1>

            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Plane className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-400">Last 30 days</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">120</h3>
                    <p className="text-sm text-gray-600">Total Tickets Booked</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <Hotel className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-400">Last 30 days</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">120</h3>
                    <p className="text-sm text-gray-600">Total Hotels Booked</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-50 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-400">Today</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">24</h3>
                    <p className="text-sm text-gray-600">New Bookings</p>
                </div>


            </div>

            {/* Search Filters */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PNR</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter PNR"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={pnr}
                                onChange={(e) => setPnr(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Status</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>

                    </div>
                </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date&Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Txn ID</th>
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ReferenceId</th> */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PNR</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTickets?.map((ticket, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(ticket.createdAt).toLocaleString("en-US")}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.transactionId}</td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.referenceId}</td> */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.bookingId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.pnr}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button className="text-blue-600 hover:text-blue-800" onClick={() => handleViewDetails(ticket)}>View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Booking Details Modal */}
            {showModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Booking ID</h4>
                                    <p className="text-gray-900">{selectedBooking._id}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Reference ID</h4>
                                    <p className="text-gray-900">{selectedBooking.referenceId}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">PNR</h4>
                                    <p className="text-gray-900">{selectedBooking.pnr || 'Not assigned'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Amount</h4>
                                    <p className="text-gray-900">₹{selectedBooking.amount}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${statusColors[selectedBooking.status]}`}>
                                        {selectedBooking.status}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-3">Passenger Details</h4>
                                <div className="bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 bg-gray-100">
                                        <div className="text-sm font-medium text-gray-500">Title</div>
                                        <div className="text-sm font-medium text-gray-500">Firstname</div>
                                        <div className="text-sm font-medium text-gray-500">lastname</div>
                                        <div className="text-sm font-medium text-gray-500">Nationality</div>
                                        <div className="text-sm font-medium text-gray-500">Actions</div>
                                    </div>

                                    {selectedBooking.passengers.map((passenger) => (
                                        <div key={passenger.id} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 last:border-0">
                                            {editingPassenger === passenger._id ? (
                                                // Editing mode
                                                <>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={passengerForm.title}
                                                            onChange={(e) => setPassengerForm({ ...passengerForm, title: e.target.value })}
                                                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={passengerForm.firstName}
                                                            onChange={(e) => setPassengerForm({ ...passengerForm, firstName: e.target.value })}
                                                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={passengerForm.lastName}
                                                            onChange={(e) => setPassengerForm({ ...passengerForm, lastName: e.target.value })}
                                                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={passengerForm.nationality}
                                                            onChange={(e) => setPassengerForm({ ...passengerForm, nationality: e.target.value })}
                                                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => savePassengerEdit(selectedBooking._id,passenger._id)}
                                                            className="p-1 text-green-600 hover:text-green-800"
                                                            title="Save"
                                                        >
                                                            <Save size={18} />
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="p-1 text-gray-600 hover:text-gray-800"
                                                            title="Cancel"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                // View mode
                                                <>
                                                    <div className="text-sm text-gray-900 flex items-center">
                                                        <User className="w-4 h-4 mr-2 text-gray-400" />
                                                        {passenger.title}
                                                    </div>
                                                    <div className="text-sm text-gray-900">{passenger.firstName}</div>
                                                    <div className="text-sm text-gray-900">{passenger.lastName}</div>
                                                    <div className="text-sm text-gray-900 flex items-center">
                                                        {/* <Phone className="w-4 h-4 mr-2 text-gray-400" /> */}
                                                        {passenger.nationality}
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() => startEditingPassenger(passenger)}
                                                            className="p-1 text-blue-600 hover:text-blue-800"
                                                            title="Edit passenger"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}