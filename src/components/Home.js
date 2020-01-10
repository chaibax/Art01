import React from 'react'
import NavBar from "./NavBar";

const Home = () => {
  return (
    <section className="section">
       <div className="container">
          <h1 className="title">
          <span style={{ textShadow: "1px 1px 1px #ccc", color: "rgba(255,12,59,1)" }}>
              A
            </span>
            <span style={{ textShadow: "1px 1px 1px #ccc", color: "rgba(12,255,12,1)" }}>
              R
            </span>
            <span style={{ textShadow: "1px 1px 1px #ccc", color: "rgba(12,12,255,1)" }}>
              T
            </span>
            <span style={{ textShadow: "1px 1px 1px #ccc", color: "rgba(1,1,1,1)" }}>
              0
            </span>
            <span style={{ textShadow: "1px 1px 1px #ccc", color: "rgba(1,1,1,1)" }}>
              1
            </span>
                              </h1>
                              <p>
                              First massively participatory Art project

      </p>
      <NavBar />
                              </div>
   
    
  </section>
    )
}

export default Home