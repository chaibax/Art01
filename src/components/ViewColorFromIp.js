import React from "react";


const ViewColorFromIp = (props) => {
  
const color = props.ip.split('.');
console.log(color[0]);   
const red = color[0];
const green = color[1];
const blue = color[2];
const opacity = Math.round((color[3]/255) * 100) / 100;



  return (
    <div >
      RGBa : Red({red}), Green({green}), Blue({blue}), Opacity({opacity})  <br/><br/>
      <div style={{ backgroundColor: "#ffffff", width: "5vw", height: "5vw", margin: "auto", }}>

      <div style={{  width: "5vw", height: "5vw", margin: "auto",  backgroundColor: `rgba(${red}, ${green}, ${blue}, ${opacity})` }}>
        </div>
        </div>
    </div>
  );
};

export default ViewColorFromIp;