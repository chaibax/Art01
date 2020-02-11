import React from "react";
import {useAuth0} from "../react-auth0-wrapper";
import ViewColorFromIp from "./ViewColorFromIp"; // a degager
import Typewriter from 'typewriter-effect';



const Paint = () => {
    const {loading, user} = useAuth0();
    const FirstIP = user['https://art01/FirstIP'];
    const given_name =  user.given_name;

   

    if (loading || !user) {
        return (
            <div className="pageloader is-active">
                <span className="title">Loading Art01</span>
            </div>
        );
    }
    return (
    

            <h2 className="title is-size-2 has-text-centered shadowed">

    <Typewriter
                options={{
                  loop: false,
                  cursor: '<big>▮</big>'
                }}
                onInit={(typewriter) => {
                  typewriter.typeString('<big>Hello '+given_name+'</big>')
                    .pauseFor(2000)
                    .pauseFor(1000)
                    .typeString('<br/>')
                    .pauseFor(1000)
                    .typeString('your IP is: '+FirstIP)
                    .pauseFor(2500)
                    .typeString('<br/>')
                    .typeString(' So, your pixel color is : ')
                    .pauseFor(2500)
                    .callFunction(() => {
                        const element = document.getElementById("mypixel");
                        element.classList.remove("is-hidden");
                      })
                    .start();
                }}
              />

       
            <div id="mypixel" className="is-hidden">   
                <ViewColorFromIp ip={FirstIP}/>
                    <br/>
                    <h2 className="title is-size-2 has-text-centered shadowed cursor has-margin-top-20">
                        >> Add my pixel to the paint
                 </h2>
           
            </div>
       
    </h2>




    );
};

export default Paint;