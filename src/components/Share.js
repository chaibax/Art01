import React, { Component, Fragment } from "react";
import '../images.css';
import { socket } from "./Socket";
import { useAuth0 } from "../react-auth0-wrapper";
import Typewriter from 'typewriter-effect';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton} from "react-share";


const Share  = ({ match }) =>    {

    const { getTokenSilently, loading, user } = useAuth0();
    const given_name = user.given_name;
    console.log(match.params.id);
    const shareUrl = 'https://www.1000000000.art';
    const title = '1000000000.art first massively participatory art project';


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
                  cursor: '<big>▮</big>',
                  delay: 150
                }}
                onInit={(typewriter) => {
                  typewriter.typeString('<big>'+given_name+', you are now painter number '+match.params.id+' in a billion</big>')
                    .pauseFor(1000)
                    .typeString('<br/>')
                    .typeString('<br/>')
                    .pauseFor(500)
                    .typeString('> ')
                    .typeString('<a style="text-deconration:none;color:#f0fff8"  href="mailto:weareart0x@gmail.com">Feedback</a>')
                    .typeString('<br/>')
                    .pauseFor(500)
                    .typeString('> ')
                    .typeString('<a style="text-deconration:none;color:#f0fff8" target="_blank" href="https://github.com/chaibax/Art01">About</a>')
                    .typeString('<br/>')
                    .pauseFor(500)
                    .typeString('>> ')
                    .typeString('<a style="text-deconration:none;color:#f0fff8" href="/view/'+match.params.id+'">Back to painting</a>')
                    .callFunction(() => {
                        const element = document.getElementById("share");
                        element.classList.remove("is-hidden");
                      })
                    .start();
                }}
              />
           <br/><br/>
            <div id="share" className="is-hidden title is-size-2 has-text-centered shadowed" >
            <FacebookShareButton
            url={shareUrl}
            quote={title}
            className="link shadowed"
            >
                > Share on Facebook 
            </FacebookShareButton>
            | 
            <TwitterShareButton
            url={shareUrl}
            quote={title}
            className="link shadowed"
            > Twitter
            </TwitterShareButton>
            </div>
            </h1>

            </Fragment>
        )
    };

export default Share;