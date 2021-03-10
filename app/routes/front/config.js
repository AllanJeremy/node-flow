const authRoute = {
  AUTH_LOGIN: '/signin',
  AUTH_REGISTER:'/signup',
  VERIFY_EMAIL: '/verify/:token',
  FORGOT_PASSWORD_REQUEST: '/forgot_password',
  FORGOT_PASSWORD: '/forgot_password/:token',
}

module.exports = {
  authRoute
}
