


import { saveContactUs,getContactUsListing,deleteContact } from "../controllers/companyrequest.controller.js"

export const contactRoutes = (app) => {
  app.post("/api/save-company-request", saveContactUs)
  app.get("/api/company-request-list", getContactUsListing)
  app.get("/api/delete-company-request/:id", deleteContact)
  
  
}

export default contactRoutes

