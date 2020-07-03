
const authConfig = {
    domain: "login.1000000000.art",
    audience: "https://art01/"
  };

  const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');


  // Define middleware that validates incoming bearer tokens
// using JWKS from art0x.eu.auth0.com
exports.checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
    }),
  
    audience: authConfig.audience,
    issuer: `https://${authConfig.domain}/`,
    algorithm: ["RS256"]
  });
  
