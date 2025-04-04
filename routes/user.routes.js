import { getUsers, getUserById, updateUser, deleteUser,getAllUniversity,addUniversity,updateUniversity,deleteUniversity } from "../controllers/user.controller.js"
import { verifyToken, isAdmin } from "../middleware/authJwt.js"

export const userRoutes = (app) => {
  // Get all users (admin only)
  app.get("/api/users", [verifyToken, isAdmin], getUsers)


  app.get("/api/university", [verifyToken, isAdmin], getAllUniversity)
  app.post("/api/add-university", [verifyToken, isAdmin], addUniversity)
  app.put("/api/university/:id", verifyToken, updateUniversity)
  app.delete("/api/university/:id", [verifyToken], deleteUniversity)

  // Get user by ID
  app.get("/api/users/:id", verifyToken, getUserById)

  // Update user
  app.put("/api/users/:id", verifyToken, updateUser)

  // Delete user (admin only)
  app.delete("/api/users/:id", [verifyToken, isAdmin], deleteUser)


  

}

export default userRoutes

