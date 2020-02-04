import React, {Fragment} from "react";
import {useAuth0} from "../react-auth0-wrapper";


const Start = () => {
const {isAuthenticated, loginWithRedirect, logout} = useAuth0();
    return (
     
        <section className="hero is-large">
            <div className="hero-body">
                <div className="columns is-centered">
                    <div className="container shadowed">

                        <h2 className="title is-size-2 has-text-centered shadowed">
                        THIS PAINTING REQUIRES A BILLION PARTICIPANTS TO BE COMPLETED

                        </h2>

                        <p>Every pixel is added by one person, you for example. When you first signs in and visualizes the artwork, a colored dot corresponding to your IP address is added. </p>
                        <p>It's your pixel.</p>
                        <p>For the moment, 14683 people have participated to this project since its beginning, 543 days ago. 0.0014683% of the painting is complete
</p>
                        <p>At this rate, ART01 will be finished in 1014 years ie Friday, March 9, 3032
</p>
<h2 className="title is-size-2 has-text-centered shadowed cursor has-margin-top-20" onClick={() => loginWithRedirect({})}>
                        >> Participate
                 </h2>
        
                </div>
                </div>
      
                   </div></section>
    );
};

export default Start;