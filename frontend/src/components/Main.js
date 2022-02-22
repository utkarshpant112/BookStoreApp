import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import EtsyHeader from "./LandingPage/EtsyHeader";
//Create a Main Component
class Main extends Component {
  render() {
    return (
      <div>
        <EtsyHeader></EtsyHeader>
        <Routes>
          {/*Render Different Component based on Route*/}
          <Route path="/" element={<EtsyHeader />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    );
  }
}
//Export The Main Component
export default Main;
