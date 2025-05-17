const Template = require('../models/template')

// Create a new template
exports.createTemplate = async (req, res) => {
  const { name, content } = req.body

  if (!name || !content) {
    return res.status(400).json({ error: 'Name and content are required' })
  }

  try {
    const exists = await Template.findOne({ name })
    if (exists) return res.status(409).json({ error: 'Template name already exists' })

    const template = new Template({ name, content })
    await template.save()

    res.status(201).json({ message: 'Template created successfully', data: template })
  } catch (err) {
    console.error('Create Template Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get all templates
exports.listTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 })
    res.status(200).json({ data: templates })
  } catch (err) {
    console.error('List Templates Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}
