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

router.post(apiRoute.USER_PEER_MATCH, [PeerValidation.Validation], PeerController.match);

router.post(apiRoute.USER_PEER_UNMATCH, [PeerValidation.Validation], PeerController.unmatch);

router.get(apiRoute.USER_PEER_LIST, PeerController.list);

router.post(apiRoute.USER_PEER_MUTE, [PeerValidation.Validation], PeerController.mute);

router.post(apiRoute.USER_PEER_UNMUTE, [PeerValidation.Validation], PeerController.unmute);

module.exports = router;
