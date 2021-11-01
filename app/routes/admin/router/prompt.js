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
const CommonValidation = require("../../../validators/admin/CommonValidation");

//
const PromptController = require("../../../controllers/api/v1/admin/PromptController");

/**
 * Gender Routes
 */

router.get(apiRoute.PROMPT.LIST, PromptController.list);

router.post(apiRoute.PROMPT.STORE, PromptController.store);

router.patch(apiRoute.PROMPT.UPDATE, PromptController.update);

router.patch(
  apiRoute.PROMPT.UPDATE_OPTION,
  PromptController.updatePromptOption
);

router.delete(apiRoute.PROMPT.DELETE, PromptController.destroyPrompt);
router.delete(
  apiRoute.PROMPT.DELETE_OPTION,
  PromptController.destroyPromptOption
);

module.exports = router;
