exports.getIndex = async (req, res) => {
  console.log(req.user);
  res.render("index");
};
