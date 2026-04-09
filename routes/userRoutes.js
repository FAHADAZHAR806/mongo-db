const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router
  .route("/")
  .post(createUser) // POST   /api/users
  .get(getAllUsers); // GET    /api/users

router
  .route("/:id")
  .get(getUserById) // GET    /api/users/:id
  .put(updateUser) // PUT    /api/users/:id
  .delete(deleteUser); // DELETE /api/users/:id

module.exports = router;
