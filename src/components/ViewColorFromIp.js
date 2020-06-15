import React from "react";
import Typewriter from 'typewriter-effect';


const ViewColorFromIp = (props) => {
  
const color = props.ip.split('.');  
const red = color[0];
const green = color[1];
const blue = color[2];
const opacity = Math.round((color[3]/255) * 100) / 100;



  return (
    <div >  
      <br/>
      <div  className="imagepaintpixel" style={{ backgroundColor: "#ffffff", width: "15vw", height: "15vw", margin: "auto" }}>
      <div style={{  width: "15vw", height: "15vw", margin: "auto",  backgroundColor: `rgba(${red}, ${green}, ${blue}, ${opacity})` }}>
        </div>
        </div>
    </div>
  );
};

export default ViewColorFromIp;