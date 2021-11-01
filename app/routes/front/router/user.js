var express = require("express");
var router = express.Router();

/**
 * Route Configs
 */
const routeConfig = require("../config");
const apiRoute = routeConfig.apiRoute;

/**
 * Validators
 */
const UserValidation = require("../../../validators/front/UserValidation");

/**
 * User Profile Controller
 */
var UserProfileController = require("../../../controllers/api/v1/front/UserProfileController");
UserProfileController = new UserProfileController();

const PromptController = require("../../../controllers/api/v1/front/PromptController");

/**
 * User Profile Routes
 */
router.post(
  apiRoute.USER_PROFILE_BASIC,
  UserValidation.Profile,
  UserProfileController.store
);

router.post(
  apiRoute.USER_PROFILE_BASIC_SUMMARY,
  UserValidation.ProfileSummary,
  UserProfileController.update
);

router.post(
  apiRoute.USER_PROFILE_INTEREST,
  UserValidation.UserInterest,
  UserProfileController.userInterestStore
);

router.post(
  apiRoute.USER_PROFILE_VISIBILITY,
  UserValidation.visibility,
  UserProfileController.visibility
);

router.post(
  apiRoute.USER_CHANGE_PASSWORD,
  UserValidation.ChangePassword,
  UserProfileController.changePassword
);
router.post(
  apiRoute.MATCHING_PREFERENCE_STORE,
  UserValidation.MatchingPreference,
  UserProfileController.StoreMatchingPreference
);

router.get(apiRoute.USER, UserProfileController.show);

router.get(
  apiRoute.USER_ACCOUNT_DEACTIVATE,
  UserProfileController.AccountDeactivate
);

router.get(apiRoute.USER_ACCOUNT_DELETE, UserProfileController.AccountDelete);

router.post(
  apiRoute.USER_SETTINGS_STORE,
  [],
  UserProfileController.settingStore
);

//* Prompt related endpoints
router.get(apiRoute.USER_PROMPT_LIST, PromptController.list);

router.post(apiRoute.USER_PROMPT_STORE, PromptController.store);

router.patch(apiRoute.USER_PROMPT_UPDATE, PromptController.update);

router.delete(apiRoute.USER_PROMPT_DESTROY, PromptController.destroy);

module.exports = router;
