class AuthTransformer {

	SignIn = (data) => {
		return [{
			'token': data['token'],
			'user': {
				'first_name': data['user']['first_name'],
				'last_name': data['user']['last_name'],
				'email': data['user']['email'],
				'status': data['user']['status'],
			}
		}];
	}
}

module.exports = AuthTransformer;