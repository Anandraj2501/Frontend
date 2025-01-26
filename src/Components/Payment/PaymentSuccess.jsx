import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../utils/url";

const PaymentSuccess = () => {
    const { id } = useParams();
    const [bookingdata,setBookingData] = useState();

    const getBookingData = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/booking/getbookingdatabyid/${id}`);
            console.log(response);
            setBookingData(response?.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getBookingData();
    }, [])

    return (
        
        <section className="sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] 2xl:w-[100%] px-3 h-screen" style={{ background: 'linear-gradient(to bottom,  rgba(255,249,249,0) 25%,rgba(250,242,242,0) 34%,rgba(211,189,187,1) 100%)' }} >
            <div className="container mx-auto sm:w-[60%] md:w-[60%] lg:w-[60%] xl:w-[60%] 2xl:w-[60%] px-[2%] sm:px-[5.5%] md:px-[5.5%] lg:px-[5.5%] xl:px-[5.5%] py-10">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="w-full">
                        <h1 className="text-2xl font-bold mb-4">Hello, {bookingdata?.firstname}!</h1>
                        <p>Your flight ticket for {bookingdata?.from}-{bookingdata?.to} is <span className=" text-green-500 font-bold">confirmed</span>. Your tickets are attached along with the email.</p>
                    </div>

                    <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                    <div className="payment-details">
                        <div className="mb-2 uppercase flex"><label className="font-extrabold">Transaction ID: &nbsp;</label><span className="font-extrabold">{bookingdata?.transactionId}</span></div>
                        <ul className="w-full gap-1 grid grid-cols-2">
                            <li className="bg-[#f3f3f3] p-2 flex"><label className="font-extrabold ">Amount:</label> &#8377;{bookingdata?.amount}</li>
                            <li className="bg-[#f3f3f3] p-2 flex"><label className="font-extrabold ">Name:</label> {bookingdata?.firstname}</li>
                            {/* <li className="bg-[#f3f3f3] p-2 flex"><label className="font-extrabold ">Phone:</label> {phone}</li> */}
                            <li className="bg-[#f3f3f3] p-2 flex"><label className="font-extrabold ">Email:</label> {bookingdata?.email}</li>
                        </ul>
                        <div className="mt-4">
                            <p className="font-semibold text-lg">Passengers:</p>
                            <ul className="list-none list-inside mt-2  border border-black  border-t-1 border-b-0 ">
                                {bookingdata?.passengers?.map((passenger, index) => (
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

                                        <div className="w-full font-semibold ">{bookingdata?.travellingDetails?.from}</div>
                                    </div>
                                </div>

                                <div className="w-[100%] sm:w-[100px] md:w-[100px] lg:w-[100px] pb-2  flex  justify-center"><img src="images/exchange-icon.svg" className="w-[50px] sm:w-[100%] md:w-[100%] lg:w-[100%] px-2" alt="" /></div>

                                <div className="relative  w-full">
                                    <div className="bg-[#c17a75] p-3">
                                        <span className="text-[#ffff] font-extrabold">To:</span>

                                        <div className="w-full font-semibold ">{bookingdata?.travellingDetails?.to} </div>
                                    </div></div>
                            </div>

                            <ul className="list-none list-inside mt-2">
                                <li><strong>Departure Date:</strong> {bookingdata?.travellingDetails?.departureDate}</li>
                                {bookingdata?.travellingDetails?.returnDate && <li><strong>Return Date:</strong> {bookingdata?.travellingDetails?.returnDate}</li>}
                                <li><strong>Trip Type:</strong> {bookingdata?.travellingDetails?.tripType}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default PaymentSuccess;