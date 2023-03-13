const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../users/model");

const saltRounds = process.env.SALT_ROUNDS;

const hashPass = async (req, res, next) => {
  try {
    // const hashedPass = await bcrypt.hash(req.body.password, saltRounds);
    // req.body.password = hashedPass;
    
    // the password thats passed in the body of the request is hashed using the bcrypt .hash method
    // .hash takes two aurguments the plain text password and the number of salt rounds
    // salt rounds is how complex the hash of the password is
    // it's a trade off between secuirty and useabilty

    //update the password in the body with the hashed version using the .hash method
    req.body.password = await bcrypt.hash(
      req.body.password,
      parseInt(saltRounds)
    );
    next(); // Middlware needs to be told to move on to the next step. so we call the next function once everything has 
    // been completed in the try block
  } catch (error) {
    res.status(501).json({ errorMessage: error.message, error: error });
  }
};

const comparePass = async (req, res, next) => {
  try {
    // console.log(req.body);
    // get user
    // const user = await User.findOne({ where: { username: req.body.username } });
    req.user = await User.findOne({ where: { username: req.body.username } });
    console.log("---------")
    console.log(req)
    console.log("!!!!!!!!!!!")
    console.log(req.user);
    // compare passwords

    const match = await bcrypt.compare(req.body.password, req.user.password);

    // if no match - respond with 500 error message "passwords do not match"

    if (!match) {
      const error = new Error("Passwords do not match");
      res.status(500).json({ errorMessage: error.message, error: error });
    }

    // if match - next function

    next();
  } catch (error) {
    res.status(501).json({ errorMessage: error.message, error: error });
  }
};

const tokenCheck = async (req, res, next) => {
  try {
    // stop request if no authorization header is not passed in the request from the front end
    if (!req.header("Authorization")) {
      throw new Error("No token or authorization header not passed");
    }
    // get token from authorization header and remove Bearer_ from the token
    const token = req.header("Authorization").replace("Bearer ", "");

    // check if the token contains the id of the user and the secret password
    const decodedToken = await jwt.verify(token, process.env.SECRET);

    // find user with id thats stored in the token
    const user = await User.findOne({ where: { id: decodedToken.id } });
    
    // if user not found make new error 
    if (!user) {
      // const error = new Error("User is not authorised");
      // res.status(401).json({ errorMessage: error.message, error: error });
      throw new Error("User is not authorised");
    }
    console.log(user)
    // if user is found make new object in the request object with user information from the database
    // user.token = token;
    req.authCheck = user;
    // move on the contoller
    next();
  } catch (error) {
    res.status(501).json({ errorMessage: error.message, error: error });
  }
};

module.exports = {
  hashPass,
  comparePass,
  tokenCheck,
};
