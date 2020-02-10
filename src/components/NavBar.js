import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {
        //   !isAuthenticated && (

        //  <Link to="/start">
        //    <h2 className="title is-size-2 has-text-centered shadowed cursor has-margin-top-20">>> Participate</h2>
        //   </Link>

        //  <button className="button is-primary" onClick={() => loginWithRedirect({})}>
        //</div>    Participate
        // </button>
        //   )
      }

      {
        isAuthenticated && (
  

            <div class="navbar-menu">
              
             
              <div class="navbar-end">
                <a class="navbar-item" onClick={() => logout()}>
                  logout
                </a>
              </div>

            </div>


        )
      }

    </div>
  );
};

export default NavBar;
