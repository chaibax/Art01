import React, { Component, Fragment } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import '../images.css';
import {socket} from "./Socket";


class View  extends Component  {

    constructor(props){
        super(props);

        console.log('REACT_APP_AWS_S3_ROOT_URL = '+process.env.REACT_APP_AWS_S3_ROOT_URL);
        this.state = {
            link: process.env.REACT_APP_AWS_S3_ROOT_URL + "/Art0x.png",
            position : parseInt(props.match.params.id),
            pixeladded_image : process.env.REACT_APP_AWS_S3_ROOT_URL + "/Art0x-" + parseInt(props.match.params.id) + ".png", 
            compteur : 0
          }
      }


      refresh(){
        console.log('refresh!');
       
        this.setState(state => ({
            link: process.env.REACT_APP_AWS_S3_ROOT_URL + "/Art0x.png?t="+Date.now()
          }));
      }
      componentDidMount(){
       console.log('mounted');
      // this.interval = setInterval(() => this.refresh(), 10000);
      

socket.on('newpixel', (data) => {
  //document.getElementById('card').innerHTML = data.given_name+' added pixel #'+data.newpixel.position+ ' now';
  //console.log(data);
  this.refresh();

  });
      
      
      }

      componentWillUnmount() {
      //  clearInterval(this.interval);
      }

    render() {
       
        return(
            
        <Fragment>
            <h1 className="title is-size-2 has-text-centered shadowed">
         ART01 now. Your are the painter #{this.state.position + 1}
            </h1>

            <div className="imageblink ">
                <div className="has-text-centered">

               
                  <a href={this.state.link} download="Art01.png" target="_blank"><img src={this.state.pixeladded_image} className="bottom piximagerendering" style={{ backgroundColor: 'rgba(255, 255, 255, 1)', height: '80vmin', width: '80vim', zIndex: 1 }} /></a>
                    <a href={this.state.link} download="Art01.png" target="_blank">
                        <img src={this.state.link} className="imagetop piximagerendering" style={{  backgroundColor: 'rgba(255, 255, 255, 1)', height: '80vmin', width: '80vim', zIndex: 1 }} />
                    </a>



                </div>
            </div>

        </Fragment>
        )
    };
}
export default View;