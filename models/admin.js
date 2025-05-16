// models/Admin.js
const mongoose       = require('mongoose');
const bcrypt         = require('bcryptjs');
// ✨  no need for nanoid if you only want ObjectId-style strings

const adminSchema = new mongoose.Schema(
  {
    // use a second ObjectId purely as a string
    adminId : {
      type   : String,
      unique : true,
      default: () => new mongoose.Types.ObjectId().toString()
    },

    email   : {
      type     : String,
      required : true,
      unique   : true,
      trim     : true,
      lowercase: true
    },

    password: { type: String, required: true }
  },
  { timestamps: true }
);


// hash pw on save
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.matchPassword = function (pw) {
  return bcrypt.compare(pw, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
