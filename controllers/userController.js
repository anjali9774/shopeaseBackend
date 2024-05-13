const User = require("../model/userModel");
const AppError = require("../utils/appError");
const bcrypt = require('bcryptjs');
const {generateToken} = require('../utils/generateToken')
const  getTokenFromHeader  = require('../utils/getTokenFromHeader'); // Assuming you have a function to generate tokens
const {verifyToken} = require("../utils/verifyToken");
const catchAsync = require("../utils/catchAsync");


exports.registerUser = catchAsync(async (req, res, next) => {
  const { fullName, email, password } = req.body;
  // Check if user with the same email exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("User already exists", 400));
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt); // Using bcryptjs
  // Create user
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    status: "success",
    message: "User Registered Successfully",
    data: user,
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Find the user in the database by email
  const userFound = await User.findOne({ email });

  // Check if the user exists and the password is correct
  if (userFound && (await bcrypt.compare(password, userFound.password))) {
    // Generate a token for the user
    const token = generateToken(userFound._id);

    // Send the token and user details in the response
    res.json({
      status: "success",
      message: "User logged in successfully",
      token,
      user: userFound, // Optionally, you can omit the userFound field if you don't want to expose all user details
    });
  } else {
    // Return an error if login credentials are invalid
    return next(new AppError("Invalid login credentials"));
  }
});

exports.getUser = async (req, res, next) => {
  try {
    // Check if user ID is available in the request (set by isLoggedIn middleware)
    const userId = req.userAuthId;
    if (!userId) {
      return res.status(400).json({ status: "fail", message: "User ID not provided" });
    }

    // Find the user by ID and populate orders
    const user = await User.findById(userId).populate("orders");

    // Check if user exists
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    // If user is found, send success response with user data
    res.json({
      status: "success",
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    // Handle any other errors
    console.error("Error fetching user profile:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};



exports.updateShippingAddress = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    phone,
    country,
  } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
        country,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "User shipping address updated successfully",
    user,
  });
});
