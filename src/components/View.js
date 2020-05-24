import React, { Component, Fragment } from "react";
import '../images.css';
import { socket } from "./Socket";
import axios from 'axios';
import NavBar from "./NavBar";

var spiral = require('zero-indexed-ulam-spiral');

class View extends Component {


    constructor(props) {

        super(props);
        //console.log('REACT_APP_AWS_S3_ROOT_URL = '+process.env.REACT_APP_AWS_S3_ROOT_URL);    
        this.canvasRef = React.createRef();
        this.state = {
            link: process.env.REACT_APP_AWS_S3_ROOT_URL + "/Art0x.png",
            position: parseInt(props.match.params.id),
            pixeladded_image: process.env.REACT_APP_AWS_S3_ROOT_URL + "/Art0x-" + parseInt(props.match.params.id) + ".png",
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
        let result = spiral.getLatticeCoordinatesFor(position);
        let size = squaresize; //Math.max(Math.abs(result[0]),Math.abs(result[1]));
        //coordonné dans le nouveau referentiel

        let modifx = Math.floor(size / 2);
        if (result_old[1] == 0) {
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
            //document.getElementById('card').innerHTML = data.given_name+' added pixel #'+data.newpixel.position+ ' now';

            let result = spiral.getLatticeCoordinatesFor(data.newpixel.position);
            let size = Math.max(Math.abs(result[0]), Math.abs(result[1]));
            //return ((2*size)+1


            this.refresh((2 * size) + 1);

        });
    }

    componentWillUnmount() {
        //  clearInterval(this.interval);
    }
    render() {

        return (

            <Fragment>
                <h1 className="title is-size-3 has-text-centered shadowed">
                    Your are the painter #{this.state.position + 1}
                    </h1>
                <div className="imageblink ">
                    <div className="has-text-centered" >


                    </div></div>
                <div className="imageblink ">
                    <div className="has-text-centered">



                        <canvas ref={this.canvasRef} className="piximagerendering pastel bottom" id="canvart" style={{ backgroundColor: 'rgba(255, 255, 255, 1)', height: '85vmin', width: '85vmin', zIndex: 1 }}
                            width={this.state.squaresize} height={this.state.squaresize}></canvas>


                        <a href={this.state.link} download="Art01.png" target="_blank">
                            <img id="art01" src={this.state.link} className="imagetop piximagerendering" style={{ backgroundColor: 'rgba(255, 255, 255, 1)', height: '85vmin', width: '85vmin', zIndex: 1 }} />
                        </a>



                    </div>

                    <h2 className="title is-size-3 has-text-centered shadowed">  This is ART01 right now</h2>
                     <NavBar />
                </div>


               

            </Fragment>
        )
    };
}
export default View;