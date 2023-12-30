import React from "react";
import Header from "./Header";

export default function Home() {
  return (
    <>
      <Header />
      <div data-testid="home">
        <div className="div-page">
          <div className="container">
            <h1>Home</h1>
            <h3>Welcome to Stock Market DashBoard</h3>
          </div>
        </div>
      </div>
      </>
  );
}
