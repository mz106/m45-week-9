const User = require("./model");
const jwt = require("jsonwebtoken");

// Javascript Object Notation

const registerUser = async (req, res) => {
  // req = request
  // res = response
  try {
    // creating a new user from the key value pairs sent in the body of the request
    const user = await User.create(req.body);

    // const user = await User.create({
    //   username: req.body.user,
    //   email: req.body.e,
    //   password: req.body.p,
    // });

    // send successfully created status code and send the new users email and password in the response for the 
    // front end
    res.status(201).json({
      message: "success",
      user: { username: req.body.username, email: req.body.email },
    });
  } catch (error) {
    res.status(501).json({ errormessage: error.message, error: error });
  }
};

const login = async (req, res) => {
  try {
    // this logic handles persistant login
    // send response back with user information stored in the authCheck object that we added to the request object 
    // in the tokenCheck middleware
    if (req.authCheck) {
      res.status(201).json({
        message: "success",
        user: {
          username: req.authCheck.username,
          email: req.authCheck.email,
        },
      });
      return;
    }
    // create token when a user is manually login
    // load SECRET from .env file to keep it secure and secret
    const token = await jwt.sign({ id: req.user.id }, process.env.SECRET);

    // send in the response the username, email and the token thats generated on the line above back to the front end
    res.status(201).json({
      message: "success",
      user: {
        username: req.user.username,
        email: req.user.email,
        token: token,
      },
    });
  } catch (error) {
    res.status(501).json({ errorMessage: error.message, error: error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log("!!!!!!!!!!!");
    if (!req.authCheck) {
      const error = new Error("Not authorised");
      res.status(401).json({ errorMessage: error.message, error: error });
    }

    const users = await User.findAll();

    for (let user of users) {
      user.password = "";
    }
    console.log(users);
    res.status(200).json({ message: "success", users: users });
  } catch (error) {
    res.status(501).json({ errorMessage: error.message, error: error });
  }
};

module.exports = {
  registerUser,
  login,
  getAllUsers,
};
