


import { saveContactUs,getContactUsListing,deleteContact } from "../controllers/contactus.controller.js"

export const contactRoutes = (app) => {
  app.post("/api/save-contact-us", saveContactUs)
  app.get("/api/contact-us-list", getContactUsListing)
  app.get("/api/delete-contact/:id", deleteContact)
  
  
}

export default contactRoutes

