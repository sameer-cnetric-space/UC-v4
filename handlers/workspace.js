const CMS = require("../models/cms");
const Commerce = require("../models/commerce");
const Payment = require("../models/payments");
const Search = require("../models/search");
const BModel = require("../models/bModel");
class WorkspaceHandler {
  static async formatWorkspaceData(workspace) {
    try {
      // Destructure IDs from nested structure
      const commerceId = workspace.commerce?.commerce_id;
      const cmsId = workspace.cms?.cms_id;
      const searchId = workspace.search?.search_id;
      const paymentIds = workspace.payment?.map((p) => p.payment_id) || [];

      // Fetch additional details
      const [commerce, cms, search, payments] = await Promise.all([
        Commerce.findById(commerceId).select("_id name description image_url"),
        CMS.findById(cmsId).select("_id name description image_url"),
        Search.findById(searchId).select("_id name description image_url"),
        Payment.find({ _id: { $in: paymentIds } }).select(
          "_id name description image_url"
        ),
      ]);

      // Format and return
      return {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description,
        type: workspace.type,
        composer_url: workspace.composer_url,
        template_id: workspace.template_id,
        org_id: workspace.orgId,
        users: workspace.users,
        commerce: commerce
          ? {
              id: commerce._id,
              name: commerce.name,
              description: commerce.description,
              // image_url: buildFileUrl(req, commerce.image_url),
            }
          : null,
        cms: cms
          ? {
              id: cms._id,
              name: cms.name,
              description: cms.description,
              // image_url: buildFileUrl(req, cms.image_url),
            }
          : null,
        search: search
          ? {
              id: search._id,
              name: search.name,
              description: search.description,
              // image_url: buildFileUrl(req, search.image_url),
            }
          : null,
        payments: payments.map((payment) => ({
          id: payment._id,
          name: payment.name,
          description: payment.description,
          // image_url: buildFileUrl(req, payment.image_url),
        })),
        theme: workspace.theme,
        created_at: workspace.createdAt,
        updated_at: workspace.updatedAt,
      };
    } catch (error) {
      console.error("Error formatting workspace data:", error);
      throw new Error("Failed to format workspace data");
    }
  }
}

module.exports = WorkspaceHandler;
