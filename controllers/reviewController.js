const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Product = require('../model/productModel')
const Review = require('../model/reviewModel')

// @desc    Create new review
// @route   POST /api/v1/reviews/:productID
// @access  Private
exports.createReview = catchAsync(async (req, res, next) => {
  const { message, rating } = req.body;
  const { productID } = req.params;

  // Find the product
  const productFound = await Product.findById(productID).populate("reviews");
  if (!productFound) {
    return next(new AppError("Product not found", 404));
  }

  const hasReviewed = productFound?.reviews?.find((review)=>{
    return  review?.user.toString() == req?.userAuthId.toString();
  });
  if(hasReviewed){
    return next (new AppError("You have already Reviewd this product",400));
  }


  // Create review
  const review = await Review.create({
    message,
    rating,
    product: productFound._id,
    user: req.userAuthId,// Add user from authenticated request
  });

  // Push review into product reviews
  productFound.reviews.push(review._id);

  // Save the product with the new review
  await productFound.save();

  res.status(201).json({
    success: true,
    message: "Review created successfully",
  });
});
