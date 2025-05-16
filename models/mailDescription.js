// models/mailDescription.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const mailDescriptionSchema = new Schema({
  activityId:    { type: String, required: true },
  descriptionId: { type: String, default: () => new mongoose.Types.ObjectId().toString(), unique: true },
  description:   { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('MailDescription', mailDescriptionSchema);
