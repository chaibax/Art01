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

      {isAuthenticated && <button className="button" onClick={() => logout()}>Log out</button>}
      {
        isAuthenticated && (
          <Fragment>

            <div class="navbar-menu">
              <div class="navbar-start">
                <a class="navbar-item">
                  <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" alt="Bulma" />
                </a>
              </div>

              <div class="navbar-end">
                <a class="navbar-item">
                  Home
                </a>
                <a class="navbar-item">
                  Home
                </a>
              </div>
            </div>




            <span>
              <Link to="/"><button className="button">Home</button></Link>
              <Link to="/profile"><button className="button">Vieux my Profile</button></Link>
              <Link to="/paint"><button className="button">Paint</button></Link>
            </span>
          </Fragment>
        )
      }

    </div>
  );
};

export default NavBar;
