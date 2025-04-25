


import { saveCompany,getCompanyListing,deleteCompanyUser,getCompanyRequestById,updateCompany } from "../controllers/company.controller.js"

export const companyRoutes = (app) => {
  app.post("/api/save-company", saveCompany)
  app.get("/api/company-list", getCompanyListing)
  app.delete("/api/delete-company/:id", deleteCompanyUser)
  app.get("/api/get-company-by-id/:id", getCompanyRequestById)
  app.post("/api/update-company/:id", updateCompany)
}

export default companyRoutes

