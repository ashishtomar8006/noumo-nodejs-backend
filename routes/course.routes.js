import {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollCourse,
  } from "../controllers/course.controller.js"
  import { verifyToken, isMentor } from "../middleware/authJwt.js"
  
  const courseRoutes = (app) => {
    // Create a new course (mentor only)
    app.post("/api/courses", [verifyToken, isMentor], createCourse)
  
    // Get all courses
    app.get("/api/courses", getCourses)
  
    // Get course by ID
    app.get("/api/courses/:id", getCourseById)
  
    // Update course (mentor only)
    app.put("/api/courses/:id", [verifyToken, isMentor], updateCourse)
  
    // Delete course (mentor only)
    app.delete("/api/courses/:id", [verifyToken, isMentor], deleteCourse)
  
    // Enroll in a course
    app.post("/api/courses/:id/enroll", verifyToken, enrollCourse)
  }
  
  export default courseRoutes
  
  