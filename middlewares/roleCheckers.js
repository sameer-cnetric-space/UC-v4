const superAdminCheck = (req, res, next) => {
  if (req.user.role !== "super-admin") {
    return res.status(403).json({
      message: "Forbidden. You do not have the required permission",
    });
  }
  next();
};

const orgAdminCheck = (req, res, next) => {
  if (req.user.role !== "org-admin" && req.user.role !== "super-admin") {
    return res.status(403).json({
      message: "Forbidden. You do not have the required permission",
    });
  }
  next();
};

const templateAdminCheck = (req, res, next) => {
  if (
    req.user.role !== "template-admin" &&
    req.user.role !== "org-admin" &&
    req.user.role !== "super-admin"
  ) {
    return res.status(403).json({
      message: "Forbidden. You do not have the required permission",
    });
  }
  next();
};

const workspaceAdminCheck = (req, res, next) => {
  if (
    req.user.role !== "workspace-admin" &&
    req.user.role !== "template-admin" &&
    req.user.role !== "org-admin" &&
    req.user.role !== "super-admin"
  ) {
    return res.status(403).json({
      message: "Forbidden. You do not have the required permission",
    });
  }
  next();
};

module.exports = {
  superAdminCheck,
  orgAdminCheck,
  templateAdminCheck,
  workspaceAdminCheck,
};
