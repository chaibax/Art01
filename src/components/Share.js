import React, { Fragment } from "react";
import '../images.css';
import { useAuth0 } from "../react-auth0-wrapper";
import Typewriter from 'typewriter-effect';
import { FacebookShareButton, TwitterShareButton } from "react-share";


const Share = ({ match }) => {

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
        <Typewriter
          options={{
            loop: false,
            cursor: '<big id="curs">▮</big>',
            delay: 30
          }}
          onInit={(typewriter) => {
            typewriter.typeString('<big>' + given_name + ', you are painter number ' + match.params.id + ' in a billion</big>')
              .pauseFor(1000)
              .changeDelay(20)
              .typeString('<br/>')
              .typeString('<br/>')
              .pauseFor(500)
              .typeString('> ')
              .typeString('<a style="text-deconration:none;color:#f0fff8" target="_blank" href="' + art01url + '">Download painting</a>')
              .typeString('<br/>')
              .pauseFor(500)
              .typeString('> ')
              .typeString('<a style="text-deconration:none;color:#f0fff8"  href="mailto:hello@1000000000.art">Feedback/Contact</a>')
              .typeString('<br/>')
              .pauseFor(500)
              .typeString('> ')
              .typeString('<a style="text-deconration:none;color:#f0fff8" target="_blank" href="https://github.com/chaibax/Art01">About</a>')
              .typeString('<br/>')
              .pauseFor(500)
              .typeString('>> ')
              .typeString('<a style="text-deconration:none;color:#f0fff8" href="/view/' + (match.params.id-1) + '">Back to painting</a>')
              .callFunction(() => {
                const element = document.getElementById("share");
                element.classList.remove("is-hidden");
              })
              .start();
          }}
        />
        <br /><br />
        <div id="share" className="is-hidden title is-size-2 has-text-centered shadowed" >
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

          <br /><br />

          <a style={{ textDeconration: 'none', color: '#f0fff8' }} onClick={() => logout({ returnTo: window.location.origin })}>
          {'>'} logout &nbsp;
                </a>
        </div>
      </h1>

    </Fragment>
  )
};

export default Share;