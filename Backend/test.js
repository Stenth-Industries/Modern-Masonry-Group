import productService from './services/productService.js';
productService.getProducts({}).then(res => {
  console.log("SUCCESS");
  process.exit(0);
}).catch(err => {
  console.error("ERROR CAUGHT:");
  console.error(err);
  process.exit(1);
});
