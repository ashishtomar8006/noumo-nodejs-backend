import {
    createCategory,
    getCategories,  
    getCategoryById,
    updateCategory,
    deleteCategory,
  } from "../controllers/category.controller.js"
  import { verifyToken, isAdmin } from "../middleware/authJwt.js"
  
  const categoryRoutes = (app) => {
    // Create a new category (admin only)
    app.post("/api/categories", [verifyToken, isAdmin], createCategory)
  
    // Get all categories
    app.get("/api/categories", getCategories)
  
    // Get category by ID
    app.get("/api/categories/:id", getCategoryById)
  
    // Update category (admin only)
    app.put("/api/categories/:id", [verifyToken, isAdmin], updateCategory)
  
    // Delete category (admin only)
    app.delete("/api/categories/:id", [verifyToken, isAdmin], deleteCategory)
  }
  
  export default categoryRoutes
  
  