const CMS = require("../models/cms");
const Commerce = require("../models/commerce");
const Payment = require("../models/payments");
const Search = require("../models/search");
const BModel = require("../models/bModel");
const { buildFileUrl } = require("../utils/buildUrl");

class TemplateHandler {
  // Helper function to get icons based on entity IDs
  static async iconGetter(req, { commerceId, cmsId, searchId, paymentIds }) {
    try {
      const commerceIcon = await Commerce.findOne({ _id: commerceId }).select(
        "image_url"
      );
      const cmsIcon = await CMS.findOne({ _id: cmsId }).select("image_url");
      const searchIcon = await Search.findOne({ _id: searchId }).select(
        "image_url"
      );
      const paymentIcons = await Payment.find({
        _id: { $in: paymentIds },
      }).select("image_url");

      return {
        commerce: commerceIcon
          ? buildFileUrl(req, commerceIcon.image_url)
          : null,
        cms: cmsIcon ? buildFileUrl(req, cmsIcon.image_url) : null,
        search: searchIcon ? buildFileUrl(req, searchIcon.image_url) : null,
        payments: paymentIcons.map((payment) =>
          buildFileUrl(req, payment.image_url)
        ),
      };
    } catch (error) {
      console.error("Error fetching icons:", error);
      throw new Error("Failed to retrieve icons.");
    }
  }

  // Format the templates data list
  static async formatTemplateDataList(req, presets, custom) {
    try {
      // Helper function to format individual templates
      const formatTemplate = async (template) => {
        const stackIcons = await TemplateHandler.iconGetter(req, {
          commerceId: template.commerce_id,
          cmsId: template.cms_id,
          searchId: template.search_id,
          paymentIds: template.payment_ids,
        });

        const bModelName = await BModel.findById(template.bModel_id).select(
          "name"
        );

        return {
          id: template._id,
          name: template.name,
          description: template.description,
          bModel: bModelName.name,
          stackIcons,
          createdAt: template.createdAt,
          updatedAt: template.updatedAt,
        };
      };

      // Format both presets and custom templates
      const formattedPresets = await Promise.all(presets.map(formatTemplate));
      const formattedCustom = await Promise.all(custom.map(formatTemplate));

      // Return final formatted object
      return {
        presets: formattedPresets,
        custom: formattedCustom,
      };
    } catch (error) {
      console.error("Error formatting template data:", error);
      throw new Error("Failed to format template data.");
    }
  }

  static async formatTemplateData(req, template) {
    try {
      // Fetch additional details for each entity
      const commerce = await Commerce.findById(template.commerce_id).select(
        "_id name description image_url"
      );
      const cms = await CMS.findById(template.cms_id).select(
        "_id name description image_url"
      );
      const search = await Search.findById(template.search_id).select(
        "_id name description image_url"
      );
      const payments = await Payment.find({
        _id: { $in: template.payment_ids },
      }).select("_id name description image_url");

      // Format and return the template data
      return {
        id: template._id,
        name: template.name,
        description: template.description,
        type: template.type,
        commerce: commerce
          ? {
              id: commerce._id,
              name: commerce.name,
              description: commerce.description,
              image_url: buildFileUrl(req, commerce.image_url),
            }
          : null,
        cms: cms
          ? {
              id: cms._id,
              name: cms.name,
              description: cms.description,
              image_url: buildFileUrl(req, cms.image_url),
            }
          : null,
        search: search
          ? {
              id: search._id,
              name: search.name,
              description: search.description,
              image_url: buildFileUrl(req, search.image_url),
            }
          : null,
        payments: payments.map((payment) => ({
          id: payment._id,
          name: payment.name,
          description: payment.description,
          image_url: buildFileUrl(req, payment.image_url),
        })),
        created_at: template.createdAt,
        updated_at: template.updatedAt,
      };
    } catch (error) {
      console.error("Error formatting template data:", error);
      throw new Error("Failed to format template data");
    }
  }
}

module.exports = TemplateHandler;
