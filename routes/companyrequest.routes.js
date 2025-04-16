


import { saveContactUs,getContactUsListing,deleteContact,getCompanyRequestById,updateCompanyRequest,approvedCompanyRequest } from "../controllers/companyrequest.controller.js"

export const contactRoutes = (app) => {
  app.post("/api/save-company-request", saveContactUs)
  app.get("/api/company-request-list", getContactUsListing)
  app.get("/api/delete-company-request/:id", deleteContact)
  app.get("/api/get-company-request-by-id/:id", getCompanyRequestById)
  app.post("/api/update-company-request", updateCompanyRequest)
  app.get("/api/approved-company-request/:id/:status", approvedCompanyRequest)  
}

export default contactRoutes

