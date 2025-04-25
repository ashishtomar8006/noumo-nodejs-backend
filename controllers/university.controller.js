import db from "../models/index.js"
import bcrypt from "bcryptjs"
import { UniqueConstraintError } from "sequelize";
import { Op } from "sequelize";

const getAllUniversity = async (req, res) => {
  try {
    // Fetch users where roleId = 3 (Universities)
    const universities = await db.User.findAll({
      where: { roleId: 4,isActive:true },
      include: [{
        model: db.University,
        as: "University"
      }]
    });

    // Check if universities exist
    if (!universities.length) {
      return res.status(404).json({ data: [], message: "No universities found." });
    }

    // Return universities
    res.status(200).json({ success: true, data: universities });
  } catch (error) {
    console.error("Error fetching universities:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}


const addUniversity = async (req, res) => {
  try {
    const {
      universityName,
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      jobTitle,
      phone,
      universityType,
      industry,
      faculty,
      yearOfStudy,
      location
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match",
        status: 0,
      });
    }

    const roleData = await db.Role.findOne({ where: { name: "university" } });

    if (!roleData) {
      return res.status(404).json({
        message: "University role not found",
        status: 0,
      });
    }

    const user = await db.User.create({
      email,
      password: bcrypt.hashSync(password, 8),
      firstName,
      lastName,
      phone,
      roleId: 4,
    });

    await db.University.create({
      universityUserId: user.id,
      industry,
      university_name: universityName,
      universityType,
      jobTitle,
      location,
      faculty,
      yearOfStudy,
    });

    res.status(201).json({
      message: "University registered successfully!",
      userId: user.id,
      status: 1,
    });
  } catch (err) {
    console.error("Signup Error:", err);

    if (err instanceof UniqueConstraintError) {
      return res.status(400).json({
        message: "Email is already in use",
        status: 0,
      });
    }

    res.status(500).json({
      message: err.message || "Internal server error",
      errors: err.errors,
      status: 0,
    });
  }
};


const updateUniversity = async (req, res) => {
  try {
    const {
      universityName,
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      jobTitle,
      phone,
      universityType,
      industry,
      faculty,
      yearOfStudy,
      location,
    } = req.body;

    const { id } = req.params; // user ID

    // Check password confirmation only if password is being updated
    if (password && password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match",
        status: 0,
      });
    }

    // Check for duplicate email
    const existingEmail = await db.User.findOne({
      where: {
        email,
        id: { [Op.ne]: id },
      },
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already in use",
        status: 0,
      });
    }

    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 0,
      });
    }

    await user.update({
      email,
      password: password ? bcrypt.hashSync(password, 8) : user.password,
      firstName,
      lastName,
      phone,
    });

    const university = await db.University.findOne({
      where: { universityUserId: id },
    });

    if (!university) {
      return res.status(404).json({
        message: "University not found",
        status: 0,
      });
    }

    await university.update({
      university_name: universityName,
      industry,
      universityType,
      jobTitle,
      location,
      faculty,
      yearOfStudy,
    });

    res.status(200).json({
      message: "University updated successfully!",
      status: 1,
    });
  } catch (err) {
    console.error("Update Error:", err);

    if (err instanceof UniqueConstraintError) {
      return res.status(400).json({
        message: "Email is already in use",
        status: 0,
      });
    }

    res.status(500).json({
      message: err.message || "Internal server error",
      errors: err.errors,
      status: 0,
    });
  }
};



// Delete user (soft delete)
const deleteUniversity = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).send({ message: "User not found." })
    }

    const currentUser = await db.User.findByPk(req.userId)

    // Soft delete by setting isActive to false
    await user.update({ isActive: false })

    res.status(200).send({ message: "User deleted successfully." })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}


const getUniversityById = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [{
        model: db.University,
        as: "University"
      }]
    })

    if (!user) {
      return res.status(404).send({ message: "User not found." })
    }

    res.status(200).send(user)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

export { deleteUniversity, getAllUniversity, addUniversity, updateUniversity, getUniversityById }

