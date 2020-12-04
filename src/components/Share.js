import React, { Fragment } from "react";
import '../images.css';
import { useAuth0 } from "../react-auth0-wrapper";
import { FacebookShareButton, TwitterShareButton } from "react-share";

var moment = require('moment');
const Share = ({ match }) => {

  const axios = require('axios');

  var count2 = 0;
  axios.get(process.env.REACT_APP_API_BASE_URL + '/pixels/count')
    .then(function (response) {
      // handle success
      var given = moment("2020-04-01", "YYYY-MM-DD");
      var current = moment().startOf('day');
      //Difference in number of days
      var dif = moment.duration(given.diff(current)).asDays();
      count2 = response.data.count;
      console.log("count2="+count2)

      document.getElementById("count").innerHTML = response.data.count;
      let pourcentage = (response.data.count * 100) / 1000000000;
      document.getElementById("pourcentage").innerHTML = pourcentage.toFixed(7);

      let date_fin = ((-100 * dif) / pourcentage.toFixed(7)) / 365;
      document.getElementById("date_fin").innerHTML = date_fin.toFixed(0);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    
  const { logout, loading, user } = useAuth0();
  var given_name = user.given_name;
  if(given_name   === undefined) {given_name = user.nickname}
  const shareUrl = 'https://www.1000000000.art';
  const title = '1000000000.art first massively participatory art project';
  const art01url = process.env.REACT_APP_AWS_S3_ROOT_URL + "/Art0x.png";

  if (loading || !user) {
    return (
      <div className="pageloader is-active">
        <span className="title">Loading 1000000000.art</span>
      </div>
    );
  }
  return (
    <Fragment>
      <h1 className="title is-size-2 has-text-centered shadowed">

      <big>{given_name} you are painter number {match.params.id} in a billion</big>
      </h1>
    <center>
      <div style={{height: '80vmin', width: '80vmin'}} id="image">
        <img src="https://1000000000.s3.amazonaws.com/Art0x.png" style={{backgroundColor: 'rgb(255, 255, 255)', height: '80vmin', width: '80vmin', zIndex: 1, imageRendering: 'pixelated'}} />
      </div>
      </center>


      <div id="share" className="title  has-text-centered shadowed" >

            <p> <span id='count'>0</span> painters. <span id="pourcentage"></span>% of the painting is complete. At this rate, 1000000000.art be finished in <span id="date_fin"></span> years.
</p></div>



      <br/>
      <div id="share" className="title  has-text-centered shadowed" >
      <a style={{ textDeconration: 'none', color: '#f0fff8' }} target="_blank" href="{art01url}">{'>'}  Download painting (real size)</a>
      <br/>

      

      <a style={{ textDeconration: 'none', color: '#f0fff8' }} target="_blank" href="mailto:hello@1000000000.art">{'>'}  Feedback</a>
      <br/>
      <a style={{ textDeconration: 'none', color: '#f0fff8' }} target="_blank" href="https://github.com/chaibax/Art01">{'>'}  About</a>
        </div>
       
      
        <div id="share" className="title  has-text-centered shadowed" >
          <FacebookShareButton
            url={shareUrl}
            quote={title}
            className="link shadowed"
          >
            {'>'} Share on Facebook
            </FacebookShareButton>
            |
            <TwitterShareButton
            url={shareUrl}
            quote={title}
            className="link shadowed"
          > Twitter
            </TwitterShareButton>

          <br />

          <a style={{ textDeconration: 'none', color: '#f0fff8' }} onClick={() => logout({ returnTo: window.location.origin })}>
          {'>'} logout &nbsp;
                </a>
        </div>
    

    </Fragment>
  )
};

export default Share;