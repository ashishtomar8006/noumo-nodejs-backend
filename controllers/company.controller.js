import db from "../models/index.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs"
import { Op } from "sequelize";

const saveCompany = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      companyName,
      companySize,
      industry,
      location,
      jobTitle,
    } = req.body;

    // Check if user already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await db.User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: bcrypt.hashSync(password, 8),
      roleId: 5, 
      phone: phone,
    });

    // Step 2: Create Company
    const newCompany = await db.Company.create({
      companyUserId: newUser.id,
      company_name:companyName,
      company_size:companySize,
      industry,
      location,
      jobTitle
    });

    return res.status(201).json({
      message: "Company added successfully",
      status: true 
    });
  } catch (error) {
    console.error("Error saving company:", error);
    return res.status(500).json({ message: "Internal server error" ,status: false});
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params; // User ID (companyUserId)
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      companyName,
      companySize,
      industry,
      location,
      jobTitle,
    } = req.body;

    // Fetch user
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    // Check for duplicate email (excluding current user)
    const existingEmail = await db.User.findOne({
      where: {
        email,
        id: { [Op.ne]: id },
      },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use", status: false });
    }

    // Update user
    await user.update({
      firstName,
      lastName,
      email,
      phone,
      ...(password && { password: bcrypt.hashSync(password, 8) }),
    });

    // Fetch and update company
    const company = await db.Company.findOne({ where: { companyUserId: id } });
    if (!company) {
      return res.status(404).json({ message: "Company not found", status: false });
    }

    await company.update({
      company_name: companyName,
      company_size: companySize,
      industry,
      location,
      jobTitle,
    });

    return res.status(200).json({ message: "Company updated successfully", status: true });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({ message: "Internal server error", status: false });
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


export { saveCompany, getCompanyListing, deleteCompanyUser, getCompanyRequestById, updateCompany};
