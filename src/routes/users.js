const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const userValidator = require("../validators/userValidator");

const router = express.Router();
const usersController = require("../controllers/usersController");

router.post(
  "/create",
  [auth, admin, userValidator.validateCreateUser],
  usersController.createUser
);

router.post(
  "/update",
  [auth, admin, userValidator.validateUpdatedUser],
  usersController.updateUser
);

router.get("/list", [auth, admin], usersController.usersList);
router.get("/:id", [auth, admin], usersController.getUser);
router.delete("/:id", [auth, admin], usersController.deleteUser);

router.post(
  "/change_password",
  [auth, userValidator.validateChangePassword],
  usersController.changeUserPassword
);

router.post("/login", userValidator.validateUserLogin, usersController.login);

module.exports = router;
