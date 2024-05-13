const mongoose = require('mongoose');

const brandSchema = mongoose.Schema(
    {
        name: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        products: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        ],
      },
      { timestamps: true }

);




//schema to model conversion

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand; //export the model
