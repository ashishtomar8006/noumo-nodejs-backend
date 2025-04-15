import db from "../models/index.js";
import { validationResult } from "express-validator";

const saveContactUs = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, errors: errors.array() });
  }

  try {
    const {
      firstName,
      lastName,
      jobTitle,
      email,
      phone,
      companyName,
      industry,
      companySize,
      location
    } = req.body;

    const contactusdata = {
      first_name: firstName,
      last_name: lastName,
      job_title: jobTitle,
      email,
      phone,
      company_name: companyName,
      industry,
      company_size: companySize,
      location
    };

    const response = await db.CompanyRequest.create(contactusdata);

    if (response) {
      return res
        .status(200)
        .json({ message: "Company request added successfully.", status: true });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to add Company request.", status: false });
    }
  } catch (error) {
    console.error("Error saving Company request:", error);
    return res.status(500).json({ message: error.message+"Server error", status: false });
  }
};

const getContactUsListing = async (req,res)=>{
    const response = await db.CompanyRequest.findAll();
    res.send({message:"success",status:true,data:response});
}


const deleteContact = async (req, res) => {
  try {
    const contact = await db.CompanyRequest.findByPk(req.params.id)
    if (!contact) {
      return res.status(404).send({ message: "Company request not found." })
    }
    await contact.destroy()
    res.status(200).send({ message: "Company request deleted successfully." })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

export { saveContactUs,getContactUsListing,deleteContact };
