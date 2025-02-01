import React, { useEffect, useState, useRef } from "react";
import { json, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { BACKEND_URL } from "../../utils/url";

const PaymentComponent = () => {
    const navigate = useNavigate();
    
    const generateTxnId = () => {
        const timestamp = Date.now().toString(); // Current timestamp
        const randomString = Math.random().toString(36).substr(2, 9); // Random alphanumeric string
        return timestamp + randomString; // Concatenate the timestamp and random string
    };

    const location = useLocation();
    const { amount, name, phone, email, passengers, travellingDetails } = location.state || {};
    const [hash, setHash] = useState(null);
    const [txnid, setTxnid] = useState(generateTxnId());

    const isPaymentRequested = useRef(false); // To track whether the payment request was already made

    const data = {
        txnid,
        amount,
        productinfo: "dummyTicket",
        firstname: name,
        udf1: JSON.stringify(passengers),
        udf2: JSON.stringify(travellingDetails),
        email
    };

    const paymentReq = async () => {
        try {
            console.log(data, "sent");
            const response = await axios.post(`${BACKEND_URL}/initiatePayment`, JSON.stringify(data), {
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log(response);
            setHash(response.data?.hash); // Access the hash value from the response
        } catch (error) {
            console.error("Payment Error:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    // Use useEffect to call the paymentReq function only once when the component is mounted
    useEffect(() => {
        const initiatePayment = async () => {
            if (!isPaymentRequested.current) { // Check if the payment request was already made
                await paymentReq();
                isPaymentRequested.current = true; // Mark the request as made
            }
        };
        initiatePayment();
    }, []); // Empty dependency array ensures it only runs once

    return (
        <>
            <Navbar />
            <section className="sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] 2xl:w-[100%] px-3" style={{ background: 'linear-gradient(to bottom,  rgba(255,249,249,0) 25%,rgba(250,242,242,0) 34%,rgba(211,189,187,1) 100%)' }} >
                <div className="container mx-auto sm:w-[60%] md:w-[60%] lg:w-[60%] xl:w-[60%] 2xl:w-[60%] px-[2%] sm:px-[5.5%] md:px-[5.5%] lg:px-[5.5%] xl:px-[5.5%] py-10">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="w-full">
                            <h1 className="text-2xl font-bold mb-4">Hello, {name}!</h1>
                            <p>Please Review your Ticket Details from {travellingDetails?.from}-{travellingDetails?.to}</p>
                        </div>

                        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                        <div className="payment-details">
                            <div className="mb-2 uppercase flex"><label className="font-extrabold">Transaction ID: &nbsp;</label><span className="font-extrabold">{txnid}</span></div>
                            <ul className="w-full gap-1 grid grid-cols-2">
                                <li className="bg-[#f3f3f3] p-2 flex"><label className="font-extrabold ">Amount:</label> &#8377;{amount}</li>
                                <li className="bg-[#f3f3f3] p-2 flex"><label className="font-extrabold ">Name:</label> {name}</li>
                                <li className="bg-[#f3f3f3] p-2 flex"><label className="font-extrabold ">Phone:</label> {phone}</li>
                                <li className="bg-[#f3f3f3] p-2 flex"><label className="font-extrabold ">Email:</label> {email}</li>
                            </ul>
                            <div className="mt-4">
                                <p className="font-semibold text-lg">Passengers:</p>
                                <ul className="list-none list-inside mt-2  border border-black  border-t-1 border-b-0 ">
                                    {passengers?.map((passenger, index) => (
                                        <li key={index} className=" border border-black   border-t-0  border-b-1 border-x-0 p-2">
                                            {passenger.title} {passenger.firstName} {passenger.lastName} 
                                        </li>
                                    ))}


                                </ul>
                            </div>

                            <div className="mt-4">
                                <h3 className="font-semibold text-lg">Traveling Details:</h3>
                                <div className="flex items-center flex-col sm:flex-row md:flex-row w-full">
                                    <div className="relative  w-full">
                                        <div className="bg-[#c17a75] p-3">
                                            <span className="text-[#fff] font-extrabold">From:</span>

                                            <div className="w-full font-semibold ">{travellingDetails?.from}</div>
                                        </div>
                                    </div>

                                    <div className="w-[100%] sm:w-[100px] md:w-[100px] lg:w-[100px] pb-2  flex  justify-center"><img src="images/exchange-icon.svg" className="w-[50px] sm:w-[100%] md:w-[100%] lg:w-[100%] px-2" alt="" /></div>

                                    <div className="relative  w-full">
                                        <div className="bg-[#c17a75] p-3">
                                            <span className="text-[#ffff] font-extrabold">To:</span>

                                            <div className="w-full font-semibold ">{travellingDetails?.to} </div>
                                        </div></div>
                                </div>

                                <ul className="list-none list-inside mt-2">
                                    <li><strong>Departure Date:</strong> {travellingDetails?.departureDate}</li>
                                    {travellingDetails?.returnDate && <li><strong>Return Date:</strong> {travellingDetails.returnDate}</li>}
                                    <li><strong>Trip Type:</strong> {travellingDetails?.tripType}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {hash && (
                        <form action='https://test.payu.in/_payment' method='post' className="mt-8">
                            <input type="hidden" name="key" value="d9BcuQ" />
                            <input type="hidden" name="txnid" value={txnid} />
                            <input type="hidden" name="amount" value={amount} />
                            <input type="hidden" name="productinfo" value="dummyTicket" />
                            <input type="hidden" name="firstname" value={name} />
                            <input type="hidden" name="email" value={email} />
                            <input type="hidden" name="hash" value={hash} />
                            <input type="hidden" name="udf1" value={JSON.stringify(passengers)} />
                            <input type="hidden" name="udf2" value={JSON.stringify(travellingDetails)} />
                            <input type="hidden" name="surl" value={`${BACKEND_URL}/initiatePayment/success`} />
                            <input type="hidden" name="furl" value={`${BACKEND_URL}/initiatePayment/failed`} />
                            <button
                                type="submit"
                                className="bg-[#ec601d]  text-black px-6 py-3 rounded-md hover:text-white transition duration-300"
                            >
                                Submit Payment
                            </button>
                        </form>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
};

export default PaymentComponent;
