import React, { useDebugValue } from "react";

import Header from "./Header";
import Footer from "./Footer";
import MainSection from "./MainSection";
import Features from "./Features";
import AboutUs from "./AboutUs";

import "../Styles/Home.css";

function HomePage() {
  return (
    <div className="homepage">
      <Header />

      <MainSection />

      <Features />

      <AboutUs />

      <Footer />
    </div>
  );
}

export default HomePage;
