const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
  // store the activityId of the associated list
  activityId: {
    type: Schema.Types.ObjectId,
    ref: 'ActivityList',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);