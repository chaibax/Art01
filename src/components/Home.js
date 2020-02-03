import React from 'react'
import NavBar from "./NavBar";

const Home = () => {
    return (
        <section className="hero is-large">
            <div className="hero-body">

                <div className="columns is-centered">

                    <div className="container">

                        <h1 className="title is-size-1 has-text-centered shadowed">
                            ART01
                        </h1>
                        <h2 className="subtitle is-size-3 has-text-centered shadowed" >
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