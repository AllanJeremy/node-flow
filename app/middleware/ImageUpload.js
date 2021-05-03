var multer = require('multer');

const language = require('../language/en_default');
const validationLanguage = language.en.admin.validation;

module.exports.image={
	storage:function(){
			var storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, 'images/avatar')
			},
			filename: function (req, file, cb) {
				let extArray = file.mimetype.split('/');
    		let extension = extArray[extArray.length - 1];
				cb(null, Date.now() + '.' + extension);
				req.name = Date.now() + '.' + extension;
			}
		})
		return storage;
},
allowedImage:function(req, file, cb) {
	if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
			return cb(new Error(validationLanguage.file_type), false);
	}
	cb(null, true);
}}