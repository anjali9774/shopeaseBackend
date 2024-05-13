const Brand = require('../model/brandModel');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


exports.createBrand = catchAsync(async(req,res,next)=>{
    const{name}=req.body;
    const brandFound = await Brand.findOne({name});
    if(brandFound){
        return next (new AppError('This brand already exists',404));
    }
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user:req.userAuthId,
    });
    res.status(200).json({
        status:"success",
        message:"Brand created Successfully"
    });
});

exports.getAllBrands = catchAsync(async (req, res) => {
    const brands = await Brand.find();
    res.status(200).json({
      status: "success",
      results: brands.length,
      message: "Brands fetched successfully",
      brands,
    });
  });
  
  // @desc    Get single brand
 
  // @access  Public
  exports.getSingleBrand = catchAsync(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Brand fetched successfully",
      brand,
    });
  });
  
  // @desc    Update brand

  // @access  Private/Admin
  exports.updateBrand = catchAsync(async (req, res) => {
    const { name } = req.body;
  
    //update
    const brand = await Brand.findByIdAndUpdate(
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
      message: "Brand updated successfully",
      brand,
    });
  });
  
  // @desc    delete brand

  // @access  Private/Admin
  exports.deleteBrand = catchAsync(async (req, res) => {
    await Brand.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      message: "Brand deleted successfully",
    });
  });