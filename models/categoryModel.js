const mongoose = require('mongoose');
const slugify = require('slugify');
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category must have a name'],
      unique: [true, 'This name of category is already exist '],
      minlength: [3, 'Name of category must more than 3 characters'],
      maxlength: [32, 'Name of category must less than 32 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre('save', function () {
  this.slug = slugify(this.name);
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
