import React, { Component, Fragment } from "react";
import '../images.css';
import { socket } from "./Socket";
import axios from 'axios';
import { Translation } from 'react-i18next';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-179027037-1');

var spiral = require('zero-indexed-ulam-spiral');

class View extends Component {

    constructor(props) {

        super(props);
        console.log('REACT_APP_AWS_S3_ROOT_URL = '+process.env.REACT_APP_AWS_S3_ROOT_URL);    
        this.canvasRef = React.createRef();
        
        var tmp_position = 1;
        if(parseInt(props.match.params.id)>-1) {
            window.current_position = props.match.params.id;
            
            tmp_position = parseInt(props.match.params.id);
        };

        this.state = {
            link: process.env.REACT_APP_AWS_S3_ROOT_URL + "/Art0x.png",
            position: tmp_position,
            pixeladded_image: process.env.REACT_APP_AWS_S3_ROOT_URL + "/Art0x-" + tmp_position + ".png",
            compteur: 0,
            squaresize: null
        }
    }

    imgSize() {
        var self = this;
        axios.get(process.env.REACT_APP_API_BASE_URL + '/pixels/squaresize', {
        }
        )
            .then(function (response) {
                if ((response.data.squaresize)) {
                    self.refresh(response.data.squaresize);
                } else {
                    console.log("error");
                }
            })
            .catch(function (error) {
                console.log(error);
            })

    }


    getNewLatticeCoordinatesFor = function (position, squaresize) {

        //Obtenir les cooronnées d'un pixel avec une orginie 0,0 en haut a gauche plustot qu'au centre du carré. Refentiel : 0,0 en haut a gauche 
        //C'est beaucoup plus pratique pour manipuler une image
        //coordonnée dans le referentien avec 0,0 au centre  :
        let result_old = spiral.getLatticeCoordinatesFor(position);
        
        //res.send({"x" : result_old[0], "y" : result_old[1]});
        let size = squaresize; //Math.max(Math.abs(result[0]),Math.abs(result[1]));
        //coordonné dans le nouveau referentiel
        let modifx = Math.floor(size / 2);
        if (result_old[1] === 0) {
            var newy = result_old[1] + Math.floor(size / 2);
        } else if (result_old[1] < 0) {
            var newy = Math.abs(result_old[1]) + Math.floor(size / 2);
        } else {
            var newy = Math.abs(result_old[1] - Math.floor(size / 2));
        }
        return [result_old[0] + modifx, newy]

    };
    refresh(size) {

        var self = this;
        this.setState(state => ({
            link: process.env.REACT_APP_AWS_S3_ROOT_URL + "/Art0x.png?t=" + Date.now(),
            squaresize: size
        }));
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        var image = new Image();
        image.onload = function () {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            // draw the image into the canvas
            ctx.fillStyle = "back";
            var coordonne = self.getNewLatticeCoordinatesFor(self.state.position, size);
            ctx.drawImage(image, 0, 0);
            ctx.fillRect(coordonne[0], coordonne[1], 1, 1);

        }
        image.src = process.env.REACT_APP_AWS_S3_ROOT_URL + "/Art0x.png?t=" + Date.now();
    }


    componentDidMount() {
        this.imgSize();
        socket.on('newpixel', (data) => {
            let result = spiral.getLatticeCoordinatesFor(data.newpixel.position);
            let size = Math.max(Math.abs(result[0]), Math.abs(result[1]));
            this.refresh((2 * size) + 1);
        });
    }

    componentWillUnmount() {
        //  clearInterval(this.interval);
    }
    render() {
        ReactGA.pageview(window.location.pathname + window.location.search);
        ReactGA.event({
          category: "user_"+window.location.hostname,
          action: "pixel_added",
        });
        return (

            <Fragment>


                <a className="link shadowed" href={"/share/"+ (this.state.position )} >
                <h1 className="title is-size-4-mobile	is-size-3-desktop has-text-centered shadowed blackbackground">
                <Translation>
      {
        (t, { i18n }) => <span>{t('You added your pixel. Click Next')}</span>
      }
    </Translation><big className="blink">▮</big>
                </h1>
                </a>
              
                <div >
                    <div className="has-text-centered">
                    <a className="link shadowed" href={"/share/"+ (this.state.position )} >
                     <img style={{ height: '80vmin', width: '80vmin' , backgroundColor: 'white' }} src={process.env.REACT_APP_SOCKET_URL +"/api/users/svg?id="+eval(this.state.position)} />
                   </a>
                    </div>
                    <h2 className="title is-size-3 has-text-centered shadowed blackbackground">  <a className="link shadowed" href={"/share/"+ (this.state.position)}>
                        <Translation>
      {
        (t, { i18n }) => <span>{t('Click Next')}</span>
      }
    </Translation><big className="blink">▮</big> </a></h2>
                   {/*  <NavBar />*/}  
                </div>
             
            </Fragment>
        )
    };
}
export default View;