const mongoose = require('mongoose');
const connection = require('../libs/connection');
const {transformDefaultParams} = require('../libs/transforms');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  images: [String],

});

productSchema.set('toObject', {
  transform: transformDefaultParams,
});
productSchema.set('toJSON', {
  transform: transformDefaultParams,
});

module.exports = connection.model('Product', productSchema);
