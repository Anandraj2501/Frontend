import { useEffect, useState } from "react";
import axios from "axios";

import {  useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { TEQUILA_URL } from "../../utils/url";

const LeftSide = () => {

    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState('Flight');
    const [tripType, setTripType] = useState('One Way');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [fromResults, setFromResults] = useState([]);
    const [toResults, setToResults] = useState([]);
    const [departueDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');


    useEffect(() => {
        if (from.length > 2) {
            axios.get(`${TEQUILA_URL}/locations/query?term=${from}&locale=en-US&location_types=airport&limit=20&active_only=true`, {
                headers: {
                    'apikey': 'nst7nQCznwAahbh0dsvDFx9bh0qxC4lm'
                }
            })
                .then(response => {
                    setFromResults(response.data.locations);
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        } else {
            setFromResults([]);
        }
    }, [from]);

    useEffect(() => {
        if (to.length > 2) {
            axios.get(`${TEQUILA_URL}/locations/query?term=${to}&locale=en-US&location_types=airport&limit=20&active_only=true`, {
                headers: {
                    'apikey': 'nst7nQCznwAahbh0dsvDFx9bh0qxC4lm'
                }
            })
                .then(response => {
                    setToResults(response.data.locations);
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        } else {
            setToResults([]);
        }
    }, [to]);

    const handleSelectFrom = (airport) => {
        setFrom(`${airport.name} (${airport.code})`);
        setFromResults([]);
    };

    const handleSelectTo = (airport) => {
        setTo(`${airport.name} (${airport.code})`);
        setToResults([]);
    };

    const handleValidation = () => {
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to 00:00:00 for comparison
        const todayString = today.toISOString().split('T')[0];
    
        // Check for empty fields
        if (!from || !to || !departueDate || (tripType === 'Round Trip' && !returnDate)) {
            toast.error('Please fill in all fields.');
        } 
        // Check if the departure date is less than today
        else if (departueDate < todayString) {
            toast.error('Departure date cannot be in the past. Please select a valid date.');
        } 
        // For round trips, check if the return date is also valid
        else if (tripType === 'Round Trip' && returnDate < todayString) {
            toast.error('Return date cannot be in the past. Please select a valid date.');
        } 
        // All validations passed, navigate to booking details
        else {
            navigate("/booking-details", {
                state: {
                    from,
                    to,
                    departureDate: departueDate,
                    returnDate: tripType === 'Round Trip' ? returnDate : null,
                    tripType: tripType === 'Round Trip' ? tripType : "one Way"
                }
            });
        }
    };
    



    return (
        <div className="right w-[100%] sm:w-[100%]  md:w-[40%]  lg:w-[40%] xl:w-[40%] font-bold">
            <div className="form w-[100%]  sm:w-[100%]  md:w-[100%]  lg:w-[100%] xl:w-[100%]  border rounded-md bg-white p-3">
                <div className="fhb-container flex bg-[#efefef] py-2 px-3 justify-between rounded-lg">
                    <button
                        className={`text-center w-full p-2 transition-colors duration-400 ease-linear rounded-md ${activeButton === 'Flight' ? 'bg-[#cc2c21] hover:bg-[#ad0e03] text-white' : 'bg-white text-black'}`}
                        onClick={() => setActiveButton('Flight')}
                    >
                        Flight
                    </button>
                    {/* <button
                        className={`text-center w-[33%] p-2 transition-colors duration-400 ease-linear rounded-md ${activeButton === 'Hotels' ? 'bg-[#cc2c21] hover:bg-[#ad0e03] text-white' : 'bg-white text-black'}`}
                        onClick={() => setActiveButton('Hotels')}
                    >
                        Hotels
                    </button>
                    <button
                        className={`text-center w-[33%] p-2 transition-colors duration-400 ease-linear rounded-md ${activeButton === 'Both' ? 'bg-[#cc2c21] hover:bg-[#ad0e03] text-white' : 'bg-white text-black'}`}
                        onClick={() => setActiveButton('Both')}
                    >
                        Both
                    </button> */}
                </div>
                <div className="subparts mt-4 px-2">
                    <div className="fhb-container flex bg-[#efefef] py-2 px-4 justify-between rounded-full">
                        <label htmlFor="OneWay">
                            <input
                                type="radio"
                                name="triptype"
                                className="cursor-pointer"
                                checked={tripType === 'One Way'}
                                onChange={() => setTripType('One Way')}
                            />
                            <span className="ml-3 text-[#cc2c21]">One Way</span>
                        </label>
                        <label htmlFor="RoundTrip">
                            <input
                                type="radio"
                                name="triptype"
                                className="ml-3 cursor-pointer"
                                checked={tripType === 'Round Trip'}
                                onChange={() => setTripType('Round Trip')}
                            />
                            <span className="ml-3 text-[#cc2c21]">Round Trip</span>
                        </label>
                    </div>
                    <div className="mt-8 gap-y-3 flex  flex-col">
                    <div  className="flex items-end flex-col sm:flex-row md:flex-row w-full">
                        <div className="relative  w-full">
                            <span className="text-[#cc2c21]">From</span>
                            <input
                                type="text"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="w-full text-[.8rem] outline-none border border-1 border-[#bebebe] focus:border-[#cc2c21] rounded-md p-3"
                            />
                            {fromResults.length > 0 && (
                                <ul className="px-[10px] py-[5px] absolute bg-[#faebd7] w-full rounded-md z-10">
                                    {fromResults.slice(0, 5).map((airport) => (
                                        <li className="bg-[#ccc] my-1 p-1 rounded-md" key={airport.id} onClick={() => handleSelectFrom(airport)}>
                                            <div>
                                                <p className="text-[.8rem] font-normal">{airport.name}</p>
                                                <div className="flex justify-between text-[.6rem]">
                                                    <span>{airport.city.name}</span>
                                                    <span>-</span>
                                                    <span>{airport.code}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                         <div className="w-[100%] sm:w-[100px] md:w-[100px] lg:w-[100px] pb-2  flex  justify-center"><img src="images/exchange-icon.svg" className="w-[50px] sm:w-[100%] md:w-[100%] lg:w-[100%] px-2" alt="" /></div>
                        <div className="relative  w-full">
                            <span className="text-[#cc2c21]">To</span>
                            <input
                                type="text"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full text-[.8rem] outline-none border border-1 border-[#bebebe] focus:border-[#cc2c21] rounded-md p-3"
                            />
                            {toResults.length > 0 && (
                                <ul className="px-[10px] py-[5px]  absolute bg-[#faebd7] w-full rounded-md z-10">
                                    {toResults.slice(0, 5).map((airport) => (
                                        <li className="bg-[#ccc] my-1 p-1 rounded-md" key={airport.id} onClick={() => handleSelectTo(airport)}>
                                            <div >
                                                <p className="text-[.8rem] font-normal">{airport.name}</p>
                                                <div className="flex justify-between text-[.6rem]">
                                                    <span>{airport.city.name}</span>
                                                    <span>-</span>
                                                    <span>{airport.code}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>


                        <span className="text-[#cc2c21]">Departure</span>
                        <input type="date" className="w-full outline-none border border-1 border-[#bebebe] focus:border-[#cc2c21] rounded-md p-3" placeholder="Departure Date" onChange={(e) => setDepartureDate(e.target.value)} />
                        {tripType === 'Round Trip' && (
                            <>
                                <span className="text-[#cc2c21]">Return</span>
                                <input type="date" className="w-full outline-none border border-1 border-[#bebebe] focus:border-[#cc2c21] rounded-md p-3" placeholder="Return Date" onChange={(e) => setReturnDate(e.target.value)} />
                            </>
                        )}

                        <label htmlFor="travellers" className="text-[#cc2c21]">Travellers</label>
                        <select name="passengerCount" className="w-full outline-none border border-1 border-[#bebebe] rounded-md p-3">
                            <option value="1" >1</option>
                            <option value="2" >2</option>
                            <option value="3" >3</option>
                            <option value="4" >4</option>
                            <option value="5" >5</option>
                            <option value="6" >6</option>
                            <option value="7" >7</option>
                            <option value="8" >8</option>
                            <option value="9">9</option>
                            <option value="10" >10</option>
                        </select>
                        <button onClick={handleValidation} className="bg-[#cc2c21] hover:bg-[#ad0e03] text-white p-3 mt-2 rounded-md text-center">Search Flights</button>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}
export default LeftSide;