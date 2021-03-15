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
			'workout_store_success': 'Workout created successfully.',
			'workout_update_success': 'Workout updated successfully.',
			'workout_delete_success': 'Workout deleted successfully.',
			'workout_exist': 'Workout already exists.',
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
      'workout_merge_success': 'Workout merged successfully.',
      'gender_merge_success': 'Gender merged successfully.',
      'family_dynamic_merge_success': 'Family dynamic merged successfully.',
      'health_category_merge_success': 'Health category merged successfully.',
      'token_success': 'Token generated successfully.',
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
      'first_name': 'First name is a required field.',
      'name_prefix': 'Name prefix is a required field.',
      'birth_date': 'Birth date is a required field.',
      'profile_picture': 'Profile Picture is a required field.',
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
