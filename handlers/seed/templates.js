const BModel = require("../../models/bModel");
const CMS = require("../../models/cms");
const Commerce = require("../../models/commerce");
const Payment = require("../../models/payments");
const Search = require("../../models/search");

class SeedTemplateHandler {
  static async expressTemplateData() {
    try {
      // Data mapping for Express Templates
      const expressTemplates = [
        {
          name: "Universal Commerce Stack",
          description:
            "This is the template under Express Edition for Universal Commerce",
          bModel: "B2C",
          commerce: "Universal Commerce",
          cms: "Strapi",
          search: "Typesense",
          payments: ["Stripe"],
        },
        {
          name: "Shopify Stack",
          description: "This is the template under Express Edition for Shopify",
          bModel: "B2C",
          commerce: "Shopify",
          cms: "Contentful",
          search: "Algolia",
          payments: ["Stripe"],
        },
      ];

      const results = [];

      for (const template of expressTemplates) {
        // Fetch data dynamically
        const bModel = await BModel.findOne({ name: template.bModel });
        if (!bModel) throw new Error(`${template.bModel} BModel not found`);

        const commerce = await Commerce.findOne({ name: template.commerce });
        if (!commerce)
          throw new Error(`${template.commerce} Commerce not found`);

        const cms = await CMS.findOne({ name: template.cms });
        if (!cms) throw new Error(`${template.cms} CMS not found`);

        const search = await Search.findOne({ name: template.search });
        if (!search) throw new Error(`${template.search} Search not found`);

        const payments = await Payment.find({
          name: { $in: template.payments },
        });
        if (!payments.length)
          throw new Error(
            `No matching payments found for ${template.payments}`
          );

        const paymentIds = payments.map((payment) => payment._id);

        // Construct the final template object
        results.push({
          name: template.name,
          description: template.description,
          bModel_id: bModel._id,
          type: "Express",
          commerce_id: commerce._id,
          cms_id: cms._id,
          search_id: search._id,
          payment_ids: paymentIds,
        });
      }

      return results;
    } catch (error) {
      console.error(
        "Error in fetching data for Express Templates:",
        error.message
      );
      throw new Error("Failed to fetch data for Express Templates");
    }
  }

  static async standardTemplateData() {
    try {
      // Data mapping for Standard Templates
      const standardTemplates = [
        {
          name: "ShopifyPlus Stack",
          description:
            "This is the template under Standard Edition for ShopifyPlus.",
          bModel: "B2C",
          commerce: "ShopifyPlus",
          cms: "Contentful",
          search: "Algolia",
          payments: ["Stripe"],
        },
        {
          name: "Emporix Stack",
          description:
            "This is the template under Standard Edition for Emporix.",
          bModel: "B2C",
          commerce: "Emporix",
          cms: "Contentful",
          search: "Algolia",
          payments: ["Stripe"],
        },
      ];

      const results = [];

      for (const template of standardTemplates) {
        // Fetch data dynamically
        const bModel = await BModel.findOne({ name: template.bModel });
        if (!bModel) throw new Error(`${template.bModel} BModel not found`);

        const commerce = await Commerce.findOne({ name: template.commerce });
        if (!commerce)
          throw new Error(`${template.commerce} Commerce not found`);

        const cms = await CMS.findOne({ name: template.cms });
        if (!cms) throw new Error(`${template.cms} CMS not found`);

        const search = await Search.findOne({ name: template.search });
        if (!search) throw new Error(`${template.search} Search not found`);

        const payments = await Payment.find({
          name: { $in: template.payments },
        });
        if (!payments.length)
          throw new Error(
            `No matching payments found for ${template.payments}`
          );

        const paymentIds = payments.map((payment) => payment._id);

        // Construct the final template object
        results.push({
          name: template.name,
          description: template.description,
          bModel_id: bModel._id,
          type: "Standard",
          commerce_id: commerce._id,
          cms_id: cms._id,
          search_id: search._id,
          payment_ids: paymentIds,
        });
      }

      return results;
    } catch (error) {
      console.error(
        "Error in fetching data for Standard Templates:",
        error.message
      );
      throw new Error("Failed to fetch data for Standard Templates");
    }
  }

  static async enterpriseTemplateData() {
    try {
      // Data mapping for Enterprise Templates
      const enterpriseTemplates = [
        {
          name: "Commercetools Stack",
          description:
            "This is the template under Enterprise Edition for SAP Commerce Cloud.",
          bModel: "B2B",
          commerce: "Commercetools",
          cms: "Contentful",
          search: "Algolia",
          payments: ["Stripe"],
        },
        {
          name: "HCL Commerce Stack",
          description:
            "This is the template under Enterprise Edition for Oracle Commerce.",
          bModel: "B2B",
          commerce: "HCL Commerce",
          cms: "HCL DX",
          search: "Algolia",
          payments: ["Stripe"],
        },
      ];

      const results = [];

      for (const template of enterpriseTemplates) {
        // Fetch data dynamically
        const bModel = await BModel.findOne({ name: template.bModel });
        if (!bModel) throw new Error(`${template.bModel} BModel not found`);

        const commerce = await Commerce.findOne({ name: template.commerce });
        if (!commerce)
          throw new Error(`${template.commerce} Commerce not found`);

        const cms = await CMS.findOne({ name: template.cms });
        if (!cms) throw new Error(`${template.cms} CMS not found`);

        const search = await Search.findOne({ name: template.search });
        if (!search) throw new Error(`${template.search} Search not found`);

        const payments = await Payment.find({
          name: { $in: template.payments },
        });
        if (!payments.length)
          throw new Error(
            `No matching payments found for ${template.payments}`
          );

        const paymentIds = payments.map((payment) => payment._id);

        // Construct the final template object
        results.push({
          name: template.name,
          description: template.description,
          bModel_id: bModel._id,
          type: "Enterprise",
          commerce_id: commerce._id,
          cms_id: cms._id,
          search_id: search._id,
          payment_ids: paymentIds,
        });
      }

      return results;
    } catch (error) {
      console.error(
        "Error in fetching data for Enterprise Templates:",
        error.message
      );
      throw new Error("Failed to fetch data for Enterprise Templates");
    }
  }
}

module.exports = SeedTemplateHandler;
