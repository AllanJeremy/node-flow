var fractal = require('fractal-transformer')();

class UserTransformer {

	AdminUser = (data) => fractal(data, {
		'id': 'id',
		'first_name': 'first_name',
		'last_name': 'last_name',
		'email': 'email',
		'status': 'status'
	});

  AdminPermission = (data) => fractal(data, {
    'id': 'id',
    'admin_user_id': 'admin_user_id',
    'permissions': 'permissions'
  });

  AdminPermissionList = (data) => fractal(data, {
    'key': 'key',
    'value': 'value'
  });
}

module.exports = UserTransformer;
