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
    label: 'Race Edit'
  },
  RACE_DELETE: {
    name: '/race/delete/:id',
    label: 'Race Delete'
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
    label: 'Gender Edit'
  },
  GENDER_DELETE: {
    name: '/gender/delete/:id',
    label: 'Gender Delete'
  },

  SEXUAL_ORIENTATION_LIST: {
    name: '/sexual_orientation/list',
    label: 'Sexual Orientation list'
  },
  SEXUAL_ORIENTATION_STORE: {
    name: '/sexual_orientation/store',
    label: 'Sexual Orientation create'
  },
  SEXUAL_ORIENTATION_UPDATE: {
    name: '/sexual_orientation/update/:id',
    label: 'Sexual Orientation Edit'
  },
  SEXUAL_ORIENTATION_DELETE: {
    name: '/sexual_orientation/delete/:id',
    label: 'Sexual Orientation Delete'
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
    label: 'Workout Edit'
  },
  WORKOUT_DELETE: {
    name: '/workout/delete/:id',
    label: 'Workout Delete'
  },

  HEALTH_CATEGORY_LIST: {
    name: '/health_category/list',
    label: 'Health Category list'
  },
  HEALTH_CATEGORY_STORE: {
    name: '/health_category/store',
    label: 'Health Category create'
  },
  HEALTH_CATEGORY_UPDATE: {
    name: '/health_category/update/:id',
    label: 'Health Category Edit'
  },
  HEALTH_CATEGORY_DELETE: {
    name: '/health_category/delete/:id',
    label: 'Health Category Delete'
  },

  FAMILY_DYNAMIC_LIST: {
    name: '/family_dynamic/list',
    label: 'Family Dynamic list'
  },
  FAMILY_DYNAMIC_STORE: {
    name: '/family_dynamic/store',
    label: 'Family Dynamic create'
  },
  FAMILY_DYNAMIC_UPDATE: {
    name: '/family_dynamic/update/:id',
    label: 'Family Dynamic Edit'
  },
  FAMILY_DYNAMIC_DELETE: {
    name: '/family_dynamic/delete/:id',
    label: 'Family Dynamic Delete'
  },
};

module.exports = {
  authRoute,
  apiRoute
}
