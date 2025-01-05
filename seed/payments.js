const Payment = require("../models/payments");

const seedPayments = async () => {
  const data = [
    {
      name: "Stripe",
      description:
        "A powerful online payment processing platform for businesses, supporting a wide range of payment methods.",
      image_url: "/public/assets/entities/payment/stripe.png",
    },
    {
      name: "Paypal",
      description:
        "A global online payment system enabling secure transactions for businesses and consumers across various platforms.",
      image_url: "/public/assets/entities/payment/paypal.png",
    },
  ];

  try {
    // Check if any data already exist
    const existingPayment = await Payment.find();
    if (existingPayment.length === 0) {
      // Insert predefined Payment
      await Payment.insertMany(data);
      console.log("Predefined Payment added successfully.");
    }
  } catch (error) {
    console.error("Error initializing Payment:", error);
  }
};

module.exports = {
  seedPayments,
};
