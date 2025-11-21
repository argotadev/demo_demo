const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: { type: String, unique: false, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  provider: { type: String, required: true }, // solo esta definición
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  medida: { type: String },
  price_siva: { type: Number },
  price_usd: { type: Number },
  price_final: { type: Number },
  por_marginal: { type: Number },
  por_descuento: { type: Number },
  create_at: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});



  
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
