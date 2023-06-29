const validator = require("validator");

const validateArticle = (parameters) => {
  let validateTitle =
    !validator.isEmpty(parameters.title) &&
    validator.isLength(parameters.title, { min: 2 });
  let validateContent =
    !validator.isEmpty(parameters.content) &&
    validator.isLength(parameters.content, { min: 2 });

  if (!validateTitle || !validateContent) {
    throw new Error("Validation failed.");
  }
  //
};

module.exports = {
  validateArticle,
};
