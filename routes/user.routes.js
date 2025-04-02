import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js"
import { verifyToken, isAdmin } from "../middleware/authJwt.js"

export const userRoutes = (app) => {
  // Get all users (admin only)
  app.get("/api/users", [verifyToken, isAdmin], getUsers)

  // Get user by ID
  app.get("/api/users/:id", verifyToken, getUserById)

  // Update user
  app.put("/api/users/:id", verifyToken, updateUser)

  // Delete user (admin only)
  app.delete("/api/users/:id", [verifyToken, isAdmin], deleteUser)
}

export default userRoutes

