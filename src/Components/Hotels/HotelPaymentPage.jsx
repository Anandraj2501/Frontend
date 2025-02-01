import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BACKEND_URL } from '../../utils/url';
import axios from 'axios';

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
    }, [bookingData]); // ✅ Added dependency

    return (
        <div>
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
    )
}

export default HotelPaymentPage;
