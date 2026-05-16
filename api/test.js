module.exports = function handler(req, res) {
  res.status(200).json({ status: "API is working!", method: req.method });
};
