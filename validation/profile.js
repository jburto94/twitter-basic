const Validator = require('validator')
      isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  if(!Validator.isLength(data.bio, { min: 10, max: 150 })) {
    errors.bio = 'Handle must be under 150 characters';
  }

  if(!Validator.isURL(data.website)) {
    errors.website = 'Website is invalld';
  }

  // Checks for errors and returns isValid if there are none
  return {
    errors,
    isValid: isEmpty(errors)
  };
};