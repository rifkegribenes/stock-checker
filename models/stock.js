const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema({
  stock: {
    type: String,
    required: true
  },
  price: String,
  likes: Number
});

module.exports = mongoose.model('Stock', StockSchema);