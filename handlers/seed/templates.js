const BModel = require("../../models/bModel");
const CMS = require("../../models/cms");
const Commerce = require("../../models/commerce");
const Payment = require("../../models/payments");
const Search = require("../../models/search");

class SeedTemplateHandler {
  static async expressTemplateData() {
    try {
      // Data mapping for the Express Template
      const expressData = {
        bModel: "B2C",
        commerce: "Vendure",
        cms: "Strapi",
        search: "Typesense",
        payments: ["Stripe"],
      };

      // Fetch data dynamically based on the mappings
      const bModel = await BModel.findOne({ name: expressData.bModel });
      if (!bModel) throw new Error("B2C BModel not found");

      const commerce = await Commerce.findOne({ name: expressData.commerce });
      if (!commerce) throw new Error("Vendure Commerce not found");

      const cms = await CMS.findOne({ name: expressData.cms });
      if (!cms) throw new Error("Strapi CMS not found");

      const search = await Search.findOne({ name: expressData.search });
      if (!search) throw new Error("Typesense Search not found");

      const payments = await Payment.find({
        name: { $in: expressData.payments },
      });
      if (!payments.length) throw new Error("No matching payments found");

      // Extract payment IDs
      const paymentIds = payments.map((payment) => payment._id);

      // Return the standardized data
      return {
        bModelId: bModel._id,
        commerceId: commerce._id,
        cmsId: cms._id,
        searchId: search._id,
        paymentIds,
      };
    } catch (error) {
      console.error(
        "Error in fetching data for Express Template:",
        error.message
      );
      throw new Error("Failed to fetch data for Express Template");
    }
  }
}

module.exports = SeedTemplateHandler;
