const { Router } = require("express");
const userRouter = Router();

const { hashPass } = require("../middleware");
const { registerUser } = require("./controllers");

userRouter.post("/users/register", hashPass, registerUser);

module.exports = userRouter;
