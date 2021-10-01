import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import { socket } from "./Socket";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactGA from "react-ga";

var moment = require("moment");
require("moment/locale/fr");
require("moment/locale/es");

const Start = () => {
  ReactGA.initialize("UA-179027037-1");
  ReactGA.pageview(window.location.pathname + window.location.search);
  ReactGA.event({
    category: "user_" + window.location.hostname,
    action: "view_start",
  });

  const { t, i18n } = useTranslation();

  const { loginWithRedirect } = useAuth0();
  const history = useHistory();
  const axios = require("axios");
  socket.on("newpixel", (data) => {
    console.log("+1");
  });
  var count2 = 0;
  axios
    .get(process.env.REACT_APP_API_BASE_URL + "/pixels/count")
    .then(function (response) {
      // handle success

      var given = moment("2020-04-01", "YYYY-MM-DD");
      var current = moment().startOf("day");
      //Difference in number of days
      var dif = moment.duration(given.diff(current)).asDays();
      count2 = response.data.count;
      moment.locale(i18n.language);
      document.getElementById("count").innerHTML = response.data.count;
      document.getElementById("since").innerHTML = moment(
        "20200727",
        "YYYYMMDD"
      ).fromNow();
      let pourcentage = (response.data.count * 100) / 1000000000;
      //document.getElementById("pourcentage").innerHTML = pourcentage.toFixed(7);

      let date_fin = (-100 * dif) / pourcentage.toFixed(7) / 365;
      document.getElementById("date_fin").innerHTML = date_fin.toFixed(0);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (evt.keyCode === 8) {
      history.push("/");
    }
  };
  return (
    <Fragment>
      <div className=" is-size-4 is-size-5-mobile	 has-text-centered	" id="start1" onClick={() =>
            loginWithRedirect({
              appState: {
                targetUrl:
                  window.location.origin + "/participate",
              },
            })
          }>
        {t(
          "Let's make participatory Art together"
        )}
        .
        <br />
        <span className=" is-size-4 is-size-5-mobile ">
          <p>
            {" "}
            {t("By registering, you allow artists to create Art with your data, such as paintings or music.")} 
            {t('This project started')}  <span id="since">0</span>  {t('and will end when 1,000,000 people participate')}. {" "}
            {t("For the moment")}, <span id="count">0</span>{" "}
            {t("people have participated")}{" "}
           .  {" "}
             {t(" At this rate, 1000000000.art be finished in")}{" "}
            <span id="date_fin"></span> {t("years")}.<br/>
            <br/>{t(
          "Add your Facebook or Google profile picture, or your initials (non-social signgup with an email)"
            )}
          </p>
        </span>
        <br />
        <div
        
          className=" button is-large  is-rounded is-dark"
          onClick={() =>
            loginWithRedirect({
              appState: {
                targetUrl:
                  window.location.origin + "/participate",
              },
            })
          }
        >
          {t("Participate")}
        </div>

        <br/><br/>
       

            <p>
              {t(
                "This is a free, non-commercial, open source, participatory art project. I have nothing to sell."
              )}
            </p>
      </div>
      <div
        className="cursor"
        onClick={() =>
          loginWithRedirect({
            appState: { targetUrl: window.location.origin + "/participate" },
          })
        }
      >
        <div className="is-hidden" id="nexttext">
          <span className="shadowed is-size-4 ">
            <p>
              {" "}
              {t("For the moment")}, <span id="count">0</span>{" "}
              {t(
                "people have participated to this project since its beginning"
              )}
              
            </p>
            <p>
              {t("At this rate, 1000000000.art be finished in")}{" "}
              <span id="date_fin"></span> {t("years")}.
            </p>
          </span>
          <a
            href=""
            className="title button is-large is-rounded is-rounded is-dark is-size-2 has-text-centered shadowed cursor has-margin-top-20"
            onClick={() =>
              loginWithRedirect({
                appState: { targetUrl: window.location.origin + "/participate" },
              })
            }
          >
            {t("Participate")}
          </a>
          <br />
          <br />
          <span className="shadowed is-size-6 ">
            <p>
              {t(
                "Because there cannot be several particiaption per person, your email/signup will be requested in the next step."
              )}
            </p>

            <p>
              {t(
                "This is a free, non-commercial, open source, participatory art project. I have nothing to sell."
              )}
            </p>
          </span>
        </div>
      </div>
    </Fragment>
  );
};

export default Start;
