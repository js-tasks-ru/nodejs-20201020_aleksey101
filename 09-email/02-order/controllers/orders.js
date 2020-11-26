const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const {product: productId, phone, address} = ctx.request.body;

  const order = await Order.create({
    product: productId,
    phone,
    address,
    user: ctx.user,
  });

  const product = await Product.findById(productId);
  await sendMail({
    to: ctx.user.email,
    subject: 'Успешная создание заказа',
    template: 'order-confirmation',
    locals: {
      product,
      orderId: order.id,
    },
  });
  ctx.body = {
    order: order.id,
  };
  return next();
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order
      .find({user: ctx.user.id})
      .populate('product');

  ctx.body = {
    orders,
  };
  return next();
};
