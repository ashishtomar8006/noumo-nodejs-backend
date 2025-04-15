import db from "../models/index.js";
import { validationResult } from "express-validator";

const saveContactUs = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, errors: errors.array() });
  }

  try {
   
    const response = await db.ContactUs.create(req.body);

    if (response) {
      return res
        .status(200)
        .json({ message: "Contact added successfully.", status: true });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to add contact.", status: false });
    }
  } catch (error) {
    console.error("Error saving contact:", error);
    return res.status(500).json({ message: error.message+"Server error", status: false });
  }
};

const getContactUsListing = async (req,res)=>{
    const response = await db.ContactUs.findAll();
    res.send({message:"success",status:true,data:response});
}

const deleteContact = async (req, res) => {
  try {
    const contact = await db.ContactUs.findByPk(req.params.id)
    if (!contact) {
      return res.status(404).send({ message: "Contact not found." })
    }
    await contact.destroy()
    res.status(200).send({ message: "Contact deleted successfully." })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

export { saveContactUs,getContactUsListing,deleteContact };
