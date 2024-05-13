const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
    {
        name: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required:true
        },
        image: {
          type: String,
        
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

const Category = mongoose.model("Category", categorySchema);
module.exports = Category; //export the model
