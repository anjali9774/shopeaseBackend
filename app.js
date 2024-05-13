const express = require("express");
const Stripe = require("stripe");
const cors = require('cors');
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const brandRouter = require("./routes/brandRoutes");
const colorRouter = require("./routes/colorRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");
const couponRouter = require("./routes/couponRoutes");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const Order = require("./model/orderModel");
const dotenv=require("dotenv");

const app = express();
app.use(express.json());
//cors
app.use(cors());//any client side to accept the user from any server

dotenv.config({ path: './config.env' });

// Stripe Webhook
const stripeKey = process.env.STRIPE_KEY;
const stripe = new Stripe(stripeKey, {
  apiVersion: "2020-08-27", // Adjust the version based on your requirements
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_ebfec114bf9d24f8791b74dcf217f7566652b00e452de6d9a1ffda40c17b320a";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log(event);

      // Handle the event
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntentSucceeded = event.data.object;
          // Then define and call a function to handle the event payment_intent.succeeded
          break;
        case "checkout.session.completed":
          // Update the order
          const session = event.data.object;
          const { orderId } = session.metadata;
          const paymentStatus = session.payment_status;
          const paymentMethod = session.payment_method_types[0];
          const totalAmount = session.amount_total;
          const currency = session.currency;
          const order = await Order.findByIdAndUpdate(
            JSON.parse(orderId),
            {
              totalPrice: totalAmount / 100,
              currency,
              paymentMethod,
              paymentStatus,
            },
            {
              new: true,
            }
          );
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // Return a 200 response to acknowledge receipt of the event
      response.status(200).end();
    } catch (err) {
      console.log(err, err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/colors", colorRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/coupons", couponRouter);
// Logger middleware


// Global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
