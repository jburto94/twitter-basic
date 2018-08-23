const Validator = require('validator'),
      isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if(!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if(Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if(!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if(Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if(!Validator.isLength(data.handle, { min: 4, max: 20 })) {
    errors.handle = 'Handle must be between 4 and 20 characters';
  }

  if(Validator.isEmpty(data.handle)) {
    errors.handle = 'Handle dield is required';
  }

  if(!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be between 6 and 30 characters';
  } 

  if(Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if(Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm password field is required';
  }

  if(!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

   // isValid returns false if there are errors and true if no errors
  return {
    errors,
    isValid: isEmpty(errors)
  };
};