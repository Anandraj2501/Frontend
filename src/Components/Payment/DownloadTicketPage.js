import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import airlinesData from "../BookingDetails/airlines.json";
//import tripCafelogo from 'http://localhost:3000/images/trip-cafe.jpg';

import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, PDFViewer, Image, } from '@react-pdf/renderer';

// Create styles for the PDF document
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: 'Helvetica',
    },
    title: { flexDirection: "row", alignItems: "center", marginBottom: 20, width: '100%', borderBottom: '2px solid #333', paddingBottom: '10px', display: 'inline-block' },
    logo: { width: '154px', },
    headRight: { width: '400px', },
    headtextg: { width: '100%', padding: '5px 0', textAlign: 'right', fontWeight: 'bold', color: 'green', fontSize: 10, },
    headtextp: { width: '100%', padding: '5px 0', textAlign: 'right', fontWeight: '400', color: 'black', fontSize: 10, },
    booknoLabel: { fontWeight: 'bold', fontSize: 10, },
    bookno: { fontWeight: 'bold', fontSize: 10, textTransform: 'uppercase' },
    booknocontentA: { fontWeight: '400', fontSize: 11, paddingTop: '10px', paddingBottom: '10px' },
    booknocontentb: { fontWeight: '400', fontSize: 11, paddingBottom: '40px' },
    flightLabel: { fontWeight: 'bolder', fontSize: 11, },
    flightDetail: { flexDirection: "row", alignItems: "center", marginBottom: 20, width: '100%', marginBottom: '50px' },
    flightlog: { width: '60px', marginRight: '50px' },
    flightlogs: { textAlign: 'center' },
    flightName: { fontWeight: 'bolder', fontSize: 12, width: '100%', marginBottom: '5px', textAlign: 'left' },
    flightnadet: { fontWeight: 'bold', fontSize: 8, width: '100%', textAlign: 'left' },
    flightTimeDate: { width: '100px', marginRight: '60px' },
    flightNo: { fontWeight: 'bolder', fontSize: 10, width: '100%', marginBottom: '5px' },
    flightDate: { fontWeight: 'bolder', fontSize: 12, width: '100%', marginBottom: '3px' },
    codeTime: { display: "flex", flexDirection: "row", alignItems: "center", width: '100%', justifyContent: "space-between" },
    flightloc: { fontWeight: "heavy", fontSize: 24, width: '40%', marginBottom: '5px' },
    flighthour: { width: '90px', textAlign: 'center' },
    flighticon: { width: '100%', textAlign: 'center' },
    flighttime: { fontWeight: 'bold', fontSize: 10, width: '100%', textAlign: 'left', width: '100%', textAlign: 'center' },
    flightTimeDateb: { width: '100px', marginLeft: '60px' },
    flightNob: { fontWeight: 'bolder', fontSize: 10, width: '100%', marginBottom: '5px' },
    flightDateb: { fontWeight: 'bolder', fontSize: 12, width: '100%', marginBottom: '3px' },
    flightto: { fontWeight: 'bold', fontSize: 10, width: '100%', },
    flighttob: { fontWeight: 'bold', fontSize: 10, width: '100%', },
    flightlocb: { fontWeight: "ultrabold", fontSize: 24, width: '40%', marginBottom: '3px' },
    pdetailtable: { marginBottom: 20, width: '100%', marginBottom: '20px' },
    pdetailtablec: { marginBottom: 20, width: '100%', marginBottom: '30px' },
    pdetailtableHead: { flexDirection: "row", alignItems: "center", width: '100%', borderBottom: '1px solid #333', paddingBottom: '5px', marginBottom: '5px'  },
    pdetailtableHeadName: { width: '208px', fontWeight: 'bold', fontSize: '9', textTransform: 'uprecase' },
    pdetailtableHeadPNR: { width: '150px', fontWeight: 'bold', fontSize: '9', textTransform: 'uprecase' },
    pdetailtableHeadTNo: { width: '150px', fontWeight: 'bold', fontSize: '9', textTransform: 'uprecase' },
    pdetailtableHeadSeat: { width: '150px', fontWeight: 'bold', fontSize: '9', textTransform: 'uprecase' },

    contactInfo: { width: "100%" },
    flightClass: { fontWeight: 'bolder', fontSize: 8, width: '100%', marginBottom: '1px', textAlign: 'left' },
    flightNumber : { fontWeight: 'bolder', fontSize: 8, width: '100%', marginBottom: '1px', textAlign: 'left' },
    pdetailtablebody: { flexDirection: "row", alignItems: "center", width: '100%', paddingBottom: '5px' },
    pdetailtablebodySno: { width: '8px', fontWeight: 'bold', fontSize: '9', },
    pdetailtablebodyName: { width: '200px', fontWeight: 'bold', fontSize: '9', },
    pdetailtablebodyPNR: { width: '150px', fontWeight: 'bold', fontSize: '9', },
    pdetailtablebodyTNo: { width: '150px', fontWeight: 'bold', fontSize: '9', },
    pdetailtablebodySeat: { width: '150px', fontWeight: 'bold', fontSize: '9', },
    traveller: { color: "black", fontSize: 15, marginBottom: 10 },

    section: { marginBottom: 10, fontSize: 16, },
    label: { fontWeight: 'bold', },
    termsTitle: { fontWeight: 'bolder', color: "black", fontSize: 20, marginBottom: 20 },
    termSection: { marginBottom: 20, fontSize: 13, lineHeight: 1.3, textAlign: 'justify', color: '#333' },
    termHeading: { fontWeight: "600", color: '#000' },
    footer: { marginTop: 20, textAlign: "center", fontSize: 12, lineHeight: 1.5, fontWeight: 'black' },
    hr: {
        marginTop: 0,
        marginBottom: 20,
        borderBottomColor: '#ccc', // color for the horizontal line
        borderBottomWidth: 1,      // thickness of the horizontal line
        marginVertical: 30,        // space around the line
    },
    hrfoot: {
        marginTop: 0,
        marginBottom: 20,
        borderBottomColor: '#ccc', // color for the horizontal line
        borderBottomWidth: 1,      // thickness of the horizontal line
        marginVertical: 15,        // space around the line
    },
});
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
const formatTime = (local_departure, local_arrival) => {
    console.log(local_departure, local_arrival);
    const diffMs = new Date(local_arrival) - new Date(local_departure);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}
const TicketDocument = ({ ticketData }) => (

    <Document>
        {/* First Page with ticket details */}
        <Page style={styles.page}>

            <View style={styles.title}>
                <View style={styles.logo}><Image src='images/trip-cafe.jpg' alt='' /></View>
                <View style={styles.headRight}>

                    <Text style={styles.headtextg}>Booking Confirmed</Text>
                    <Text style={styles.headtextp}><Text style={styles.label}>Booking Date & Time: </Text>{new Date(ticketData?.createdAt).toLocaleString("en-US")}</Text>
                    <Text style={styles.headtextp}><Text style={styles.label}>PNR:</Text> {ticketData?.pnr || "N/A"} </Text>

                </View>
            </View>
{/*
            <View style={styles.section}>
                <Text style={styles.booknoLabel}>Booking ID: </Text>
                <Text style={styles.bookno}>{ticketData?.
                    referenceId || "N/A"}</Text>
            </View>*/}
            <View style={styles.section}>
                <Text style={styles.booknocontentA} >Hi Anand,</Text>
                <Text style={styles.booknocontentb} >Your flight ticket for {ticketData?.travellingDetails.from} - {ticketData?.travellingDetails.to}. Your
                    tickets are attached to this email. Your Booking ID is: <Text style={styles.bookno}>{ticketData?.
                            referenceId || "N/A"}</Text></Text>

            </View>
            <View style={styles.section}>
                <Text style={styles.flightLabel}>Flight from {ticketData?.travellingDetails.from} To {ticketData?.travellingDetails.to}</Text>
            </View>
            {
                ticketData?.flightDetails && ticketData?.flightDetails.map((flightDetail) => (
                    <View style={styles.flightDetail}>
                        <View style={styles.flightlog}>
                            <Image src={getAirlineLogo(flightDetail?.airline)} alt='' />
                            <Text style={styles.flightName}>{`${getAirlineName(flightDetail?.airline)}`}</Text>
                            <Text style={styles.flightNumber}>{!flightDetail?.return ? ticketData?.flightNumber?.split(",")[0] || "N/A" :  ticketData?.flightNumber?.split(",")[1] || "N/A"}</Text>
                            <Text style={styles.flightClass}>{ticketData?.flightClass || "N/A"}</Text>

                        </View>

                        <View style={styles.flightTimeDate}>
                            <Text style={styles.flightNo}>{flightDetail?.cityFrom}</Text>
                            <View style={styles.codeTime}>
                                <Text style={styles.flightloc}>{flightDetail?.cityCodeFrom}</Text>
                                <Text style={styles.flightloc}>{`${flightDetail?.local_departure.split("T")[1].split(":").slice(0, 2).join(":")}`}
                                </Text>
                            </View>
                            <Text style={styles.flightDate}>{new Date(flightDetail?.local_departure).toLocaleDateString('en-GB', {
                                weekday: 'short',
                                day: '2-digit',
                                month: 'short',
                                year: '2-digit'
                            }).toUpperCase()}</Text>
                            <Text style={styles.flightto}>{ticketData?.travellingDetails.from}</Text>
                        </View>

                        <View style={styles.flighthour}>
                            <Text style={styles.flighticon}><Image src={getAirlineLogo(flightDetail?.airline)} alt='' /></Text>
                            <Text style={styles.flighttime}>{`${formatTime(flightDetail?.local_departure, flightDetail?.local_arrival)}`}</Text>
                        </View>

                        <View style={styles.flightTimeDateb}>
                            <Text style={styles.flightNob}>{flightDetail?.cityTo}</Text>
                            <View style={styles.codeTime}>
                                <Text style={styles.flightlocb}>{flightDetail?.cityCodeTo}</Text>
                                <Text style={styles.flightlocb}>{`${flightDetail?.local_arrival.split("T")[1].split(":").slice(0, 2).join(":")}`}
                                </Text>
                            </View>
                            {/* <Text style={styles.flightDateb}>{`${flightDetail?.local_arrival.split("T")[0]}`}</Text> */}
                            <Text style={styles.flightDateb}>{new Date(flightDetail?.local_arrival).toLocaleDateString('en-GB', {
                                weekday: 'short',
                                day: '2-digit',
                                month: 'short',
                                year: '2-digit'
                            }).toUpperCase()}</Text>

                            <Text style={styles.flighttob}>{ticketData?.travellingDetails.to}</Text>
                            {/* <Text style={styles.flightnadetName}>{ticketData?.travellingDetails.to}</Text> */}
                            {/* <Text style={styles.flightNob}>{flightDetail?.cityTo} {`${flightDetail?.local_arrival.split("T")[1].split(".")[0]}`}</Text>
                            <Text style={styles.flightDateb}>{`${flightDetail?.local_arrival.split("T")[0]}`}</Text>
                            <Text style={styles.flightlocb}>{flightDetail?.cityCodeTo}</Text> */}
                        </View>

                    </View>
                ))

            }

            <View style={styles.pdetailtable}>
                <Text style={styles.traveller}>Traveler Information</Text>
                <View style={styles.pdetailtableHead}>
                    <Text style={styles.pdetailtableHeadName}>PASSENGER NAME</Text>
                    <Text style={styles.pdetailtableHeadPNR}>PNR</Text>
                    <Text style={styles.pdetailtableHeadTNo}>E-TICKET NO</Text>
                    <Text style={styles.pdetailtableHeadTNo}>SEAT</Text>
                </View>
                {ticketData?.passengers.map((passengerData, index) => (
                    <View style={styles.pdetailtablebody}>

                        <Text style={styles.pdetailtablebodySno}>{index + 1}</Text>
                        <Text style={styles.pdetailtablebodyName}>{passengerData?.title} {passengerData?.firstName} {passengerData?.lastName}</Text>
                        <Text style={styles.pdetailtablebodyPNR}>{ticketData?.pnr || "N/A"}</Text>
                        <Text style={styles.pdetailtablebodyTNo}>{ticketData?.
                            referenceId || "N/A"}</Text>
                        <Text style={styles.pdetailtablebodyTNo}>Seat</Text>
                    </View>
                ))}

            </View>

            <View style={styles.pdetailtablec}>
                <Text style={styles.traveller}>Contact Information</Text>
                <View style={styles.pdetailtableHead}>
                    <Text style={styles.pdetailtableHeadName}>Email</Text>
                    <Text style={styles.pdetailtableHeadPNR}>Contact</Text>
                </View>
                <View style={styles.pdetailtablebody}>

                    <Text style={styles.pdetailtablebodyName}>{ticketData?.email}</Text>
                    <Text style={styles.pdetailtablebodyPNR}>{ticketData?.phone}</Text>
                </View>

            </View>
            {/* </Page> */}

            {/* Second Page with Terms & Conditions */}
            {/* <Page style={styles.page}> */}
            <Text style={styles.termsTitle}>Terms & Conditions</Text>

            <View style={styles.termSection}>
                <Text >

                    <Text style={styles.termHeading}>Purpose of the Dummy Tickets</Text>: The Dummy Ticket you get from TripCafeHolidays.com can only be used to
                    demonstrate that you intend to apply for a visa. We do not represent at any point in time that the Dummy
                    Tickets issued by TripCafeHolidays.com fulfill the required criterion for a visa application or that you will necessarily
                    secure a Visa by using the Dummy Ticket. The Dummy Tickets issued by TripCafeHolidays.com cannot be used for
                    your actual travel or to go on a flight trip and can be neither presented as valid tickets at the airport for air
                    travel. By using our Website and booking a Dummy Ticket you explicitly acknowledge and comprehend
                    the distinction between a Dummy Ticket and a confirmed ticket.
                </Text>
            </View>

            <View style={styles.termSection}>
                <Text style={styles.termsText}>
                    Provide Correct Information: When you book a Dummy Ticket, you shall make sure to give the correct
                    details like your name, passport information, and travel dates. The details provided by you to us at the
                    time of booking Dummy Tickets should match with the information mentioned in your visa application.
                </Text>
            </View>

            <View style={styles.termSection}>
                <Text style={styles.termsText}>
                    Possible Delays: While TripCafeHolidays.com tries its best to give you the Dummy Ticket upon successful booking
                    within the committed time, there might be delays due to technical glitches, technical errors/issues, or
                    other reasons. We do not accept any responsibility for any failure in bookings, payment gateway failures,
                    or for all/any reasons that are beyond our control.
                </Text>
            </View>

            <View style={styles.termSection}>
                <Text style={styles.termsText}>
                    Acceptance of Dummy Ticket: TripCafeHolidays.com cannot guarantee that the Dummy Ticket will be accepted by
                    any authority or embassy. It's the user's responsibility to check the visa application requirements.
                </Text>
            </View>

            <View style={styles.termSection}>
                <Text style={styles.termsText}>
                    Dummy Ticket is not for Actual Travel: Even though the Dummy Ticket may look real, remember it's
                    not for actual travel or bookings. Avoid showing it to airlines, immigration officers, or anyone else involved
                    in travel matters.
                </Text>
            </View>
            <View style={styles.hrfoot} />
            <View style={styles.footer}>
                <Text style={styles.termsText}>Thank you for choosing TripCafeHolidays.com for your dummy flight ticket</Text>
            </View>
        </Page>
    </Document>
);

const DownloadTicketPage = () => {
    const location = useLocation();
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Extract the txnId from the URL
    const params = new URLSearchParams(location.search);
    const txnId = params.get('txnId');

    // Fetch the ticket data from the backend using the txnId
    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:8000/api/v1/booking/getbookingdatabyid/${txnId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                setTicketData(response.data);
                setLoading(false);
                console.log(response);
            } catch (error) {
                console.error('Error fetching ticket data:', error);
                setLoading(false);
            }
        };

        fetchTicketData();
    }, [txnId]);

    // If still loading data, display a loading message
    if (loading) {
        return <Text>Loading ticket data...</Text>;
    }

    // If no data found, display an error message
    // if (!ticketData) {
    //     return <Text>No ticket found for transaction ID: {txnId}</Text>;
    // }

    // Provide a download link for the PDF document
    return (
        <div>
            <h1>Download Your Ticket</h1>
            {/* <PDFDownloadLink
        document={<TicketDocument ticketData={ticketData} />}
        fileName={`ticket_${txnId}.pdf`}
      >
        {({ loading }) => (loading ? 'Generating PDF...' : 'Download Ticket PDF')}
      </PDFDownloadLink> */}
            <PDFViewer style={{ width: '100%', height: '100vh' }}>
                {ticketData && <TicketDocument ticketData={ticketData} />}
                {/* <TicketDocument /> */}
            </PDFViewer>

        </div>
    );
};

export default DownloadTicketPage;
