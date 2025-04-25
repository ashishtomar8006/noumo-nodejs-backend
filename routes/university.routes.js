import {getUniversityById,getAllUniversity,addUniversity,updateUniversity,deleteUniversity } from "../controllers/university.controller.js"
import { verifyToken, isAdmin } from "../middleware/authJwt.js"

export const userRoutes = (app) => {

  app.get("/api/university", [verifyToken, isAdmin], getAllUniversity)
  app.post("/api/add-university", addUniversity)
  app.put("/api/university/:id", verifyToken, updateUniversity)
  app.delete("/api/university/:id", [verifyToken], deleteUniversity)
  app.get("/api/getUserversityById/:id", verifyToken, getUniversityById)  

}

export default userRoutes

