import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-wrapper";

const View = (props) => {
    let link = process.env.REACT_APP_API_BASE_URL+"/../images/Art0x.png";
    return (
        <Fragment>
            <h1 className="title is-size-1 has-text-centered shadowed">
                ART01 now
            </h1>

            <div className=" has-text-centered">
               <a href={link} download="Art01.png" target="_blank"> <img src={link} style={{ imageRendering: 'pixelated', backgroundColor: 'rgba(255, 255, 255, 1)', height: '80vmin', width: '80vim', zIndex: 1 }} />
               </a>
            </div>

        </Fragment>
    );
}
export default View;