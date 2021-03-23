var express = require('express');
var router = express.Router();

/**
 * Route Configs
 */
const routeConfig = require('../config');
const apiRoute = routeConfig.apiRoute;

/**
 * Validators
 */
const PeerValidation = require('../../../validators/front/PeerValidation');

/**
 * Peer Controller
 */
var PeerController = require('../../../controllers/api/v1/front/PeerController');
PeerController = new PeerController();


/**
 * Peer Routes
 */

router.post(apiRoute.USER_PEER_MATCH, [PeerValidation.Validation], PeerController.store);

router.post(apiRoute.USER_PEER_UNMATCH, [PeerValidation.Validation], PeerController.storePeerUnMatch);

module.exports = router;
