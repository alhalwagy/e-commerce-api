const mongoose = require('mongoose');
const slugify = require('slugify');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand must have a name'],
      unique: [true, 'This name of Brand is already exist '],
      minlength: [3, 'Name of Brand must more than 3 characters'],
      maxlength: [32, 'Name of Brand must less than 32 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  },
);

brandSchema.pre('save', function () {
    this.slug = slugify(this.name);
  });

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;
