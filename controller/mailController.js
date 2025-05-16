// controllers/mailController.js
const nodemailer = require('nodemailer');
const ActivityList    = require('../models/activityList');
const MailDescription = require('../models/mailDescription');

// Build transporter with explicit options
const transporter = nodemailer.createTransport({
  host:    process.env.SMTP_HOST,
  port:    parseInt(process.env.SMTP_PORT, 10),
  secure:  true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  requireTLS: true,
  logger:     true,  // log to console
  debug:      true,  // include SMTP traffic in logs
  tls: {
    // do not fail on invalid certs (for testing only!)
    rejectUnauthorized: false
  }
});

// At startup, verify connection
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ SMTP connection error:', err);
  } else {
    console.log('✅ SMTP server is ready to take messages');
  }
});

exports.sendMailToList = async (req, res) => {
  try {
    const { activityId, subject, description } = req.body;
    if (!activityId ||!subject || !description) {
      return res
        .status(400)
        .json({ status: 'error', message: 'activityId, from, subject and description are required.' });
    }

    // Fetch list & emails
    const list = await ActivityList.findOne({ activityId });
    if (!list) {
      return res.status(404).json({ status:'error', message:'Activity list not found.' });
    }
    const emails = list.contacts.map(c => c.email);
    if (!emails.length) {
      return res.status(400).json({ status:'error', message:'No contacts to email.' });
    }

    // Send
    await transporter.sendMail({
      bcc: emails,
      subject,
      text: description
    });

    // Store description
    const mailDesc = new MailDescription({ activityId, description });
    await mailDesc.save();

    return res.json({
      status:  'success',
      message: `Sent to ${emails.length} contacts.`,
      data:    { descriptionId: mailDesc.descriptionId }
    });
  } catch (err) {
    console.error('Error sending mail:', err);
    return res.status(500).json({ status:'error', message:'Server error.' });
  }
};


exports.getMailDescription = async (req, res) => {
  try {
    const { activityId, descriptionId } = req.body;
    if (!activityId || !descriptionId) {
      return res.status(400).json({ status:'error', message:'activityId and descriptionId are required.' });
    }
    const mailDesc = await MailDescription.findOne({ activityId, descriptionId });
    if (!mailDesc) {
      return res.status(404).json({ status:'error', message:'Description not found.' });
    }
    return res.json({ status:'success', description: mailDesc.description });
  } catch(err) {
    console.error('Error fetching description:', err);
    return res.status(500).json({ status:'error', message:'Server error.' });
  }
};
