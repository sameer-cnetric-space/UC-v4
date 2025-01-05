const { seedBModels } = require("./bModels");
const { seedCMS } = require("./cms");
const { seedCommerce } = require("./commerce");
const { seedPayments } = require("./payments");
const { seedTemplates } = require("./templates");
const { seedCRM } = require("./crm");
const { seedSearch } = require("./search");

const seedDB = async () => {
  // Run all seeding scripts
  await seedBModels();
  await seedCMS();
  await seedCommerce();
  await seedPayments();
  await seedCRM();
  await seedSearch();
  await seedTemplates();

  console.log("Seeding completed!");
};

module.exports = seedDB;
