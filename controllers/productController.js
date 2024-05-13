const Category = require("../model/categoryModel");
const Brand = require("../model/brandModel");
const Product = require("../model/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin


exports.createProduct = catchAsync(async (req, res, next) => {
  
  const covertedImgs = req.files.map((file) => file.path);
  const { name, description, category, sizes, colors, price, totalQty, brand } = req.body;

  const productExists = await Product.findOne({ name });
  if (productExists) {
      return next(new AppError("Product Already Exists", 400));
  }

  const brandFound = await Brand.findOne({ name: brand });
  if (!brandFound) {
      return next(new AppError("Brand not found, please create brand first or check brand name", 400));
  }

  const categoryFound = await Category.findOne({ name: category });
  if (!categoryFound) {
      return next(new AppError("Category not found, please create category first or check category name", 400));
  }
  if (!req.files || req.files.length === 0) {
    return next(new Error("No files were uploaded."));
}
  const product = await Product.create({
      name,
      description,
      category,
      sizes,
      colors,
      user: req.userAuthId,
      price,
      totalQty,
      brand,
      images :covertedImgs,
  });

  categoryFound.products.push(product._id);
  await categoryFound.save();

  brandFound.products.push(product._id);
  await brandFound.save();

  res.status(201).json({
      status: "success",
      message: "Product created successfully",
      product,
  });
});


// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getAllProducts = catchAsync(async (req, res, next) => {
  let productQuery = Product.find();

  if (req.query.name) {
    productQuery = productQuery.find({ name: { $regex: req.query.name, $options: "i" } });
  }

  if (req.query.brand) {
    productQuery = productQuery.find({ brand: { $regex: req.query.brand, $options: "i" } });
  }

  if (req.query.category) {
    productQuery = productQuery.find({ category: { $regex: req.query.category, $options: "i" } });
  }

  if (req.query.color) {
    productQuery = productQuery.find({ colors: { $regex: req.query.color, $options: "i" } });
  }

  if (req.query.size) {
    productQuery = productQuery.find({ sizes: { $regex: req.query.size, $options: "i" } });
  }

  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    productQuery = productQuery.find({ price: { $gte: priceRange[0], $lte: priceRange[1] } });
  }
 //pagination
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  //startIdx
  const startIndex = (page - 1) * limit;
  //endIdx
  const endIndex = page * limit;
  //total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //await the query
  const products = await productQuery.populate("reviews");
  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Products fetched successfully",
    products,
  });
});


// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getSingleProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: "reviews",
    populate: {
      path: "user",
      select: "fullname",
    },
  });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Product fetched successfully",
    product,
  });
});

// @desc    update  product
// @route   PUT /api/products/:id/update
// @access  Private/Admin
exports.updateProduct = catchAsync(async (req, res, next) => {
  const { name, description, category, sizes, colors, user, price, totalQty, brand } = req.body;

  const product = await Product.findByIdAndUpdate(req.params.id, {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  }, { new: true, runValidators: true });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    product,
  });
});

// @desc    delete  product
// @route   DELETE /api/products/:id/delete
// @access  Private/Admin
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});
