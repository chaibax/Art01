import React, {Fragment} from "react";
import {useAuth0} from "../react-auth0-wrapper";
import ViewColorFromIp from "./ViewColorFromIp"; // a degager
import NavBar from "./NavBar";
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
    
        <section className="hero is-medium">
        <div className="hero-body">
          <div className="columns is-centered">
            <div className="container">
            <h1 className="title is-size-1 has-text-centered shadowed">

    <Typewriter
                options={{
                  loop: false,
                  cursor: '<big>▮</big>'
                }}
                onInit={(typewriter) => {
                  typewriter.typeString('<big>Hello '+given_name+' </big>')
                    .pauseFor(2000)
                    .callFunction(() => {

                    })
                    .pauseFor(1000)
                    .callFunction(() => {
                      console.log('Bonjour '+given_name+' 👋');
                    })
                    .typeString('<br/>')
                    .pauseFor(1000)
                    .typeString('<br/>your IP is: '+FirstIP)
                    .pauseFor(3500)
                    .typeString('<br/>')
                    .pauseFor(500)
                    .typeString('<br/>')
                    .typeString(' So, your pixel color is : ')
                    .pauseFor(5100)
                    .callFunction(() => {
                        const element = document.getElementById("mypixel");
                        element.classList.remove("is-hidden");
                      })
                    .start();
                }}
              />

        <Fragment>
            <div id="mypixel" className="is-hidden">
            
                <ViewColorFromIp ip={FirstIP}/>

                <p> 
                    <br/>
                    <br/>
                    <br/>
                    <button className="button">Paint my pixel</button>
                </p>
            </div>
        </Fragment>
    </h1>
        <NavBar/>
      =====

</div>
</div>
</div>
</section>

    );
};

export default Paint;