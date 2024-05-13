const Brand = require('../model/brandModel');
const Color = require('../model/colorModel');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


exports.createColor = catchAsync(async(req,res,next)=>{
    const{name}=req.body;
    const colorFound = await Color.findOne({name});
    if(colorFound){
        return next (new AppError('This color already exists',404));
    }
    const color = await Color.create({
        name: name.toLowerCase(),
        user:req.userAuthId,
    });
    res.status(200).json({
        status:"success",
        message:"Color created Successfully",
        color,
    });
});

exports.getAllColors = catchAsync(async (req, res) => {
    const colors = await Color.find();
    res.status(200).json({
      status: "success",
      results: colors.length,
      message: "Colors fetched successfully",
      colors,
    });
  });
  
  // @desc    Get single color
 
  // @access  Public
  exports.getSingleColor = catchAsync(async (req, res) => {
    const color = await Color.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Color fetched successfully",
      color,
    });
  });
  
  // @desc    Update color

  // @access  Private/Admin
  exports.updateColor = catchAsync(async (req, res) => {
    const { name } = req.body;
  
    //update
    const color = await Color.findByIdAndUpdate(
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
      message: "Color updated successfully",
      color,
    });
  });
  
  // @desc    delete color

  // @access  Private/Admin
  exports.deleteColor = catchAsync(async (req, res) => {
    await Color.findByIdAndDelete(req.params.id);
    res.status(200 ).json({
      status: "success",
      message: "Color deleted successfully",
    });
  });