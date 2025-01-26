import { useEffect, useState } from "react";
import { HiMiniArrowRight } from "react-icons/hi2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import BookingDetailsRight from "./BookingDetailsRight";
import airlinesData from "./airlines.json";
import axios from "axios";
import Footer from "../Footer/Footer";
import { ToastContainer, toast } from 'react-toastify';
import Navbar from "../Navbar/Navbar";
import { TEQUILA_URL } from "../../utils/url";
const BookingDetails = () => {
    const location = useLocation();
    const [totalPassenger, setTotalPassenger] = useState(0);
    const [amount, setAmount] = useState(400);
    const [tripAmount, setTripAmount] = useState();
    const { from, to, departureDate, returnDate, tripType } = location.state || {};
    const [JourneyDetails, setJourneyDetails] = useState();
    const [departure, setDeparture] = useState();
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const [contactDetails, setContactDetails] = useState({
        name: '',
        phone: '',
        email: ''
    });

    const handleContactDetailsChange = (updatedDetails) => {
        setContactDetails(prevDetails => ({ ...prevDetails, ...updatedDetails }));
    };

    const [passengers, setPassengers] = useState([]);

    const addPassenger = () => {
        setPassengers([
            ...passengers,
            { title: 'Mr', firstName: '', lastName: '', dob: '', nationality: 'Indian' }
        ]);
        setTotalPassenger(totalPassenger + 1);

    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = d.getFullYear();

        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        // console.log(hours, minutes, seconds);
        return `${day}/${month}/${year}`;
    };


    const extractCode = (airportString) => {
        const match = airportString.match(/\(([^)]+)\)/);

        if (match) {
            const airportCode = match[1];
            return `${airportCode}`;
        } else {
            console.log('No airport code found');
        }
    }

    const getTotalTime = (totalSeconds) => {


        // Calculate total hours
        const hours = Math.floor(totalSeconds / 3600);

        // Calculate remaining seconds after converting to hours
        const remainingSeconds = totalSeconds % 3600;

        // Calculate minutes from remaining seconds
        const minutes = Math.floor(remainingSeconds / 60);
        return `${hours} hours and ${minutes} minutes`;
        console.log(`Total: ${hours} hours and ${minutes} minutes`);
    }

    // Format the dates
    const formattedDepartureDate = formatDate(departureDate);
    const formattedReturnDate = formatDate(returnDate);

    const fetchAirline = async () => {
        const fromCode = extractCode(from);
        const toCode = extractCode(to);

        if (fromCode && toCode && tripType === "one Way") {
            const airlines = await axios.get(`${TEQUILA_URL}/v2/search?fly_from=${fromCode}&fly_to=${toCode}&date_from=${formattedDepartureDate}&date_to=${formattedDepartureDate}&ret_from_diff_city=true&ret_to_diff_city=true&one_for_city=0&one_per_date=0&only_working_days=false&only_weekends=false&limit=2`, {
                headers: {
                    'apikey': 'nst7nQCznwAahbh0dsvDFx9bh0qxC4lm'
                }
            });
            const flightData = airlines.data.data[0];
            setJourneyDetails(airlines.data.data[0].route);
            console.log(airlines, "oneway")
            if (flightData && flightData.duration) {
                setDeparture(getTotalTime(flightData?.duration?.total));
            }
        } else {
            const airlines = await axios.get(`${TEQUILA_URL}/v2/search?fly_from=${fromCode}&fly_to=${toCode}&date_from=${formattedDepartureDate}&date_to=${formattedDepartureDate}&return_from=${formattedReturnDate}&return_to=${formattedReturnDate}&ret_from_diff_city=true&ret_to_diff_city=true&one_for_city=0&one_per_date=0&only_working_days=false&only_weekends=false&limit=2`, {
                headers: {
                    'apikey': 'nst7nQCznwAahbh0dsvDFx9bh0qxC4lm'
                }
            });
            const flightData = airlines.data.data[0];
            setJourneyDetails(airlines.data.data[0].route);
            if (flightData && flightData.duration) {
                setDeparture(getTotalTime(flightData?.duration?.total));
            }
            console.log("return");
            console.log(airlines, "data");
        }
    }

    const getAirlineLogo = (iataCode) => {
        // console.log(iataCode);
        const airline = airlinesData.data.find(airline => airline.iata_code === iataCode);
        // console.log(airline);
        return airline.logo;

    }

    const getAirlineName = (iataCode) => {
        // console.log(iataCode);
        const airline = airlinesData.data.find(airline => airline.iata_code === iataCode);
        // console.log(airline);
        return airline.name;

    }

    const generateTxnId = () => {
        const timestamp = Date.now().toString(); // Current timestamp
        const randomString = Math.random().toString(36).substr(2, 9); // Random alphanumeric string
        return timestamp + randomString; // Concatenate the timestamp and random string
    };

    const formattedAmount = parseFloat(total).toFixed(2);
   
    const handlePaymentClick = async () => {
        // console.log(contactDetails,"contact");
        if (validateContactDetails()) {
            navigate("/payment-page", {
                state: {
                    amount: formattedAmount,
                    name: contactDetails.name,
                    phone: contactDetails.phone,
                    email: contactDetails.email,
                    passengers: passengers,
                    travellingDetails: location.state
                }
            });
        }
    }


    //This method will generate the hashvalue
    

    const validateContactDetails = () => {
        if (!contactDetails.name || !contactDetails.phone || !contactDetails.email) {
            toast.error("Please fill in all contact details (name, phone, and email) before making the payment.");
            return false;
        }
        else if (totalPassenger < 1) {
            toast.error("Please add Passenger");
            return false;
        }
        for (let i = 0; i < passengers.length; i++) {
            const passenger = passengers[i];
            if (!passenger.title || !passenger.firstName || !passenger.lastName || !passenger.nationality) {
                toast.error(`Please fill in all details for passenger ${i + 1}.`);
                return false;
            }
        }
        return true;
    };


    useEffect(() => {
        fetchAirline();
    }, [from, to, departureDate, returnDate]);

    useEffect(() => {
        // Calculate the total and update state
        const calculatedTotal = tripType === "Round Trip" ? (amount * totalPassenger) * 2 : amount * totalPassenger;
        setTotal(calculatedTotal);
    }, [tripType, totalPassenger, amount]);

    return (
        <>
        <Navbar/>
        <section className="sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] 2xl:w-[100%] px-3" style={{background: 'linear-gradient(to bottom,  rgba(255,249,249,0) 25%,rgba(250,242,242,0) 34%,rgba(211,189,187,1) 100%)'}} >
            <div className=" flex w-full px-[2%] sm:px-[10%] md:px-[10%] lg:px-[10%] py-[10] flex-col font-bold ">
                <h3 className=" text-center underline text-[#ec601d] text-4xl">Booking Details</h3>
                <div className=" flex w-full gap-x-3 flex-wrap">

                    <BookingDetailsRight totalPassenger={totalPassenger} setTotalPassenger={setTotalPassenger} onContactDetailsChange={handleContactDetailsChange} passengers={passengers} setPassengers={setPassengers} addPassenger={addPassenger} />
                    <div className="right-detail mt-10 w-[100%] sm:w-[37%] md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]   flex flex-col">
                        <div className="borde-2 border-[#ec601d] rounded-md text-center p-3 bg-[#ec601d] text-white">Order Summary</div>
                        <div className="detai pt-6">
                            <div className="borde-2  border-[#ec601d] rounded-md text-center p-3 bg-slate-400 text-white">Flight</div>
                            <div className="pt-3 px-2">
                            <div className="flightdetails my-0 bg-white  p-2  shadow-md rounded-b-xl">
                                <p>{from}</p>
                                <span className="flex w-full justify-center"><HiMiniArrowRight /></span>
                                <p>{to}</p>
                                <span>{departureDate}</span>
                                </div>
                                {
                            JourneyDetails && JourneyDetails.map((item) => (
                                <div className="flightdetails mt-4   bg-white rounded-xl p-6  shadow-md">
                                    <div className="airlines flex items-center">
                                        <span><img src={getAirlineLogo(item?.airline)} className="w-16" alt="airline" /></span>
                                        {/* <span><img src="/images/AIC.png" className="w-16" alt="airline" /></span> */}
                                        <div className="flex flex-col ml-5 text-sm">
                                            <span >{`Airline Name: ${getAirlineName(item?.airline)}`}</span>
                                            <span>{item?.cityFrom} to {item?.cityTo}</span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="trip-details flex gap-2 w-full my-2 justify-between">
                                        <div className="flex flex-col">
                                            <span className=" text-center">{`${formatDate(item?.local_departure)}`}</span>
                                            <span className=" text-center text-4xl">{item?.cityCodeFrom}</span>
                                            {/* <span className=" text-center">(INDIRA GANDHI)</span> */}
                                        </div>
                                        <div className="flex justify-center items-center flex-col">
                                            <span className="text-center text-sm">{departure}</span>
                                            <span className="text-sm">{`(Total Time)`}</span>
                                        </div>
                                        <div className="flex flex-col ">
                                            <span className=" text-center">{`${formatDate(item?.local_arrival)}`}</span>
                                            <span className=" text-center text-4xl">{item?.cityCodeTo}</span>
                                            {/* <span className=" text-center">(INDIRA GANDHI)</span> */}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                                <div className="flex flex-col gap-2 mt-2">
                                    <div className="flex justify-between">
                                        <span>{tripType === "Round Trip" ? 'Routes * 2' : 'Routes'}</span>
                                        <span0>{tripType === "Round Trip" ? '800' : '400'}</span0>
                                    </div>
                                    <hr className="border-b border-dashed border-gray-400" />
                                    <div className="flex justify-between ">
                                        <span>Amount * {totalPassenger}</span>
                                        <span>{amount * totalPassenger}</span>
                                    </div>
                                    <hr className="border-b border-dashed border-gray-400" />
                                    <div className="flex justify-between">
                                        <span>Total</span>
                                        <span>{total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-2">
                            <button className="w-full text-1xl bg-[#ec601d] text-white rounded-md p-3 mt-4 hover:text-white" onClick={handlePaymentClick}>Pay Now</button>
                        </div>

                     
                    </div>
                </div>
                <ToastContainer />
            </div>


{/*---------------------Hotel Booking Start-----------------------------------------------------------------------*/}
<div className="flex w-full px-[2%] sm:px-[10%] md:px-[10%] lg:px-[10%] py-[10] flex-col">
           <div className="flex flex-col sm:flex-row md:flex-row w-full gap-x-3 ">
                            <div className="w-full mb-5">
                            <h2  className="text-[#ec601d] text-2xl sm:text-4xl  md:text-4xl xl:text-4xl font-bold pb-3">Please Fill the Information below</h2>
                            
                                
                                    <div className="w-full bg-white rounded-lg p-7">
                                    <div  className="grid grid-rows  gap-3 w-full">
                                            <div className="flex items-end flex-col sm:flex-row md:flex-row w-full gap-x-3">
                                                    <div className=" py-2 w-full ">
                                                            <span className="text-[#cc2c21] ">First Name </span>
                                                            <input type="text" className="w-full outline-none border border-1 border-[#bebebe] focus:border-[#cc2c21] rounded-md p-3" />
                                                    </div>
                                                    <div className=" py-2 w-full ">
                                                            <span className="text-[#cc2c21] ">Last Name </span>
                                                            <input type="text" className="w-full outline-none border border-1 border-[#bebebe] focus:border-[#cc2c21] rounded-md p-3"  />
                                                    </div>
                                                </div>
                                                <div className=" py-2 w-full ">
                                                <span className="text-[#cc2c21] ">Country/Region </span>
                                                <select id="ftravelers" name="ftravelers" className="w-full outline-none border border-1 border-[#bebebe] focus:border-[#cc2c21] rounded-md p-3">
                                            <option value="India">India</option>
                                        
                                        </select>

                                                </div>
                                                <div className=" py-2 w-full ">
                                                <span className="text-[#cc2c21] ">Street address* </span>
                                                <input type="text" className="w-full outline-none border border-1 border-[#bebebe] focus:border-[#cc2c21] rounded-md p-3" placeholder="House no. and street name"  />
                                                </div>
                                                <div className=" py-2 w-full ">
                                                <span className="text-[#cc2c21] ">Cown / City</span>
                                                <input type="text" className="w-full outline-none border border-1 border-[#bebebe] focus:border-[#cc2c21] rounded-md p-3"   />
                                                </div>
                                                <div className=" py-2 w-full ">
                                                <span className="text-[#cc2c21] ">State </span>
                                                <select id="ftravelers" name="ftravelers" className="w-full outline-none border border-1 border-[#bebebe] focus:border-[#cc2c21] rounded-md p-3">
                                            <option value="Delhi">Delhi</option>
                                        
                                        </select>

                                                </div>
                                                <div className=" py-2 w-full ">
                                                <span className="text-[#cc2c21] ">PIN Code</span>
                                                <input type="text" className="w-full outline-none border border-1 border-[#bebebe] focus:border-[#cc2c21] rounded-md p-3"   />
                                                </div>
                                                <div className=" py-2 w-full ">
                                                <span className="text-[#cc2c21] ">Phone</span>
                                                <input type="text" className="w-full outline-none border border-1 border-[#bebebe] focus:border-[#cc2c21] rounded-md p-3"   />
                                                </div>
                                                <div className=" py-2 w-full ">
                                                <span className="text-[#cc2c21] ">Email address</span>
                                                <input type="text" className="w-full outline-none border border-1 border-[#bebebe] focus:border-[#cc2c21] rounded-md p-3"   />
                                                </div>

                                        </div>

                                    </div>

                        

                            </div>

                        <div className="w-full mb-5">
                        <h2  className="text-[#ec601d] text-2xl sm:text-4xl  md:text-4xl xl:text-4xl font-bold pb-3">Hotel Information</h2>
                        <div className="w-full bg-white rounded-lg p-7">
                            <div className="w-full border-black border grid grid-rows">
                                        <div className="w-full bg-[#ccc] p-3 flex flex-col sm:flex-row md:flex-row">
                                                <div className="text-[#000] text-2xl font-bold w-full">Title</div>
                                                <div className="text-[#000] text-2xl font-bold w-full">Price & Details</div>
                                        </div>

                                        <div className="w-full bg-[#fff] p-3 flex flex-col sm:flex-row md:flex-row">
                                                <div className="text-[#000] text-1xl font-normal w-full">Delhi, India <strong>x1</strong></div>
                                                <div className="text-[#000] text-1xl font-normal w-full">&#8377;400.00</div>
                                        </div>
                                        <div className="w-full bg-[#f1f1f1] p-3 flex flex-col sm:flex-row md:flex-row">
                                                <div className="text-[#000] text-1xl font-normal w-full">Checkin </div>
                                                <div className="text-[#000] text-1xl font-normal w-full"> 29,Jan 2025</div>
                                        </div>
                                        <div className="w-full bg-[#fff] p-3 flex flex-col sm:flex-row md:flex-row">
                                                <div className="text-[#000] text-1xl font-normal w-full">Checkout </div>
                                                <div className="text-[#000] text-1xl font-normal w-full"> 30,Jan 2025</div>
                                        </div>
                                        <div className="w-full bg-[#f1f1f1] p-3 flex flex-col sm:flex-row md:flex-row">
                                                <div className="text-[#000] text-1xl font-normal w-full"><strong>Traneler 1</strong> </div>
                                                <div className="text-[#000] text-1xl font-normal w-full"></div>
                                        </div>
                                        <div className="w-full bg-[#fff] p-3 flex flex-col sm:flex-row md:flex-row">
                                                <div className="text-[#000] text-1xl font-normal w-full">Title</div>
                                                <div className="text-[#000] text-1xl font-normal w-full"> Mr</div>
                                        </div>
                                        <div className="w-full bg-[#f1f1f1] p-3 flex flex-col sm:flex-row md:flex-row">
                                                <div className="text-[#000] text-1xl font-normal w-full">First Name </div>
                                                <div className="text-[#000] text-1xl font-normal w-full"> Vipul</div>
                                        </div>

                                        <div className="w-full bg-[#fff] p-3 flex flex-col sm:flex-row md:flex-row">
                                                <div className="text-[#000] text-1xl font-normal w-full">Purpose</div>
                                                <div className="text-[#000] text-1xl font-normal w-full"> Office work place needs it</div>
                                        </div>
                                        <div className="w-full bg-[#f1f1f1] p-3 flex flex-col sm:flex-row md:flex-row">
                                                <div className="text-[#000] text-1xl font-normal w-full"><strong>Subtotal</strong> </div>
                                                <div className="text-[#000] text-1xl font-normal w-full"><strong>&#8377;400.400</strong></div>
                                        </div>
                                        <div className="w-full bg-[#fff] p-3 flex flex-col sm:flex-row md:flex-row">
                                                <div className="text-[#000] text-1xl font-normal w-full"><strong>Total</strong> </div>
                                                <div className="text-[#000] text-1xl font-normal w-full"><strong>&#8377;400.400</strong></div>
                                        </div>



                                </div> 

                                <div className="py-2 w-full">
<button  className="text-1xl bg-[#ec601d] text-white rounded-md p-3 mt-4 hover:text-white p-3 mt-2 rounded-md text-center w-full">Pay Now</button>
</div>


                        </div>

                        

                        </div>

           </div>
    
            </div>
{/*---------------------Hotel Booking End-----------------------------------------------------------------------*/}



            </section>  
            <Footer />
        </>
    )
}

export default BookingDetails;

