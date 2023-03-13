const { Router } = require("express");
const userRouter = Router();

const { hashPass, comparePass, tokenCheck } = require("../middleware");
const { registerUser, login, getAllUsers } = require("./controllers");

// server recives the request from the front end. then our hashPass middleware function is called
userRouter.post("/users/register", hashPass, registerUser);
// manual login route
userRouter.post("/users/login", comparePass, login);

// authCheck is peristant login route 
// login controller is the same in both
userRouter.get("/users/authcheck", tokenCheck, login);
userRouter.get("/users/getallusers", tokenCheck, getAllUsers); //protected

module.exports = userRouter;
