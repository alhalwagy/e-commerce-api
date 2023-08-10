const mongoose = require('mongoose');
const slugify = require('slugify');

const subCatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [
        true,
        'Name of sub category is already exist, Please use another name.',
      ],
      minlength: [2, 'Name of sub category must be more than 2 characters'],
      maxlength: [32, 'Name of sub category must be less than 32 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Sub category must have parent category'],
      validate: {
        validator: async function (categoryId) {
          const category = await mongoose
            .model('Category')
            .findById(categoryId);
          return category !== null;
        },
        message: 'Invalid category ID',
      },
    },
  },
  {
    timestamps: true,
  },
);

subCatSchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

// subCatSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'categoryId',
//     select: 'name -_id',
//   });
//   next();
// });

const SubCategory = mongoose.model('SubCategory', subCatSchema);
module.exports = SubCategory;
