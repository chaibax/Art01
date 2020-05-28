import React, { Component, Fragment } from "react";
import '../images.css';
import { socket } from "./Socket";


class About extends Component {


    render() {
        return (
            <Fragment>
                <h1 className="title is-size-3 has-text-centered shadowed">
                You added your pixel. <a href="">Next >> Your are the painter #{this.state.position + 1}</a>
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

                    <h2 className="title is-size-3 has-text-centered shadowed">  Next >> </h2>
               
                </div>


               

            </Fragment>
        )
    };
}
export default About;