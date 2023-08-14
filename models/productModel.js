const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Too short product title'],
      maxlength: [100, 'Too long product title'],
    },
    slug: {
      type: String,
      // required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [20, 'Too short product description'],
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      trim: true,
      max: [200000, 'Too long product price'],
    },
    priceAfterDiscount: {
      type: Number,
      validate: {
        validator: function (priceAfterDiscount) {
          return priceAfterDiscount < this.price;
        },
        message: 'Price after discount must be below original price.',
      },
    },
    colors: [String],

    imageCover: {
      type: String,
      required: [true, 'Product Image cover is required'],
    },
    images: [String],
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Product must be belong to category'],
      validate: {
        validator: async function (category) {
          const check = await mongoose.model('Category').findById(category);
          return check;
        },
        message: 'There is no category with this name or Id',
      },
    },
    subcategoriesId: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be below or equal 5.0'],
      // set: (val) => Math.round(val * 10) / 10, // 3.3333 * 10 => 33.333 => 33 => 3.3
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.path('subcategoriesId').validate(async (subcategoriesId) => {
  if (!subcategoriesId || subcategoriesId.length === 0) {
    //Don't Apply the validation if no received subcategoriesId
    return true;
  }
  const check = await mongoose
    .model('SubCategory')
    .find({ _id: { $exists: true, $in: subcategoriesId } });
  return check.length === subcategoriesId.length;
}, 'There is no Sub category with this name or Id. Please check the Ids of Sub Categories');

productSchema.path('subcategoriesId').validate(async function (
  subcategoriesId,
) {
  if (!subcategoriesId || subcategoriesId.length === 0) {
    //Don't Apply the validation if no received subcategoriesId
    return true;
  }
  const inputSubCategories = [];
  const subCatDB = [];

  const allSubCat = await mongoose
    .model('SubCategory')
    .find({ category: this.category });

  allSubCat.forEach((el) => {
    subCatDB.push(el._id.toString());
  });
  subcategoriesId.forEach((el) => {
    inputSubCategories.push(el.toString());
  });
  // const checker = subcategoriesId.every()
  return inputSubCategories.every((val) => subCatDB.includes(val));
}, 'There is no sub category from parent category. Please check the sub categories from parent Category');

productSchema.pre('save', function (next) {
  this.slug = slugify(this.title);
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name -_id',
  });
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
