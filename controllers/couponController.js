const Coupon = require("../model/couponModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// @desc    Create new Coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin

exports.createCoupon = catchAsync(async (req, res, next) => {
  const { code, startDate, endDate, discount } = req.body;

  // Check if coupon already exists
  const couponExists = await Coupon.findOne({ code });
  if (couponExists) {
    return next(new AppError("Coupon already exists", 400));
  }

  // Check if discount is a number
  if (isNaN(discount)) {
    return next(new AppError("Discount value must be a number", 400));
  }

  // Create coupon
  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });

  // Send response
  res.status(201).json({
    status: "success",
    message: "Coupon created successfully",
    coupon,
  });
});

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin

exports.getAllCoupons = catchAsync(async (req, res,next) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    result:coupons.length,
    message: "All coupons",
    coupons,
  });
});
// @desc    Get single coupon
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin

exports.getCoupon = catchAsync(async (req, res, next) => {
 // const id = req.params.id;
  const coupon = await Coupon.findOne({code:req.query.code});
  // console.log(coupon);
  //check if is not found
  if (coupon === null) {
    return next(new AppError("Coupon not found",404));
  }
  //check if expired
  if (coupon.isExpired) {
    return next(new AppError("Coupon Expired",404));
  }
  res.json({
    status: "success",
    message: "Coupon fetched",
    coupon,
  });
});


exports.updateCoupon = catchAsync(async (req, res,next) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "Coupon updated successfully",
    coupon,
  });
});

exports.deleteCoupon = catchAsync(async (req, res,next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Coupon deleted successfully",
    coupon,
  });
});