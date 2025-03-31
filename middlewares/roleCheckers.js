const exceptionShopCase = (req) => {
  return req.path.includes("/shop/");
};

const superAdminCheck = (req, res, next) => {
  if (exceptionShopCase(req)) return next(); // ✅ Return immediately if exception case applies

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. User not found" }); // ✅ Prevent TypeError
  }

  if (req.user.role !== "super-admin") {
    return res.status(403).json({
      message: "Forbidden. You do not have the required permission",
    });
  }

  next();
};

const orgAdminCheck = (req, res, next) => {
  if (exceptionShopCase(req)) return next(); // ✅ Fix return issue

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. User not found" });
  }

  if (req.user.role !== "org-admin" && req.user.role !== "super-admin") {
    return res.status(403).json({
      message: "Forbidden. You do not have the required permission",
    });
  }

  next();
};

const templateAdminCheck = (req, res, next) => {
  if (exceptionShopCase(req)) return next(); // ✅ Fix return issue

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. User not found" });
  }

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
  if (exceptionShopCase(req)) return next(); // ✅ Fix return issue

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. User not found" });
  }

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
