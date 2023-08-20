/* eslint-disable import/no-extraneous-dependencies */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const factory = require('./handlerFactory');

exports.createCashOrder = catchAsync(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  //1) Get CardItem  From Cart Model passed on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new AppError('Cart Not Found With This Id', 404));
  }
  console.log(cart);
  //2) Get order price Based On Cart price and Check if coupon Applied (taxPrice:0,ShippingPrice:0)
  const orderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = orderPrice + taxPrice + shippingPrice;
  //3) Create order with default Payment :'Cash',
  const order = await Order.create({
    user: req.user.id,
    cart,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  //4) Update Product model (sold :Increment ,Quantity : Decrement)\
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    //5) Clear for cart based on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(200).json({
    status: 'success',
    message: 'Your Order Has Been Created.',
    data: {
      order,
    },
  });
});

exports.GetAllOrderForLoggedUser = catchAsync(async (req, res, next) => {
  if (req.user.role === 'user') {
    // eslint-disable-next-line no-undef
    filterObject = { user: req.user.id };
  }
  next();
});

exports.getAllOrders = factory.getAll(Order);

exports.getOrder = factory.getOne(Order);

exports.UpdateOrderToPaid = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new AppError(`Order Not Fount with this (${req.params.id}) ID`, 404),
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order has been updated',
    data: {
      order,
    },
  });
});

exports.UpdateOrderToDelivered = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new AppError(`Order Not Fount with this (${req.params.id}) ID`, 404),
    );
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order has been updated',
    data: {
      order,
    },
  });
});

exports.checkOutSession = catchAsync(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  //1) Get CardItem  From Cart Model passed on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new AppError('Cart Not Found With This Id', 404));
  }
  console.log(cart);
  //2) Get order price Based On Cart price and Check if coupon Applied (taxPrice:0,ShippingPrice:0)
  const orderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = orderPrice + taxPrice + shippingPrice;
  //Create Stripe Session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          unit_amount: Math.round(totalOrderPrice * 100),
          product_data: {
            name: `${req.user.name}`,
          },
        },

        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/order`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: cart._id,
    metadata: req.body.shippingAddress,
  });
  //Send Session
  res.status(200).json({
    status: 'success',
    session,
  });
});
