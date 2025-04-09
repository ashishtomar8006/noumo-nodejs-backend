import db from "../models/index.js"
import bcrypt from "bcryptjs"
// Get all users with optional filtering
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let whereCondition = { isActive: true };

    // If search term is provided
    if (search) {
      whereCondition = {
        ...whereCondition,
        [db.Sequelize.Op.or]: [
          { username: { [db.Sequelize.Op.like]: `%${search}%` } },
          { email: { [db.Sequelize.Op.like]: `%${search}%` } },
          { firstName: { [db.Sequelize.Op.like]: `%${search}%` } },
          { lastName: { [db.Sequelize.Op.like]: `%${search}%` } },
        ],
      };
    }

    const users = await db.User.findAll({
      where: whereCondition,
      attributes: { exclude: ["password"] },
      include: [
        {
          model: db.Role, 
          as: "role", // This must match the alias in User.belongsTo(models.Role, { as: "role" })
          attributes: ["id", "name"], // Adjust fields as needed
        },
      ],
    });

    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: err.message, error: err });
  }
};


const getAllUniversity = async (req,res)=>{
  try {
    // Fetch users where roleId = 3 (Universities)
    const universities = await db.User.findAll({
      where: { roleId: 4,isActive:true }
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
      }catch (err) {
        console.error("Signup Error:", err);
      
        let errorMessage = "Something went wrong. Please try again.";
      
        if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
          const messages = err.errors.map((e) => {
            if (e.path === "email" && e.validatorKey === "not_unique") {
              return "Email is already in use.";
            }
            return e.message;
          });
      
          errorMessage = messages.join(", ");
        }
      
        res.status(500).send({
          message: errorMessage,
          errors: err.errors,
          status: 0
        });
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

const deleteUniversity = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).send({ message: "User not found." })
    }
    
    await user.update({ isActive: false })

    res.status(200).send({ message: "User deleted successfully." })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      return res.status(404).send({ message: "User not found." })
    }

    res.status(200).send(user)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Update user
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, bio, profilePicture } = req.body

    // Check if user exists
    const user = await db.User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).send({ message: "User not found." })
    }

    // Check if user is updating their own profile or is an admin
    if (req.userId !== user.id) {
      const currentUser = await db.User.findByPk(req.userId, {
        include: [
          {
            model: db.Role,
            attributes: ["name"],
            through: { attributes: [] },
          },
        ],
      })

      const isAdmin = currentUser.Roles.some((role) => role.name === "admin")
      if (!isAdmin) {
        return res.status(403).send({ message: "You can only update your own profile." })
      }
    }

    // Update user
    await user.update({
      firstName,
      lastName,
      email,
      bio,
      profilePicture,
    })

    res.status(200).send({
      message: "User updated successfully.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Delete user (soft delete)
const deleteUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).send({ message: "User not found." })
    }

    await user.update({ isActive: false })

    res.status(200).send({ message: "User deleted successfully." })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

export { getUsers, getUserById, updateUser, deleteUser,getAllUniversity,addUniversity,updateUniversity,deleteUniversity }

