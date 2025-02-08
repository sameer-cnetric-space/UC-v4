const Template = require("../models/template");
const SeedTemplateHandler = require("../handlers/seed/templates");

const seedTemplates = async () => {
  try {
    // Fetch existing templates in one query
    const existingTemplates = await Template.find({
      type: { $in: ["Express", "Standard", "Enterprise"] },
    });

    // Determine which templates need to be seeded
    const missingTypes = ["Express", "Standard", "Enterprise"].filter(
      (type) => !existingTemplates.some((template) => template.type === type)
    );

    if (missingTypes.length === 0) {
      console.log(
        "All predefined templates already exist. No new templates to seed."
      );
      return;
    }

    // Fetch missing template data concurrently
    const templateFetchers = {
      Express: SeedTemplateHandler.expressTemplateData,
      Standard: SeedTemplateHandler.standardTemplateData,
      Enterprise: SeedTemplateHandler.enterpriseTemplateData,
    };

    const templateDataPromises = missingTypes.map((type) =>
      templateFetchers[type]()
    );
    const newTemplates = (await Promise.all(templateDataPromises)).flat();

    if (newTemplates.length > 0) {
      await Template.insertMany(newTemplates);
      console.log("Predefined templates added successfully.");
    } else {
      console.log("No new templates fetched.");
    }
  } catch (error) {
    console.error("Error initializing templates:", error);
  }
};

module.exports = {
  seedTemplates,
};
