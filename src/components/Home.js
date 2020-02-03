import React from 'react'
import NavBar from "./NavBar";

const Home = () => {
    return (
        <section className="hero is-large">
            <div className="hero-body">

                <div className="columns is-centered">

                    <div className="container">

                        <h1 className="title is-size-1 has-text-centered">
                            <span
                                style={{
                                    textShadow: "1px 1px 1px #ccc",
                                    color: "rgba(255,12,59,1)"
                                }}>
                                A
                            </span>
                            <span
                                style={{
                                    textShadow: "1px 1px 1px #ccc",
                                    color: "rgba(12,255,12,1)"
                                }}>
                                R
                            </span>
                            <span
                                style={{
                                    textShadow: "1px 1px 1px #ccc",
                                    color: "rgba(12,12,255,1)"
                                }}>
                                T
                            </span>
                            <span
                                style={{
                                    textShadow: "1px 1px 1px #ccc",
                                    color: "rgba(1,1,1,1)"
                                }}>
                                0
                            </span>
                            <span
                                style={{
                                    textShadow: "1px 1px 1px #ccc",
                                    color: "rgba(1,1,1,1)"
                                }}>
                                1
                            </span>
                        </h1>
                        <h2 className="subtitle is-size-3 has-text-centered">
                            First massively participatory art project
                        </h2>
                        <h2 className="subtitle is-size-3 has-text-centered">
                            <NavBar/>
                        </h2>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default Home