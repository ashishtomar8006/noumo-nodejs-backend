import db from "../models/index.js"
import bcrypt from "bcryptjs"

const getAlTraningPartner = async (req,res)=>{
  try {
    // Fetch users where roleId = 3 (trainingpartners)
    const trainingpartners = await db.User.findAll({
      where: { roleId: 6,isActive:true }
    });

    // Check if trainingpartners exist
    if (!trainingpartners.length) {
      return res.status(404).json({data:[], message: "No Training Partners found." });
    }

    // Return trainingpartners
    res.status(200).json({ success: true, data: trainingpartners });
  } catch (error) {
    console.error("Error fetching Training Partners:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

const addTraningPartner = async (req,res)=>{
     try {
        const { email, password,firstName,lastName,industry } = req.body;
    
        const roleData = await db.Role.findOne({ where: { name: "partner" } })
       
        const userData = {
          email,
          password: bcrypt.hashSync(password, 8),
          firstName:firstName,
          lastName:lastName,
          roleId:roleData.id,
          industry
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

const updateTrainingPartner = async (req, res) => {
  try {
    const { email, password, firstName, lastName, industry } = req.body;

    // Find the training partner by ID
    const trainingPartner = await db.User.findByPk(req.params.id);

    if (!trainingPartner) {
      return res.status(404).json({ message: "Training Partner not found." });
    }

    // Check if the new email is already taken by someone else
    if (email && email !== trainingPartner.email) {
      const existingEmail = await db.User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email is already in use by another Training Partner." });
      }
    }

    // Prepare the updated data
    const updatedData = {
      email,
      firstName,
      lastName,
      industry,
    };

    // Hash the new password if provided
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    // Update the training partner
    await trainingPartner.update(updatedData);

    res.status(200).json({
      message: "Training Partner updated successfully.",
      trainingPartner: {
        id: trainingPartner.id,
        email: trainingPartner.email,
        firstName: trainingPartner.firstName,
        lastName: trainingPartner.lastName,
        industry: trainingPartner.industry,
      },
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email is already in use." });
    }

    console.error("Update error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};


const deleteTraningPartner = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).send({ message: "Traning Partner not found." })
    }
    
    await user.update({ isActive: false })

    res.status(200).send({ message: "Traning Partner deleted successfully." })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Get user by ID
const getTrainingPartnerById = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      return res.status(404).send({ message: "Traning Partner not found." })
    }

    res.status(200).send(user)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

export {  getTrainingPartnerById,getAlTraningPartner,addTraningPartner,updateTrainingPartner,deleteTraningPartner }

