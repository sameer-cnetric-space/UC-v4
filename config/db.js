const mongoose = require("mongoose");
const seedDB = require("../seed/index");

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Run the seed script after successful connection
    await seedDB();
    console.log("Database Seeding Checked.");
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1); // Exit the process if the database connection fails
  }
};

module.exports = connectDB;
