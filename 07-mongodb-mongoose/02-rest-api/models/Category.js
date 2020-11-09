const mongoose = require('mongoose');
const connection = require('../libs/connection');
const {transformDefaultParams} = require('../libs/transforms');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

subCategorySchema.set('toObject', {
  transform: transformDefaultParams,
});
subCategorySchema.set('toJSON', {
  transform: transformDefaultParams,
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
});

categorySchema.set('toObject', {
  transform: transformDefaultParams,
});
categorySchema.set('toJSON', {
  transform: transformDefaultParams,
});

module.exports = connection.model('Category', categorySchema);
