const express = require("express");
const UserController = require("../controllers/user");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { registrationSchema, loginSchema } = require("../validations/user");

const router = express.Router();

router.post(
  "/register",
  validate(registrationSchema),
  UserController.registerUser
);
router.post("/login", validate(loginSchema), UserController.userLogin);
router.get("/me", auth, UserController.getUserDetails);
router.put("/update", auth, UserController.updateUser);
router.delete("/delete", auth, UserController.deleteUser);

module.exports = router;
