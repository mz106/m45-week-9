const bcrypt = require("bcrypt");

const saltRounds = process.env.SALT_ROUNDS;

const hashPass = async (req, res, next) => {
  try {
    // const hashedPass = await bcrypt.hash(req.body.password, saltRounds);
    // req.body.password = hashedPass;

    req.body.password = await bcrypt.hash(req.body.password, saltRounds);

    next();
  } catch (error) {
    res.status(501).json({ errorMessage: error.message, error: error });
  }
};

const comparePass = async (req, res, next) => {
  try {
    // get user

    // compare passwords

    // if no match - respond with 500 error message "passwords do not match"

    // if match - next function
    console.log(req.body);
    next();
  } catch (error) {
    res.status(501).json({ errorMessage: error.message, error: error });
  }
};

module.exports = {
  hashPass,
  comparePass,
};
