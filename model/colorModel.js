const mongoose = require('mongoose');

const colorSchema = mongoose.Schema(
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
      },
      { timestamps: true }

);


//schema to model conversion

const Color = mongoose.model("Color", colorSchema);
module.exports = Color; //export the model
