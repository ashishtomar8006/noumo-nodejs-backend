import express from "express"
import cors from "cors"
import { connectDB } from "./config/database.js"
import db from "./models/index.js"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to Database
connectDB()

// Initialize Roles
const initRoles = async () => {
  try {
    // Check if roles already exist
    const count = await db.Role.count()
    if (count === 0) {
      // Create default roles
      await db.Role.bulkCreate([{ name: "admin" }, { name: "mentor" }, { name: "student" }])
      console.log("✅ Default roles created successfully!")
    }
  } catch (error) {
    console.error("❌ Error initializing roles:", error)
  }
}

// Routes
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import courseRoutes from "./routes/course.routes.js"
import categoryRoutes from "./routes/category.routes.js"

// Initialize routes
authRoutes(app)
userRoutes(app)
courseRoutes(app)
categoryRoutes(app)

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Learning Platform API" })
})

const PORT = process.env.PORT || 8080

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`)

  // Initialize roles after server starts
  await initRoles()
})

