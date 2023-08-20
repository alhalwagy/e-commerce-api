const categoryRoutes = require('./categoryRoutes');
const subCatRoutes = require('./subCatRoutes');
const brandRoutes = require('./brandRoutes');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');
const reviewRoutes = require('./reviewRoutes');
const wishListRoutes = require('./wishListRoutes');
const addressRoutes = require('./addressRoutes');
const couponRoutes = require('./couponRoutes');
const cartRoute = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');

const mountRoutes = (app) => {
  app.use('/api/v1/category', categoryRoutes);
  app.use('/api/v1/subcategory', subCatRoutes);
  app.use('/api/v1/brand', brandRoutes);
  app.use('/api/v1/product', productRoutes);
  app.use('/api/v1/user', userRoutes);
  app.use('/api/v1/review', reviewRoutes);
  app.use('/api/v1/wishlist', wishListRoutes);
  app.use('/api/v1/address', addressRoutes);
  app.use('/api/v1/coupon', couponRoutes);
  app.use('/api/v1/cart', cartRoute);
  app.use('/api/v1/order', orderRoutes);
};

module.exports = mountRoutes;
