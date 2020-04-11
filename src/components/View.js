import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import '../images.css';

const View = (props) => {
    let link = process.env.REACT_APP_API_BASE_URL+"/../images/Art0x.png";
    let position = props.match.params.id -1;
    let pixeladded_image = process.env.REACT_APP_API_BASE_URL+"/../images/Art"+position+".png";
    return (
        <Fragment>
            <h1 className="title is-size-2 has-text-centered shadowed">
                ART01 now. Your are the painter #{position+1}
            </h1>
           
        <div className="imageblink ">
            <div className="has-text-centered">
              
            
            <a  href={link} download="Art01.png" target="_blank"> 
            <img src={pixeladded_image} className="bottom" style={{ imageRendering: 'pixelated', backgroundColor: 'rgba(255, 255, 255, 1)', height: '80vmin', width: '80vim', zIndex: 1 }} /></a>
            <a  href={link} download="Art01.png" target="_blank"> <img src={link} className="imagetop" style={{ imageRendering: 'pixelated', backgroundColor: 'rgba(255, 255, 255, 1)', height: '80vmin', width: '80vim', zIndex: 1 }} />
               </a>
              
            </div>
            </div>
       
        </Fragment>
    );
}
export default View;