const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema({
  stock: {
    type: String,
    required: true
  },
  price: String,
  likeIPs: [{ type: String }]
});

module.exports = mongoose.model('Stock', StockSchema);