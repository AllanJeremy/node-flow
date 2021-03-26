const routePrefix = '/admin';

const authRoute = {
  AUTH_LOGIN: '/auth/signin',
  ADMIN_PERMISSION_LIST:'/admin_permission/list',
  ADMIN_USER_PERMISSION_LIST:'/admin_permission/list/:user_id',
  AUTH_TOKEN: '/auth/token',
}

const apiRoute = {

  RACE: {
    LIST: '/race/list',
    STORE:'/race/store',
    UPDATE: '/race/update/:id',
    DELETE:'/race/delete/:id',
    MERGE: '/race/merge'
  },

  GENDER: { 
    LIST: '/gender/list',
    STORE: '/gender/store',
    UPDATE: '/gender/update/:id',
    DELETE: '/gender/delete/:id',
    MERGE: '/gender/merge'
  },

  SEXUAL_ORIENTATION: {
    LIST:'/sexual_orientation/list',
    STORE: '/sexual_orientation/store',
    UPDATE: '/sexual_orientation/update/:id',
    DELETE: '/sexual_orientation/delete/:id',
    MERGE: '/sexual_orientation/merge'
  },

  WORKOUT: {
    LIST: '/workout/list',
    STORE: '/workout/store',
    UPDATE: '/workout/update/:id',
    DELETE: '/workout/delete/:id',
    MERGE:'/workout/merge'
  },

  HEALTH_CATEGORY: {
    LIST: '/health_category/list',
    STORE: '/health_category/store',
    UPDATE: '/health_category/update/:id',
    DELETE: '/health_category/delete/:id',
    MERGE: '/health_category/merge'
  },

  FAMILY_DYNAMIC: {
    LIST: '/family_dynamic/list',
    STORE: '/family_dynamic/store',
    UPDATE: '/family_dynamic/update/:id',
    DELETE: '/family_dynamic/delete/:id',
    MERGE:  '/family_dynamic/merge'  
  },

  ADMIN_USER: {
    LIST:  '/admin_user/list',
    STORE: '/admin_user/store',
    UPDATE:'/admin_user/update/:id',
    DELETE: '/admin_user/delete/:id'
  },

  ADMIN_PERMISSION: {
    LIST: '/admin_permission/list',
    STORE:'/admin_permission/store'
  },

  PERSONALITY_QUESTION: {
    LIST: '/personality_question/list',
    STORE: '/personality_question/store',
    UPDATE: '/personality_question/update/:id',    
    DELETE: '/personality_question/delete/:id'
  },

  USER: {
    LIST: '/user/list',
    SHOW: '/user/show/:id',
    UPDATE_STATUS: '/user/update/status'
  },

  CONVERSATION_STARTER: {
    LIST:  '/conversation_starter/list',
    STORE: '/conversation_starter/store',
    UPDATE: '/conversation_starter/update/:id',
    DELETE: '/conversation_starter/delete/:id'
  },

  REPORTED_USERS: {
    LIST:  '/reported_users/list',
    NEW: '/reported_users/new',
    READ: '/reported_users/read/:id',
    UNREAD: '/reported_users/unread/:id'
  },

};

module.exports = {
  routePrefix,
  authRoute,
  apiRoute
}
