const mongoose = require("mongoose");

// Function to generate a random string
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to generate a random number between 1000 and 99999
function generateRandomNumber() {
  return Math.floor(1000 + Math.random() * 90000);
}

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        type: Object,
        required: true,
      },
    ],
    shippingAddress: {
      type: Object,
    },
    orderNumber: {
      type: String,
      default: generateRandomString(5) + generateRandomNumber(),
    },
    // Rest of your schema...
  },
  {
    timestamps: true,
  }
);

//schema to model conversion
const Order = mongoose.model("Order", orderSchema);
module.exports = Order; //export the model
