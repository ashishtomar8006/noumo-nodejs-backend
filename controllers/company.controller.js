import db from "../models/index.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs"
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
      location,
      password
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
      location,
      password: password
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
    return res.status(500).json({ message: error.message + "Server error", status: false });
  }
};

const getCompanyListing = async (req, res) => {
  try {
    const response = await db.User.findAll({
      where: { roleId: 5, isActive: true },
      include: [
        {
          model: db.Company,
          as: "company", // must match the alias used in `hasOne`
        },
      ],
    });

    res.send({ message: "success", status: true, data: response });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};



const getCompanyRequestById = async (req, res) => {
  const response = await db.CompanyRequest.findByPk(req.params.id);
  res.send({ message: "success", status: true, data: response });
}

const updateCompanyRequest = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, errors: errors.array() });
  }

  try {
    const {
      id, // Make sure this is passed from the frontend
      firstName,
      lastName,
      jobTitle,
      email,
      phone,
      companyName,
      industry,
      companySize,
      location,
    } = req.body;

    const updateData = {
      first_name: firstName,
      last_name: lastName,
      job_title: jobTitle,
      email,
      phone,
      company_name: companyName,
      industry,
      company_size: companySize,
      location,
    };

    const [updatedCount] = await db.CompanyRequest.update(updateData, {
      where: { id }, // update based on ID
    });

    if (updatedCount > 0) {
      return res
        .status(200)
        .json({ message: "Company request updated successfully.", status: true });
    } else {
      return res
        .status(404)
        .json({ message: "Company request not found or not updated.", status: false });
    }
  } catch (error) {
    console.error("Error updating Company request:", error);
    return res.status(500).json({ message: error.message + " Server error", status: false });
  }
};

const approvedCompanyRequest = async (req, res) => {
  try {
    const { id, status } = req.params;

    // Step 1: Fetch the company request
    const companyRequestData = await db.CompanyRequest.findByPk(id);

    if (!companyRequestData) {
      return res.status(404).json({ message: "Company request not found" });
    }

    // Step 2: Update request status
    await companyRequestData.update({ status });

    if (status == 1) {
      // Step 3: Create user data
      const companyUserData = await db.User.create({
        firstName: companyRequestData.first_name,
        lastName: companyRequestData.last_name,
        companyName: companyRequestData.company_name,
        email: companyRequestData.email,
        password: bcrypt.hashSync(companyRequestData.password, 8),
        roleId: 5, // company role
        industry: companyRequestData.industry,
      });

      // Step 4: Create company data
      await db.Company.create({
        companyUserId: companyUserData.id,
        industry: companyRequestData.industry,
        company_size: companyRequestData.company_size,
        company_name: companyRequestData.company_name,
        location: companyRequestData.location,
      });
      return res.status(200).json({ message: "Company approved and created successfully", status: 1 });
    } else {
      return res.status(200).json({ message: "Company request marked as pending ", status: 1 });
    }
  } catch (error) {
    console.error("Error approving company request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const deleteCompanyUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    await user.destroy(); // This will trigger cascade deletion

    return res.status(200).json({ message: "User and related company data deleted", status: true });
  } catch (error) {
    console.error("Error deleting company user:", error);
    return res.status(500).json({ message: "Internal Server Error", status: false });
  }
};


export { saveContactUs, getCompanyListing, deleteCompanyUser, getCompanyRequestById, updateCompanyRequest, approvedCompanyRequest };
