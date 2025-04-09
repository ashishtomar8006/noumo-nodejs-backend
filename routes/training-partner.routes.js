import {  getTrainingPartnerById,getAlTraningPartner,addTraningPartner,updateTrainingPartner,deleteTraningPartner } from "../controllers/traningPartner.controller.js"
import { verifyToken, isAdmin } from "../middleware/authJwt.js"

export const trainingPartner = (app) => {
  app.get("/api/trainings", [verifyToken, isAdmin], getAlTraningPartner)
  app.post("/api/add-training-partner", addTraningPartner)
  app.put("/api/training/:id", verifyToken, updateTrainingPartner)
  app.delete("/api/training/:id", [verifyToken], deleteTraningPartner)
  app.get("/api/getTrainingById", verifyToken, getTrainingPartnerById)

}

export default trainingPartner

