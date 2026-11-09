import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchLocation from "../components/SearchLocation";
import TransportOptions from "../components/TransportOptions";
import PopularRoutes from "../components/PopularRoutes";
import Features from "../components/Features";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";


function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SearchLocation />
      <TransportOptions />
      <PopularRoutes />
      <Features />
      <CallToAction />
      <Footer />
    </>
  );
}

export default Home;