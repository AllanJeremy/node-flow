var fractal = require('fractal-transformer')();

class UserTransformer {

	AdminUser = (data) => fractal(data, {
		'id': 'id',
		'first_name': 'first_name',
		'last_name': 'last_name',
		'email': 'email',
		'status': 'status'
	});
}

module.exports = UserTransformer;
