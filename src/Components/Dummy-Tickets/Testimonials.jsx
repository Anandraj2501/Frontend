import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function Testimonials() {
    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 2,
          //slidesToSlide: 3 // optional, default to 1.
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2,
          //slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
          //slidesToSlide: 1 // optional, default to 1.
        }
      };
  return (
    <>
    <section className="sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] 2xl:w-[100%] px-3" style={{background: 'linear-gradient(to bottom,  rgba(255,249,249,0) 25%,rgba(250,242,242,0) 34%,rgba(211,189,187,1) 100%)'}}>
    <div className="md:container md:mx-auto px-3 sd:px-10  md:px-10 lg:px-10 xl:px-10 2xl:px-10">  
    <div className='title-step sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] flex justify-center pt-10'>
    <h2 className='text-3xl md:text-4xl lg:text-4xl xl:text-4xl font-bold  text-center sm:text-center md:text-center lg:text-center sl:text-center'> What Our Clients Say’s</h2></div>
   </div>
    <div className="md:container md:mx-auto px-3 sd:px-10  md:px-10 lg:px-10 xl:px-10 2xl:px-10 py-10">
            <Carousel swipeable={true}
            
        draggable={true}
        showDots={false}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        autoPlay={true}
        
        //autoPlaySpeed={1000}
        //keyBoardControl={true}
        //customTransition="all .5"
        //transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["desktop", "tablet", "mobile"]}
       // deviceType={this.props.deviceType}
        dotListClass="custom-dot-list-style" 
        itemClass="carousel-item-padding-40-px"
       >
      <div className='item'>
            <div className='bg-white w-[98%] flex flex-col gap-10 rounded-xl justify-center align-items-center  p-5 '>
                <div className='icon-box m-auto w-[40px]'><img src='images/tasty-quotes-icon.webp' alt=""/></div>
            <div >
            <p className='text-center text-1xl md:text-1xl lg:text-1xl xl:text-1xl font-[400] mb-7'>Thanks for processing my dummy flight booking instantly. My visa application got accepted last week, and my visa is on the way. </p>
            {/* <div className='text-center text-1xl md:text-1xl lg:text-1xl xl:text-1xl font-[600]'><strong>Luca Romano</strong></div> */}
            </div>
        </div> 
        </div>  
        <div className='item'>
            <div className='bg-white w-[98%] flex flex-col gap-10 rounded-xl justify-center align-items-center  p-5 '>
                <div className='icon-box m-auto w-[40px]'><img src='images/tasty-quotes-icon.webp' alt="" /></div>
            <div >
            <p className='text-center text-1xl md:text-1xl lg:text-1xl xl:text-1xl font-[400] mb-7'>I appreciate the support and guidance of TripCafe on dummy tickets for visa application. </p>
            {/* <div className='text-center text-1xl md:text-1xl lg:text-1xl xl:text-1xl font-[600]'><strong>Luca Romano</strong></div> */}
            </div>
        </div> 
        </div> 
        <div className='item'>
            <div className='bg-white w-[98%] flex flex-col gap-10 rounded-xl justify-center align-items-center  p-5 '>
                <div className='icon-box m-auto w-[40px]'><img src='images/tasty-quotes-icon.webp' alt=""/></div>
            <div >
            <p className='text-center text-1xl md:text-1xl lg:text-1xl xl:text-1xl font-[400] mb-7'>Quick flight booking confirmation at tripcafe helped me get the visa on time for our Paris holiday</p>
            {/* <div className='text-center text-1xl md:text-1xl lg:text-1xl xl:text-1xl font-[600]'><strong>Luca Romano</strong></div> */}
            </div>
        </div> 
        </div> 
        <div className='item'>
            <div className='bg-white w-[98%] flex flex-col gap-10 rounded-xl justify-center align-items-center  p-5 '>
                <div className='icon-box m-auto w-[40px]'><img src='images/tasty-quotes-icon.webp' alt=""/></div>
            <div >
            <p className='text-center text-1xl md:text-1xl lg:text-1xl xl:text-1xl font-[400] mb-7'>Good service at the best price. Liked it. Thank you TripCafe team</p>
            {/* <div className='text-center text-1xl md:text-1xl lg:text-1xl xl:text-1xl font-[600]'><strong>Luca Romano</strong></div> */}
            </div>
        </div> 
        </div> 
  
   
       </Carousel>
       </div>
       </section>
       </>
  )
}
