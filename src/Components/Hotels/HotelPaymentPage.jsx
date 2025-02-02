import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BACKEND_URL } from '../../utils/url';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const HotelPaymentPage = () => {
    const location = useLocation();
    const initialData = location.state || {};
    const [hash, setHash] = useState(null);

    // Generate unique transaction ID
    const generateTxnId = () => {
        const timestamp = Date.now().toString();
        const randomString = Math.random().toString(36).slice(2, 11); // ✅ Use slice() instead of substr()
        return timestamp + randomString;
    };

    const [txnid, setTxnid] = useState(generateTxnId());
    const [bookingData, setBookingData] = useState({ ...initialData, txnid });

    const pricePerPerson = 400;

    const paymentReq = async () => {
        try {
            console.log("Sending Data:", bookingData);
            const response = await axios.post(`${BACKEND_URL}/initiatePayment/hotel`, JSON.stringify(bookingData), {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data?.hash) {
                setHash(response.data?.hash);
            } else {
                console.error("Hash is missing in the response:", response);
            }
        } catch (error) {
            console.error("Payment Error:", error);
            if (error.response?.status === 401) {
                // navigate("/login");
            }
        }
    };

    const isPaymentRequested = useRef(false);

    useEffect(() => {
        const initiatePayment = async () => {
            if (!isPaymentRequested.current) {
                await paymentReq();
                isPaymentRequested.current = true;
            }
        };
        initiatePayment();
    }, [bookingData]);

    return (
        <>
            <Navbar />
            <section className="sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] 2xl:w-[100%] px-3" style={{ background: 'linear-gradient(to bottom,  rgba(255,249,249,0) 25%,rgba(250,242,242,0) 34%,rgba(211,189,187,1) 100%)' }} >
                <div className="container mx-auto sm:w-[60%] md:w-[60%] lg:w-[60%] xl:w-[60%] 2xl:w-[60%] px-[2%] sm:px-[5.5%] md:px-[5.5%] lg:px-[5.5%] xl:px-[5.5%] py-10">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="w-full">
                            <h1 className="text-2xl font-bold mb-4">Hello, { initialData?.contactDetails?.name}!</h1>
                            <p>Please review the details of your Hotel Dummy Ticket on TripCafe Holidays.</p>
                        </div>

                        <h2 className="text-xl font-semibold mb-4">Dummy Tickets Payment Details</h2>
                        <div className="payment-details">
                            <div className="mb-2 uppercase flex"><label className="font-extrabold">Transaction ID: &nbsp;</label><span className="font-extrabold">{txnid}</span></div>
                            <ul className="w-full gap-1 grid grid-cols-2">
                                <li className="bg-[#f3f3f3] p-2 flex"><label className="font-extrabold ">Amount:</label> &#8377;{400}</li>
                                <li className="bg-[#f3f3f3] p-2 flex"><label className="font-extrabold ">Name:</label> {initialData?.contactDetails?.name}</li>
                                <li className="bg-[#f3f3f3] p-2 flex"><label className="font-extrabold ">Phone:</label> {initialData?.contactDetails?.phone}</li>
                                <li className="bg-[#f3f3f3] p-2 flex"><label className="font-extrabold ">Email:</label> {initialData?.contactDetails?.email}</li>
                            </ul>
                            <div className="mt-4">
                                <p className="font-semibold text-lg">Passengers:</p>
                                <ul className="list-none list-inside mt-2  border border-black  border-t-1 border-b-0 ">
                                    {initialData?.passengers?.map((passenger, index) => (
                                        <li key={index} className=" border border-black   border-t-0  border-b-1 border-x-0 p-2">
                                            {passenger.title} {passenger.firstName} {passenger.lastName}
                                        </li>
                                    ))}


                                </ul>
                            </div>
                        </div>
                    </div>

                    {hash && (
                        <form action='https://test.payu.in/_payment' method='post' className="mt-8">
                            <input type="hidden" name="key" value="d9BcuQ" />
                            <input type="hidden" name="txnid" value={txnid} />
                            <input type="hidden" name="amount" value="400.00" />
                            <input type="hidden" name="productinfo" value="hotelBooking" />
                            <input type="hidden" name="firstname" value={bookingData?.contactDetails?.name} />
                            <input type="hidden" name="email" value={bookingData?.contactDetails?.email} />
                            <input type="hidden" name="hash" value={hash} />
                            <input type="hidden" name="surl" value={`${BACKEND_URL}/initiatePayment/hotelpaymentSuccess`} />
                            <input type="hidden" name="furl" value={`${BACKEND_URL}/initiatePayment/failed`} />
                            <button
                                type="submit"
                                className="bg-[#ec601d] text-black px-6 py-3 rounded-md hover:text-white transition duration-300"
                            >
                                Submit Payment
                            </button>
                        </form>
                    )}
                </div>
            </section>
            <Footer />
        </>
    )
}

export default HotelPaymentPage;



