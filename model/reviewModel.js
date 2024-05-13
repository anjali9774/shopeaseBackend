const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "Review must belong to a user"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Review must belong to a product"],
        },
        message: {
          type: String,
          required: [true, "Please add a message"],
        },
        rating: {
          type: Number,
          required: [true, "Please add a rating between 1 and 5"],
          min: 1,
          max: 5,
        },
      },
      {
        timestamps: true,
      }

);


//schema to model conversion

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review; //export the model
