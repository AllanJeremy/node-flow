const routePrifix = '/admin';

const authRoute = {
  AUTH_LOGIN: '/auth/signin'
}

const apiRoute = {

  RACE_LIST: {
    name: '/race/list',
    label: 'Race list',
  },
  RACE_STORE: {
    name: '/race/store',
    label: 'Race create'
  },
  RACE_UPDATE: {
    name: '/race/update/:id',
    label: 'Race edit'
  },
  RACE_DELETE: {
    name: '/race/delete/:id',
    label: 'Race delete'
  },

  GENDER_LIST: {
    name: '/gender/list',
    label: 'Gender list'
  },
  GENDER_STORE: {
    name: '/gender/store',
    label: 'Gender create'
  },
  GENDER_UPDATE: {
    name: '/gender/update/:id',
    label: 'Gender edit'
  },
  GENDER_DELETE: {
    name: '/gender/delete/:id',
    label: 'Gender delete'
  },

  SEXUAL_ORIENTATION_LIST: {
    name: '/sexual_orientation/list',
    label: 'Sexual orientation list'
  },
  SEXUAL_ORIENTATION_STORE: {
    name: '/sexual_orientation/store',
    label: 'Sexual orientation create'
  },
  SEXUAL_ORIENTATION_UPDATE: {
    name: '/sexual_orientation/update/:id',
    label: 'Sexual Orientation edit'
  },
  SEXUAL_ORIENTATION_DELETE: {
    name: '/sexual_orientation/delete/:id',
    label: 'Sexual orientation delete'
  },

  WORKOUT_LIST: {
    name: '/workout/list',
    label: 'Workout list'
  },
  WORKOUT_STORE: {
    name: '/workout/store',
    label: 'Workout create'
  },
  WORKOUT_UPDATE: {
    name: '/workout/update/:id',
    label: 'Workout edit'
  },
  WORKOUT_DELETE: {
    name: '/workout/delete/:id',
    label: 'Workout delete'
  },

  HEALTH_CATEGORY_LIST: {
    name: '/health_category/list',
    label: 'Health category list'
  },
  HEALTH_CATEGORY_STORE: {
    name: '/health_category/store',
    label: 'Health category create'
  },
  HEALTH_CATEGORY_UPDATE: {
    name: '/health_category/update/:id',
    label: 'Health category edit'
  },
  HEALTH_CATEGORY_DELETE: {
    name: '/health_category/delete/:id',
    label: 'Health category delete'
  },

  FAMILY_DYNAMIC_LIST: {
    name: '/family_dynamic/list',
    label: 'Family dynamic list'
  },
  FAMILY_DYNAMIC_STORE: {
    name: '/family_dynamic/store',
    label: 'Family dynamic create'
  },
  FAMILY_DYNAMIC_UPDATE: {
    name: '/family_dynamic/update/:id',
    label: 'Family dynamic edit'
  },
  FAMILY_DYNAMIC_DELETE: {
    name: '/family_dynamic/delete/:id',
    label: 'Family dynamic delete'
  },

  ADMIN_USER_LIST: {
    name: '/admin_user/list',
    label: 'Admin user list'
  },
  ADMIN_USER_STORE: {
    name: '/admin_user/store',
    label: 'Admin user create'
  },
  ADMIN_USER_UPDATE: {
    name: '/admin_user/update/:id',
    label: 'Admin user edit'
  },
  ADMIN_USER_DELETE: {
    name: '/admin_user/delete/:id',
    label: 'Admin user delete'
  },
};

module.exports = {
  routePrifix,
  authRoute,
  apiRoute
}
