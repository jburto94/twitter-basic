const Validator = require('validator'),
      isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  // If email or password is empty, set them to empty strings
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if(!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if(Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if(Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  // isValid returns false if there are errors and true if no errors
  return {
    errors,
    isValid: isEmpty(errors)
  };
}