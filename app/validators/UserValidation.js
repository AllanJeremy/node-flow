const { check } = require('express-validator');

exports.SignIn = [
  check('email')
  	.trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Email address is required.')
    .isEmail()
    .withMessage('Invalide email address.')
    .bail(),
  check('password')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Password is required.')
    .bail(),
];
