import jwt from "express-jwt"
import jwksRsa from "jwks-rsa"

// if the access token exists, it will be verified against the Auth0 JSON Web Key Set
const authConfig = {
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
}

// Validate incoming bearer token
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${authConfig.domain}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: authConfig.audience,
  issuer: `${authConfig.domain}/`,
  algorithms: ["RS256"],
})

export default checkJwt