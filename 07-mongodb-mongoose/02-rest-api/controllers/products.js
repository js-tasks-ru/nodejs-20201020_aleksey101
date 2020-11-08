const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.request.query;
  if (subcategory) {
    const isValid = mongoose.Types.ObjectId.isValid(subcategory);
    if (!isValid) ctx.throw(400, 'invalid subcategory');
  }

  ctx.request.subcategory = subcategory || null;
  return next();
};

module.exports.productList = async function productList(ctx, next) {
  const query = {};
  if (ctx.request.subcategory) {
    query.subcategory = ctx.request.subcategory;
  }
  const products = await Product.find(query);
  ctx.body = {products};
};

module.exports.productById = async function productById(ctx) {
  const product = await Product.findById(ctx.params.id);
  if (!product) ctx.throw(404, 'product not found');
  ctx.body = {product};
};

