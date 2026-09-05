export function errorMiddleware(error, _request, response, _next) {
  console.error(error)

  let statusCode = error.statusCode || 500
  let message = 'Internal server error.'
  if (error.code === 11000) {
    statusCode = 409
    message = 'A resource with those details already exists.'
  } else if (error.name === 'ValidationError' || error.name === 'CastError') {
    statusCode = 400
    message = 'The submitted data is invalid.'
  } else if (statusCode >= 400 && statusCode < 500 && error.safeMessage) {
    message = error.safeMessage
  } else if (statusCode >= 400 && statusCode < 500 && error.message) {
    message = error.message
  }

  return response.status(statusCode).json({ success: false, message })
}