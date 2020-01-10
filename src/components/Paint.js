import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import AsyncFetcher from "react-async-fetcher";
import ViewColorFromIp from "./ViewColorFromIp";

const Paint = () => {
  const { loading, user } = useAuth0();
  if (loading || !user  ) {
    return (
      <div>Loading paint page...</div>
    );
  }
  return (
      <h2>Hello {user.given_name}, yout IP is 
      <AsyncFetcher url="https://api.ipify.org?format=json">
    {({ isLoading, error, data }) => {
      // some loading state...
      if (isLoading) {
        return <p>Searching your ip...</p>;
      }

      // if has any error in your request
      if (error) {
        return (
          <p>
            <strong>Error:</strong> {error}
          </p>
        );
      }
      return (
        <Fragment>
        <div>  
        <p>
          {data.ip}
         </p>

          So, your pixel color is : 
          <br/>
          <br/>            
           <ViewColorFromIp ip={data.ip} />
         
        <p>
          <button className="button">Paint my pixel</button>
        </p>
        </div>
        </Fragment>
      );
    }}
  </AsyncFetcher>
      </h2>
     

  );
};

export default Paint;