const authRoute = {
  AUTH_LOGIN: '/auth/signin',
  AUTH_REGISTER:'/auth/signup',
  VERIFY_EMAIL: '/auth/email/verify',
  RESEND_CODE: '/auth/email/resend_code',
  FORGOT_PASSWORD_REQUEST: '/auth/reset_password',
  FORGOT_PASSWORD: '/auth/reset_password/verify',
}

const apiRoute = {
  PROFILE_BASIC: '/profile/basic'
}

module.exports = {
  authRoute,
  apiRoute
}
