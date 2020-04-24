import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import ViewColorFromIp from "./ViewColorFromIp"; // a degager
import Typewriter from 'typewriter-effect';
import { useHistory } from "react-router-dom";

function getRandomArbitrary(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const Paint = () => {


  const { getTokenSilently, loading, user } = useAuth0();
  const history = useHistory();

  function sendpixel() {

    const axios = require('axios');
    const callApi = async () => {
      const token = await getTokenSilently();
      
    axios.post(process.env.REACT_APP_API_BASE_URL+'/pixels/add', {
        pixel: FirstIP,
        email: email,
        auth0Id: auth0Id
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      }
      )
        .then(function (response) {
          console.log(response);
          if( (response.data.position>-1) && !(process.env.REACT_APP_DEBUG_MODE=='1') ){
            console.log(response.data.position);
            history.push("/view/"+response.data.position);

          } else {
            console.log("error adding pixel :( or debug mode  ");
            history.push("/paint");
          }
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        });

    };
    callApi();
  };
  
  if(!(process.env.REACT_APP_DEBUG_MODE=='1')) {
  var FirstIP = user['https://art01/FirstIP'];
} else {
  //mode debug



  var FirstIP = getRandomArbitrary(0, 256)+'.'+getRandomArbitrary(0, 256)+'.'+getRandomArbitrary(0, 256)+'.'+getRandomArbitrary(150, 256);
  console.log('FirstIP==');
  console.log(FirstIP);

}


  const given_name = user.given_name;
  const email = user.email;
  const pixel_added = user['https://art01/pixel_added'];
  const pixel_position  = user['https://art01/pixel_position'];
  const auth0Id = user['https://art01/user_id'];

  console.log('pixel_added = '+pixel_added+' position ='+pixel_position+ ' given_name='+given_name+ 'FirstIP = '+FirstIP);




  if (loading || !user) {
    return (
      <div className="pageloader is-active">
        <span className="title">Loading Art01</span>
      </div>
    );
  }

//si le pixel a déja été déposé et qu'on est pas en mode debug, on affiche pas cette page
  if( pixel_added  && !(process.env.REACT_APP_DEBUG_MODE=='1')){
    console.log('toto======'+process.env.REACT_APP_DEBUG_MODE);
    console.log(process.env);
    history.push("/view/"+pixel_position);
    console.log('pixel added yet');
  }
  

  if((process.env.REACT_APP_DEBUG_MODE=='1')) {

    return (
      <div id="mypixel" >
      <ViewColorFromIp ip={FirstIP} />
      <h2 onClick={sendpixel} className="title is-size-2 has-text-centered shadowed cursor has-margin-top-20">
        >> Add my pixel to the paint
               </h2>

    </div>
    )
    
  } else {
    return (


      <h2 className="title is-size-3 has-text-centered shadowed">
  
        <Typewriter
          options={{
            loop: false,
            cursor: '<big>▮</big>'
          }}
          onInit={(typewriter) => {
            typewriter.typeString('<big>Hello ' + given_name + '</big>')
              .pauseFor(2)
              .pauseFor(1)
              .typeString('<br/>')
              .pauseFor(1)
              .typeString('your IP is: ' + FirstIP)
              .pauseFor(2)
              .typeString('<br/>')
              .typeString(' So, your pixel color is : ')
              .pauseFor(2)
              .callFunction(() => {
                const element = document.getElementById("mypixel");
                element.classList.remove("is-hidden");
              })
              .start();
          }}
        />
  
        <div id="mypixel" className="is-hidden">
          <ViewColorFromIp ip={FirstIP} />
          <h2 onClick={sendpixel} className="title is-size-2 has-text-centered shadowed cursor has-margin-top-20">
            >> Add my pixel to the paint
                   </h2>
  
        </div>
  
      </h2>
  
  
  
  
    );
  } 
  
};

export default Paint;