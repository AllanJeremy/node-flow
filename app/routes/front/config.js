const authRoute = {
  AUTH_LOGIN: '/auth/signin',
  AUTH_REGISTER:'/auth/signup',
  VERIFY_EMAIL: '/auth/email/verify',
  RESEND_CODE: '/auth/email/resend_code',
  FORGOT_PASSWORD_REQUEST: '/auth/reset_password',
  FORGOT_PASSWORD: '/auth/reset_password/verify',
}

const apiRoute = {
  PROFILE_BASIC: '/profile/basic',
  PROFILE_RACE_LIST:'/profile/race/list',
  PROFILE_RACE_STORE:'/profile/race/store',
  PROFILE_GENDER_LIST:'/profile/gender/list',
  PROFILE_GENDER_STORE:'/profile/gender/store',
  PROFILE_SEXUAL_ORIENTATION_LIST:'/profile/sexual_orientation/list',
  PROFILE_SEXUAL_ORIENTATION_STORE:'/profile/sexual_orientation/store',
  PROFILE_HEALTH_CATEGORY_LIST:'/profile/health_category/list',
  PROFILE_HEALTH_CATEGORY_STORE:'/profile/health_category/store',
}

module.exports = {
  authRoute,
  apiRoute
}
