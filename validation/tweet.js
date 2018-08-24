const Validator = require('validator'),
      isEmpty = require('./is-empty');

module.exports = function validateTweetInput(data) {
  let errors = {};

  // If text is empty, set it to an empty string
  data.text = !isEmpty(data.text) ? data.text : '';

  if(!Validator.isLength(data.text, { min: 1, max: 180 })) {
    errors.text = 'Tweets have a 180 character limit';
  }

  if(Validator.isEmpty(data.text)) {
    errors.text = 'Text field required';
  }

  // Returns valid if there are no errors
  return {
    errors,
    isValid: isEmpty(errors)
  };
};