
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoUrl = "mongodb://localhost:27017/crud";
mongoose
  .connect(mongoUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error", err));

// Define schema and model
const modelcrud = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const Curd = mongoose.model("crud", modelcrud);

// POST - Create a new CRUD entry
app.post("/post", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    // Check if email already exists
    const findEmail = await Curd.findOne({ email });
    if (findEmail) {
      return res.json({ success: false, message: "Email is already in use." });
    }

    // Create and save the new entry
    const crud = new Curd({ name, email, password });
    await crud.save();
    res.json({ success: true, data: crud });
  } catch (error) {
    res.json({ success: false, message: "Server error: " + error });
  }
});

// GET - Fetch all CRUD entries
app.get("/get", async (req, res) => {
  try {
    const findAllData = await Curd.find();
    if (!findAllData.length) {
      return res.json({ success: false, message: "No data found." });
    }
    res.json({ success: true, message: "Fetched all data", data: findAllData });
  } catch (error) {
    res.json({ success: false, message: "Cannot fetch data. Server error: " + error });
  }
});

// PUT - Update a CRUD entry by ID
app.put("/put/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Find and update the entry
    const findAndUpdate = await Curd.findByIdAndUpdate(
      id,
      { name, email, password },
      { new: true } // Return the updated document
    );

    if (!findAndUpdate) {
      return res.json({ success: false, message: "Entry not found." });
    }

    res.json({ success: true, message: "Updated successfully.", data: findAndUpdate });
  } catch (error) {
    res.json({ success: false, message: "Server error: " + error });
  }
});

// DELETE - Delete a CRUD entry by ID
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the entry
    const deleteVal = await Curd.findByIdAndDelete(id);
    if (!deleteVal) {
      return res.json({ success: false, message: "Entry not found to delete." });
    }

    res.json({ success: true, message: "Deleted successfully.", data: deleteVal });
  } catch (error) {
    res.json({ success: false, message: "Server error: " + error });
  }
});

// Home route (Test Route)
app.get("/", async (req, res) => {
  try {
    res.json({ success: true, message: "The route is working successfully." });
  } catch (error) {
    res.json({ success: false, message: "Server error: " + error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
