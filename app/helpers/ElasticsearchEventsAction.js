/**
 * Constant for managing search activities action across the system
 *
 */
const ElasticsearchEventsAction = {
  createUser: 'create_user',
  updateUser: 'update_user',
  raceUpdate: 'race_update',
  raceRenamed: 'race_renamed',
  raceDelete: 'race_delete',
  genderUpdate: 'gender_update',
  genderRenamed: 'gender_renamed',
  genderDelete: 'gender_delete',
  familyDynamicUpdate: 'family_dynamic_update',
  familyDynamicRenamed: 'family_dynamic_renamed',
  familyDynamicDelete: 'family_dynamic_delete',
  sexualOrientationUpdate: 'sexual_orientation_update',
  sexualOrientationRenamed: 'sexual_orientation_renamed',
  sexualOrientationDelete: 'sexual_orientation_delete',
  healthCategoryUpdate: 'health_category_update',
  healthCategoryRenamed: 'health_category_renamed',
  healthCategoryDelete: 'health_category_delete',
  workoutUpdate: 'workout_update',
  workoutRenamed: 'workout_renamed',
  workoutDelete: 'workout_delete',
  listedPeerUpdate: 'match_peer_update',
  delistedPeerUpdate: 'unmatch_peer_update',
  userVisibility: 'user_visibility',
  declinedPeerUpdate: 'declined_peer_update'
};

module.exports = ElasticsearchEventsAction;
