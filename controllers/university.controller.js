import db from "../models/index.js"
import bcrypt from "bcryptjs"

const getAllUniversity = async (req,res)=>{
  try {
    // Fetch users where roleId = 3 (Universities)
    const universities = await db.User.findAll({
      where: { roleId: 4 }
    });

    // Check if universities exist
    if (!universities.length) {
      return res.status(404).json({data:[], message: "No universities found." });
    }

    // Return universities
    res.status(200).json({ success: true, data: universities });
  } catch (error) {
    console.error("Error fetching universities:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

const addUniversity = async (req,res)=>{
     try {
        const { email, password,universityName,yearOfStudy,faculty } = req.body;
    
        const roleData = await db.Role.findOne({ where: { name: "university" } })
       
        const userData = {
          email,
          password: bcrypt.hashSync(password, 8),
          firstName:universityName,
          roleId:roleData.id,
          universityName,
          yearOfStudy,
          faculty
        };
        
        const user = await db.User.create(userData)
    
    
        res.status(201).send({
          message: "User registered successfully!",
          userId: user.id,
          status:1
        })
      } catch (err) {    
        console.error("Signup Error:", err);
        res.status(500).send({ message: err.message, errors: err.errors,status:0});
      }
}
const updateUniversity = async (req, res) => {
  try {
    const { email, password, universityName, yearOfStudy, faculty } = req.body;

    // Find the university by ID
    const university = await db.User.findByPk(req.params.id);
    
    if (!university) {
      return res.status(404).json({ message: "University not found." });
    }
  
    // Check if the new email already exists (excluding the current university)
    if (email && email !== university.email) {
      const existingEmail = await db.User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email is already in use by another university." });
      }
    }

    // Prepare the updated data
    const updatedData = { email, universityName, yearOfStudy, faculty };

    // Hash the password if it's provided
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    // Update the university
    await university.update(updatedData);

    res.status(200).json({
      message: "University updated successfully.",
      university: {
        id: university.id,
        email: university.email,
        universityName: university.universityName,
        yearOfStudy: university.yearOfStudy,
        faculty: university.faculty,
      },
    });
  } catch (err) {
    // Handle Sequelize unique constraint errors
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email is already in use." });
    }
    
    console.error("Update error:", err);
    res.status(500).json({ message: "Internal server error." });
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

export { deleteUniversity,getAllUniversity,addUniversity,updateUniversity }

