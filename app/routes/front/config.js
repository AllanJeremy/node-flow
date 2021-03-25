const authRoute = {
  AUTH_LOGIN: '/auth/signin',
  AUTH_REGISTER:'/auth/signup',
  VERIFY_EMAIL: '/auth/email/verify',
  RESEND_CODE: '/auth/email/resend_code',
  FORGOT_PASSWORD_REQUEST: '/auth/reset_password',
  FORGOT_PASSWORD: '/auth/reset_password/verify',
  REPORTED_REASON: '/reported_reasons',
}

const apiRoute = {
  USER_PROFILE_INTEREST: '/user/profile/interest',
  USER_PROFILE_BASIC: '/user/profile/basic',
  USER_PROFILE_BASIC_SUMMARY: '/user/profile/basic/store/summary',
  USER_PROFILE_RACE_LIST: '/user/profile/race/list',
  USER_PROFILE_RACE_STORE: '/user/profile/race/store',
  USER_PROFILE_GENDER_LIST: '/user/profile/gender/list',
  USER_PROFILE_GENDER_STORE: '/user/profile/gender/store',
  USER_PROFILE_SEXUAL_ORIENTATION_LIST: '/user/profile/sexual_orientation/list',
  USER_PROFILE_SEXUAL_ORIENTATION_STORE: '/user/profile/sexual_orientation/store',
  USER_PROFILE_HEALTH_CATEGORY_LIST: '/user/profile/health_category/list',
  USER_PROFILE_HEALTH_CATEGORY_STORE: '/user/profile/health_category/store',
  USER_PROFILE_FAMILY_DYNAMIC_LIST: '/user/profile/family_dynamic/list',
  USER_PROFILE_FAMILY_DYNAMIC_STORE: '/user/profile/family_dynamic/store',
  USER_PROFILE_WORKOUT_LIST: '/user/profile/workout/list',
  USER_PROFILE_WORKOUT_STORE: '/user/profile/workout/store',
  USER_PERSONALITY_QUESTION_LIST: '/user/profile/personality_question/list',
  USER_PERSONALITY_QUESTION_STORE: '/user/profile/personality_question/store',

  COVERSATION_STARTER__LIST: '/user/conversation_starter/list',
  COVERSATION_STARTER_STORE: '/user/conversation_starter/store',

  USER_PEER_MATCH: '/user/peer/match',
  USER_PEER_UNMATCH: '/user/peer/unmatch',
  USER_PEER_LIST: '/user/peer/list',
  USER_PEER_MUTE: '/user/peer/mute',
  USER_PEER_UNMUTE: '/user/peer/unmute',

  USER_PROFILE_VISIBILITY: '/user/profile/visibility',

  USER: '/user/:id?',

}

module.exports = {
  authRoute,
  apiRoute
}
