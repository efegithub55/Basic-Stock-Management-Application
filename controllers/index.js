const Product = require("../models/productModel");

exports.getIndex = async (req, res) => {
  const data = await Product.getLowStock();
  console.log(data);
  res.render("index");
};
