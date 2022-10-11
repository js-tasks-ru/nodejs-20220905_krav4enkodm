const Category = require('../models/Category.js');
const mapCategory = require('../mappers/category.js');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({});

  ctx.body = {categories: categories.map(mapCategory)};
};
