import React from "react";
import {useAuth0} from "../react-auth0-wrapper";
import {Link} from "react-router-dom";

const NavBar = () => {
    const {isAuthenticated, loginWithRedirect, logout} = useAuth0();

    return (
        <div>
            {
                !isAuthenticated && (
                    
                  <Link to="/start">
                    <h2 className="title is-size-2 has-text-centered shadowed cursor has-margin-top-20">>> Participate</h2>
                   </Link>
                    
                  //  <button className="button is-primary" onClick={() => loginWithRedirect({})}>
                    //</div>    Participate
                   // </button>
                )
            }

            {isAuthenticated && <button className="button" onClick={() => logout()}>Log out</button>}
            {
                isAuthenticated && (
                    <span>
                        <Link to="/"><button className="button">Home</button></Link>
                        <Link to="/profile"><button className="button">Vieux my Profile</button></Link>
                        <Link to="/paint"><button className="button">Paint</button></Link>
                    </span>
                )
            }

        </div>
    );
};

export default NavBar;
