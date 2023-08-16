/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'User must have a name.'],
      minlength: [3, 'Name must be more than 3 chars'],
      maxlength: [32, 'Name must be below 15 chars'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'User must have an email.'],
      unique: true,
      lowercase: true,
      validate: [
        validator.isEmail,
        'Email invalid. Please Ensure your right email.',
      ],
    },
    phone: {
      type: String,
      validate: {
        validator: function (phone) {
          return validator.isMobilePhone(phone, 'ar-EG');
        },
        message: 'Invalid phone number',
      },
    },
    image: String,
    password: {
      type: String,
      required: [true, 'Password is required. Please enter your password'],
      minlength: [8, 'Password too short, must be more than 8 chars'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [
        true,
        'Confirm Password is required. Please enter your confirm password',
      ],
      validate: {
        validator: function (passwordConfirm) {
          return passwordConfirm === this.password;
        },
        message: "Confirm password doesn't match password ",
      },
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ['user', 'manager', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.password = await bcrypt.hash(this.password, 14);
  this.passwordConfirm = undefined;
  this.passwordChangedAt = Date.now();

  next();
});

// Exclude the 'password' field from the response
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
  },
});

//Check password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkPasswordChanged = function (JWTTimestamps) {
  if (this.passwordChangedAt) {
    const changedTimestamps = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamps < changedTimestamps;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
