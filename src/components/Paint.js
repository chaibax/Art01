import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import ViewColorFromIp from "./ViewColorFromIp"; // a degager

const Paint = () => {
  const { loading, user } = useAuth0();
  const FirstIP = user['https://art01/FirstIP'];
  if (loading || !user  ) {
    return (
      <div>Loading paint page...</div>
    );
  }
  return (
      <h2>Hello {user.given_name}, yout IP is ==> {FirstIP} ==
     
        <Fragment>
        <div>  
        <p>
          {FirstIP}
         </p>

          So, your pixel color is : 
          <br/>
          <br/>            
           <ViewColorFromIp ip={FirstIP} />
         
        <p>
          <button className="button">Paint my pixel</button>
        </p>
        </div>
        </Fragment>

      </h2>
     

  );
};

export default Paint;