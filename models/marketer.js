// models/marketer.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const { Schema } = mongoose;

const marketerSchema = new Schema(
  {
    marketerId: {
      type:    String,
      unique:  true,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    name: {
      type:     String,
      required: true,
      trim:     true
    },
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true
    },
    phoneNumber: {
      type:     String,
      required: true,
      trim:     true
    },
    role: {
      type:     String,
      required: true,
      enum:     ['marketer'],
      default:  'marketer'
    },
    password: {
      type:     String,
      required: true
    },
    // overall signup status: 0 = pending, 1 = approved, 2 = rejected
    status: {
      type:    Number,
      enum:    [0, 1, 2],
      default: 0
    },
  },
  { timestamps: true }
);

// Hash password before saving
marketerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plaintext password
marketerSchema.methods.matchPassword = function (pw) {
  return bcrypt.compare(pw, this.password);
};

module.exports = mongoose.model('Marketer', marketerSchema);