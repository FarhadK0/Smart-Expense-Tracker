import React, { useDebugValue } from "react";

import Header from "./Header";
import Footer from "./Footer";
import MainSection from "./MainSection";
import Features from "./Features";
import Stats from "./Stats";
import "../Styles/Home.css";

function HomePage() {
  return (
    <div className="homepage">
      <Header />

      <MainSection />

      <Features />

      <Stats />

      <Footer />
    </div>
  );
}

export default HomePage;
