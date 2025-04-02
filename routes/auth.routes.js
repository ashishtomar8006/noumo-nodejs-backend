import { signup, signin } from "../controllers/auth.controller.js"

export const authRoutes = (app) => {
  app.post("/api/auth/signup", signup)
  app.post("/api/auth/signin", signin)
}

export default authRoutes

