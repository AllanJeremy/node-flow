exports.en = {
	'admin': {
		'validation': {
      'required_fields': 'Please fill up all the required fields.',
			'email_required': 'Email address is a required field.',
      'email_invalid': 'Invalid email address.',
			'password_required': 'Password is a required field.',
      'password_minimum_length': 'Password must be of minimum 8 characters length.',
			'invalid_credentials': 'Invalid email address or password.',
			'name_required': 'Name is a required field.',
			'status_required': 'Status is a required field.',
      'first_name_required': 'First name is a required field.',
      'last_name_required': 'Last name is a required field.',
      'admin_permission_required': 'Please select at least one permission.',
      'question_required': 'Question is a required field.',
      'options_required': 'Options is a required field.',
      'sequence_required': 'Sequence is a required field.',
      'sequence_number': 'Sequence must be number.'
		},
		'response': {
			'login_success': 'Logged in successfully.',
			'token_required': 'Token is a required field.',
			'permission_denied': 'You don\'t have enough permission to access this module. Please contact administrator.',
			'unauthorized': 'Unauthorized.',
			'not_exist': 'Something went wrong or data does not exists',
			'race_store_success': 'Race created successfully.',
			'race_update_success': 'Race updated successfully.',
			'race_delete_success': 'Race deleted successfully.',
			'race_exist': 'Race already exists.',
			'gender_store_success': 'Gender created successfully.',
			'gender_update_success': 'Gender updated successfully.',
			'gender_delete_success': 'Gender deleted successfully.',
			'gender_exist': 'Gender already exists.',
			'sexual_orientation_store_success': 'Sexual orientation created successfully.',
			'sexual_orientation_update_success': 'Sexual orientation updated successfully.',
			'sexual_orientation_delete_success': 'Sexual orientation deleted successfully.',
			'sexual_orientation_exist': 'Sexual Orientation already exists.',
			'workout_store_success': 'Health tool created successfully.',
			'workout_update_success': 'Health tool updated successfully.',
			'workout_delete_success': 'Health tool deleted successfully.',
			'workout_exist': 'Health tool already exists.',
			'health_category_store_success': 'Health category created successfully.',
			'health_category_update_success': 'Health category updated successfully.',
			'health_category_delete_success': 'Health category deleted successfully.',
			'health_category_exist': 'Health category already exists.',
      'family_dynamic_store_success': 'Family dynamic created successfully.',
      'family_dynamic_update_success': 'Family dynamic updated successfully.',
      'family_dynamic_delete_success': 'Family dynamic deleted successfully.',
      'family_dynamic_exist': 'Family dynamic already exists.',
      'admin_user_store_success': 'Admin user created successfully.',
      'admin_user_update_success': 'Admin user updated successfully.',
      'admin_user_delete_success': 'Admin user deleted successfully.',
      'admin_user_exist': 'Admin user already exists.',
      'admin_permission_store_success': 'Admin user permission store successfully.',
      'admin_permission_update_success': 'Admin user permission update successfully.',
      'race_merge_success': 'Race merged successfully.',
      'sexual_orientation_merge_success': 'Sexual orientation merged successfully.',
      'workout_merge_success': 'Health tool merged successfully.',
      'gender_merge_success': 'Gender merged successfully.',
      'family_dynamic_merge_success': 'Family dynamic merged successfully.',
      'health_category_merge_success': 'Health category merged successfully.',
      'token_success': 'Token generated successfully.',
      'personality_question_store_success': 'Personality question created successfully.',
      'personality_question_update_success': 'Personality question updated successfully.',
      'personality_question_delete_success': 'Personality question deleted successfully.',
      'personality_question_exist': 'Personality question already exists.',
      'user_status_change': 'User status updated successfully.',
      'conversation_starter_store_success': 'Conversation starter created successfully.',
      'conversation_starter_update_success': 'Conversation starter updated successfully.',
      'conversation_starter_delete_success': 'Conversation starter deleted successfully.',
      'conversation_starter_exist': 'Conversation starter already exists.',
      'file_type': 'Invalid file type.',
      'avatar_store_success': 'Avatar created successfully.',
			'avatar_update_success': 'Avatar updated successfully.',
			'avatar_delete_success': 'Avatar deleted successfully.',
			'avatar_exist': 'Avatar already exists.',
		}
	},
  'front': {
    'validation': {
      'required_fields': 'Please fill up all the required fields.',
      'email_required': 'Email address is a required field.',
      'email_invalid': 'Invalid email address.',
      'password_required': 'Password is a required field.',
      'password_alphanumeric': 'Password must be atleast 8 characters long and alphanumeric.',
      'invalid_credentials': 'Invalid email address or password.',
      'invalid_email': 'Email address does not exists.',
      'password_confirm_password_match': 'Password and confirm password must be same.',
      'first_name_required': 'First name is a required field.',
      'name_prefix_required': 'Name prefix is a required field.',
      'birth_date_required': 'Birth date is a required field.',
      'profile_picture_required': 'Profile Picture is a required field.',
      'name_required': 'Name is a required field.',
      'question_answers_required': 'Question Answers is a required field.',
      'summary_required': 'Summary is a required field.',
      'conversation_starter_id_required': 'Conversation starter id is a required field.',
      'answer_required': 'Answer is a required field.',
      'race_required': 'Race is a required field.',
      'other_required': 'Other is a required field.',
      'gender_required': 'Gender is a required field.',
      'family_dynamic_required': 'Family dynamic is a required field.',
      'sexual_orientation_required': 'Sexual orientation is a required field.',
      'health_category_required': 'Health category is a required field.',
      'workout_required': 'Health tools is a required field.',
      'user_interest_required': 'User interest is a required field.',
      'race_status_required': 'Race status is a required field.',
      'gender_status_required': 'Gender status is a required field.',
      'family_dynamic_status_required': 'Family dynamic status is a required field.',
      'sexual_orientation_status_required': 'Sexual orientation status is a required field.',
      'workouts_status_required': 'Health tools status is a required field.',
      'health_categories_status_required': 'Health category status is a required field.',
      'user_id_required': 'User id is a required field.',
      'reason_required': 'Reason is a required field.',
    },
    'response': {
      'login_success': 'Logged in successfully.',
      'email_already_exist': 'Your email address already exists.',
      'email_not_exist': 'Your email address does not exists.',
      'register_successfully': 'We have sent you to a verification link to your email address. In order to complete the sign-up process, please click the verification link.',
      'not_verified_account': 'Your email address is not verified. Please verify your email to continue. Click on this link to re-send email.',
      'blocked_account': 'Your account has been suspended by administrator. Please contact support team for more details.',
      'mail_not_send': 'Something went wrong. Please try again.',
      'invalid_code': 'Invalid verification code.',
      'verified_success': 'Verified successfully.',
      'reset_password_request_success': 'We have sent you a link to change the password on email address.',
      'password_reset_success': 'Password reset successfully.',
      'code_resend': 'Verification code resend successfully.',
      'profile_create': 'Profile created successfully.',
      'profile_update': 'Profile updated successfully.',
      'race_save': 'Race saved successfully.',
      'gender_save': 'Gender saved successfully.',
      'family_dynamic_save': 'Family dynamic saved successfully.',
      'sexual_orientation_save': 'Sexual orientation saved successfully.',
      'health_category_save': 'Health category saved successfully.',
      'workout_save': 'Health tools saved successfully.',
      'conversation_starter_store_success': 'Conversation starter saved successfully.',
      'user_interest_save': 'User interest saved successfully.',
      'peer_match_store': 'Matched peer saved successfully.',
      'peer_unmatch_store': 'Unmatched peer saved successfully.',
      'mute_peer_store': 'Peer has been muted successfully.',
      'unmute_peer_store': 'Peer has been unmuted successfully.',
      'visibility': 'Profile visibility saved successfully.',
      'reported_successfully': 'User has been reported successfully.',
      'conversation_starter_status_store': 'Conversation starter status saved successfully.',
    },
  },
  'email': {
    'register': {
      'line1': 'Hello',
      'line2': 'You have successfully created a Joyn account. Your verification code is'
    },
    'reset_password': {
      'line1': 'Your reset password verification code'
    }
  }
}
