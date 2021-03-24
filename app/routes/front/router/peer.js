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

router.post(apiRoute.USER_PEER_MATCH, [PeerValidation.Validation], PeerController.storePeerMatch);

router.post(apiRoute.USER_PEER_UNMATCH, [PeerValidation.Validation], PeerController.storePeerUnMatch);

router.get(apiRoute.USER_PEER_LIST, PeerController.list);

router.post(apiRoute.USER_PEER_MUTE, [PeerValidation.Validation], PeerController.storePeerMute);

router.post(apiRoute.USER_PEER_UNMUTE, [PeerValidation.Validation], PeerController.storePeerUnMute);

router.get(apiRoute.USER_HIDDEN_PEER_LIST, PeerController.hiddenPeerList);

module.exports = router;
