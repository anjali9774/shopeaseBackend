const Order = require('../model/orderModel');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const AppError = require("../utils/appError");
const Stripe = require('stripe')
const catchAsync = require("../utils/catchAsync");
const User = require('../model/userModel');
const Product = require('../model/productModel');
const Coupon = require('../model/couponModel');




console.log(process.env.STRIPE_KEY)
// Stripe instance
const stripe = Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2020-08-27',
  maxNetworkRetries: 2,
  httpAgent: new (require('https').Agent)({ keepAlive: true }),
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;
  console.log(req.body);
  //Find the user
  const user = await User.findById(req.userAuthId);
  //Check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }
  //Check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }
  //Place/create order - save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    totalPrice,
  });

  //Update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });
  //push order into user
  user.orders.push(order?._id);
  await user.save();

  //make payment (stripe)
  //convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "https://shopeasefrontend.onrender.com/success",
    cancel_url: "https://shopeasefrontend.onrender.com/cancel",
  });
  res.send({ url: session.url });
});



exports.getAllOrders = catchAsync(async (req, res,next) => {
  //find all orders
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

exports.getSingleOrder = catchAsync(async (req, res,next) => {
  //get the id from params
  const id = req.params.id;
  const order = await Order.findById(id);
  //send response
  res.status(200).json({
    success: true,
    message: "Single order",
    order,
  });
});


//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin

exports.updateOrder = catchAsync(async (req, res,next) => {
  //get the id from params
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});

//@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin

exports.getOrderStatus = catchAsync(async (req, res,next) => {
  //get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  //send response
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Product.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new AppError("Product not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Order deleted successfully",
  });
});
