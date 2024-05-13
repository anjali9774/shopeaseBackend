const Category = require('../model/categoryModel');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


exports.createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const categoryFound = await Category.findOne({ name });
  
  if (categoryFound) {
      return next(new AppError('This category already exists', 404));
  }
  
  // Include the user field when creating the category
  const category = await Category.create({
      name: name.toLowerCase(),
      user: req.userAuthId, // Assuming req.userAuthId contains the user ID
      image: req?.file?.path,
  });
  
  res.status(200).json({
      status: "success",
      message: "Category created Successfully",
      category: category // Optionally send the created category in the response
  });
});

exports.getAllCategories = catchAsync(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json({
      status: "success",
      results: categories.length,
      message: "Categories fetched successfully",
      categories,
    });
  });
  
  // @desc    Get single category
  // @route   GET /api/categories/:id
  // @access  Public
  exports.getSingleCategory = catchAsync(async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Category fetched successfully",
      category,
    });
  });
  
  // @desc    Update category
  // @route   PUT /api/categories/:id
  // @access  Private/Admin
  exports.updateCategory = catchAsync(async (req, res) => {
    const { name } = req.body;
  
    //update
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      category,
    });
  });
  
  // @desc    delete category
  // @route   DELETE /api/categories/:id
  // @access  Private/Admin
  exports.deleteCategory = catchAsync(async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      message: "Category deleted successfully",
    });
  });