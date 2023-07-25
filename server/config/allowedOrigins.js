const allowedOrigins = [
  process.env.SERVER_ORIGIN,
  process.env.CLIENT_ORIGIN,
  process.env.AZURE_ORIGIN,
  process.env.PROD_ORIGIN,
  process.env.LOCALHOST_API,
  process.env.LOCALHOST_CLIENT,
]

export default allowedOrigins;