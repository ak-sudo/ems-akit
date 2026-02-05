import AboutUs from "../landing/about";
import Footer from "../landing/footer";
import Gallery from "../landing/gallery";
import Hero from "../landing/hero";
import Navbar from "../landing/navbar";
import NewsSection from "../landing/newsSection";
import UpcomingEvents from "../landing/upcomingEvent";


export default function Home(){
    
    return (
        <>
            <Hero />
            <AboutUs />
            <NewsSection/>
            <UpcomingEvents />
            <Gallery/>
        </>
    )
}