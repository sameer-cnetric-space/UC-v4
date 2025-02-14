const express = require("express");
const UserController = require("../../../controllers/user");
const validate = require("../../../middlewares/validate");
const {
  registrationSchema,
} = require("../../../validations/organization/user/index");

const router = express.Router({ mergeParams: true }); // Enable access to parent params

router.post(
  "/",
  validate(registrationSchema),
  UserController.addUserToOrganization
);
// router.post("/login", validate(loginSchema), UserController.userLogin);
// router.get("/me", auth, UserController.getUserDetails);
// router.put("/update", auth, UserController.updateUser);
//router.delete("/:userId", UserController.deleteOrgUser);

module.exports = router;
