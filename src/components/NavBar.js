import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button className="button is-primary"
          onClick={() =>
            loginWithRedirect({})
          }
        >
          Start
        </button>
      )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
      {isAuthenticated && (
        <span>
          <Link to="/">Home</Link>&nbsp;
          <Link to="/profile">Vieux my Profile</Link>
          <Link to="/paint">Paint</Link>
        </span>
      )}

    </div>
  );
};

export default NavBar;
