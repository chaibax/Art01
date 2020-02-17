import React from "react";
import {useAuth0} from "../react-auth0-wrapper";
import ViewColorFromIp from "./ViewColorFromIp"; // a degager
import Typewriter from 'typewriter-effect';






const Paint = () => {

  function sendpixel () {

    const axios = require('axios');

    axios.get('http://localhost:3001/api/pixels/add', {
      params: {
        pixel: FirstIP,
        email: email,
        auth0Id: auth0Id

      }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
    
    };
    const {loading, user} = useAuth0();
    const FirstIP = user['https://art01/FirstIP'];
    const given_name =  user.given_name;
    const email =  user.email;
    const auth0Id =  user['https://art01/user_id'];

    if (loading || !user) {
        return (
            <div className="pageloader is-active">
                <span className="title">Loading Art01</span>
            </div>
        );
    }
    return (
    

            <h2 className="title is-size-3 has-text-centered shadowed">

    <Typewriter
                options={{
                  loop: false,
                  cursor: '<big>▮</big>'
                }}
                onInit={(typewriter) => {
                  typewriter.typeString('<big>Hello '+given_name+'</big>')
                    .pauseFor(2)
                    .pauseFor(1)
                    .typeString('<br/>')
                    .pauseFor(1)
                    .typeString('your IP is: '+FirstIP)
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
                <ViewColorFromIp ip={FirstIP}/>
                    <h2 onClick={sendpixel} className="title is-size-2 has-text-centered shadowed cursor has-margin-top-20">
                        >> Add my pixel to the paint
                 </h2>
           
            </div>
       
    </h2>




    );
};

export default Paint;