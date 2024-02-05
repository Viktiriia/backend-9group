const { HttpError } = require("../helpers");

const isValidateMonth = (req, res, next) => {
  const { date } = req.params;
  // const regularExp = /\d{4}(-|\/)\d{2}(-|\/)/;
  const regularExp = /^\d{4}-(0[1-9]|1[0-2])$/;

  if (!regularExp) {
    return next(HttpError(400, `Invalid date format ${date}. Use YYYY-MM`));
  }

  next();
};

module.exports = isValidateMonth;
