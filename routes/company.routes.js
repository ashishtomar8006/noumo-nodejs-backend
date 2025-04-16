


import { saveContactUs,getCompanyListing,deleteCompanyUser,getCompanyRequestById,updateCompanyRequest,approvedCompanyRequest } from "../controllers/company.controller.js"

export const companyRoutes = (app) => {
  app.post("/api/save-company-request", saveContactUs)
  app.get("/api/company-list", getCompanyListing)
  app.delete("/api/delete-company/:id", deleteCompanyUser)
  app.get("/api/get-company-request-by-id/:id", getCompanyRequestById)
  app.post("/api/update-company-request", updateCompanyRequest)
  app.get("/api/approved-company-request/:id/:status", approvedCompanyRequest)  
}

export default companyRoutes

