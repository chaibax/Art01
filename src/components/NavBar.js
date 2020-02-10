import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth0();

  return (
    <nav className="navbar is-fixed-bottom shadowed blackbackground" role="navigation" aria-label="main navigation">

      {
        isAuthenticated && (
          <div className="navbar-menu is-active shadowed blackbackground">
            <div className="navbar-end">
              <a className="navbar-item has-text-centered	 " onClick={() => logout()}>
                > logout
                </a>
                <a className="navbar-item has-text-centered	" onClick={() => logout()}>
                > paint
                </a> 
            </div>
          </div>
        )
      }
    </nav>
  );
};

export default NavBar;
