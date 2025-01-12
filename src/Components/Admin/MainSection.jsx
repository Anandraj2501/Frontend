import { MdDashboard } from "react-icons/md";
import axios from "axios";
import { useEffect, useState } from "react";
import TicketEditModal from "./TicketEditModal";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/url";

const MainSection = () => {
    const [tickets, setTickets] = useState([]); // State to store ticket data
    const [loading, setLoading] = useState(true); // State to manage loading
    const [page, setPage] = useState(1);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [open, setOpen] = useState(false);
    const [editTicket, setEditTicket] = useState();
    const [filterStatus, setFilterStatus] = useState("all"); // State for filter
    const navigate = useNavigate();

    const handleOpen = (ticket) => {
        setEditTicket(ticket);
        setOpen(true);
        setSelectedTicket(null);
    };

    const handleEllipsisClick = (ticketId) => {
        setSelectedTicket(ticketId === selectedTicket ? null : ticketId);
    };

    const handleUpdateTicket = (updatedTicket) => {
        setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
                ticket._id === updatedTicket._id ? updatedTicket : ticket
            )
        );
    };

    // Fetch ticket data on component mount
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/booking`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setTickets(response.data); // Set the fetched ticket data
                setLoading(false); // Stop loading
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // If status is 401, navigate to the login page
                    navigate("/");
                }
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    // Handle status filter change
    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
        setPage(1); // Reset to the first page when applying a filter
    };

    // Filtered tickets based on the selected status
    const filteredTickets =
        filterStatus === "all"
            ? tickets
            : tickets.filter((ticket) => ticket.status === filterStatus);

    // Render loading state or table
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="p-8 flex-grow">
            <div className="flex justify-between">
                {/* Total Tickets Section */}
                <div className="flex border bg-white p-8 items-center rounded-lg w-[20%] gap-2">
                    <span>
                        <img src="/images/tickets-svgrepo-com.svg" alt="" className="w-10" />
                    </span>
                    <span className="font-semibold">Total Tickets Booked</span>
                </div>

                {/* Filter by Status */}
                <div className="flex items-center">
                    <label htmlFor="statusFilter" className="mr-2 font-semibold">
                        Filter by Status:
                    </label>
                    <select
                        id="statusFilter"
                        value={filterStatus}
                        onChange={handleFilterChange}
                        className="border rounded px-4 py-2"
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col bg-white border rounded-lg mt-10 p-8">
                <span className="font-semibold text-2xl mb-4">Recent Bookings</span>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="px-4 py-2 text-left">Txn ID</th>
                            <th className="px-4 py-2 text-left">Booking ID</th>
                            <th className="px-4 py-2 text-left">PNR</th>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.slice((page - 1) * 10, page * 10).map((ticket, index) => (
                            <tr key={ticket._id} className={(index + 1) % 2 === 0 ? "even:bg-gray-100" : ""}>
                                <td className="px-4 py-2">{ticket.transactionId}</td>
                                <td className="px-4 py-2">{ticket.bookingId}</td>
                                <td className="px-4 py-2">{ticket.pnr}</td>
                                <td className="px-4 py-2">{ticket.amount}</td>
                                <td className="px-4 py-2">{ticket.email}</td>
                                <td
                                    className={`px-4 py-2 ${
                                        ticket?.status === "pending"
                                            ? "text-yellow-500"
                                            : ticket?.status === "paid"
                                            ? "text-green-600"
                                            : ticket?.status === "failed"
                                            ? "text-red-500"
                                            : ""
                                    }`}
                                >
                                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <button
                                        className="text-gray-500 hover:text-black"
                                        onClick={() => handleEllipsisClick(ticket._id)}
                                    >
                                        &#x22EF;
                                    </button>
                                    {selectedTicket === ticket._id && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                                            {/* Edit Ticket Option */}
                                            <button
                                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleOpen(ticket)}
                                            >
                                                Edit Ticket
                                            </button>

                                            {/* Preview Ticket Option */}
                                            <a
                                                href={`http://localhost:3000/downloadTicket?txnId=${editTicket?.transactionId}`}
                                                className="block w-full px-4 py-2 text-left text-blue-500 hover:bg-gray-100"
                                            >
                                                Preview Ticket
                                            </a>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-4">
                <ButtonGroup variant="contained">
                    <Button disabled={page === 1} onClick={() => setPage((page) => Math.max(1, page - 1))}>
                        &lt;
                    </Button>
                    <Button
                        disabled={page * 10 >= filteredTickets.length}
                        onClick={() => setPage((page) => page + 1)}
                    >
                        &gt;
                    </Button>
                </ButtonGroup>
            </div>

            <TicketEditModal open={open} handleOpen={handleOpen} setOpen={setOpen} editTicket={editTicket} onUpdate={handleUpdateTicket} />
        </div>
    );
};

export default MainSection;
