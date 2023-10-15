import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password){
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const userExists = await User.findOne({ email: email });
  if (userExists){
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic
  });

  if (user){
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id)
    });
  }

  res.status(400);
  throw new Error("Failed to create user");
});

const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user && await user.matchPassword(password)){
    res.status(200).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const allUsers = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search ? {
    $or: [
      { name: {$regex : req.query.search, $options: "i"} },
      { email: {$regex : req.query.search, $options: "i"} },
    ]
  } : {}

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select("-password");
  res.status(200).json(users);
});

export {
  registerUser,
  authUser,
  allUsers,
}
