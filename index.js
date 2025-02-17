const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Menu Item Schema
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Get All Menu Items
app.get('/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Menu Item
app.put('/menu/:id', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, { name, description, price }, { new: true, runValidators: true });
        if (!updatedItem) return res.status(404).json({ message: 'Menu item not found' });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Menu Item
app.delete('/menu/:id', async (req, res) => {
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Menu item not found' });
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));