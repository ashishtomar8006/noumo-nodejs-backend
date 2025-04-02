import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import db from "../models/index.js"

const signup = async (req, res) => {
  try {
    const { username, email, password, firstname, lastname, role,employer,industry } = req.body;

    const roleData = await db.Role.findOne({ where: { name: role } })
   
    const userData = {
      username,
      employer,
      industry,
      email,
      password: bcrypt.hashSync(password, 8),
      firstName:firstname,
      lastName:lastname,
      roleId:roleData.id,
    };
    if(role == 'mentee'){
      userData.experienceLevel =req.body.experienceLevel;
      userData.mentoringGoals = req.body.mentoringGoals;
    }

    const user = await db.User.create(userData)


    res.status(201).send({
      message: "User registered successfully!",
      userId: user.id,
      status:1
    })
  } catch (err) {    
    console.error("Signup Error:", err);
    res.status(500).send({ message: err.message, errors: err.errors,status:0});
    // res.status(500).send({ message: err.message })
  }
}

const signin = async (req, res) => {
  try {
    // Find user
    const user = await db.User.findOne({
      where: {
        email: req.body.email,
        isActive: true,
      },include: [
        {
          model: db.Role,
          as: "role", // Ensure this matches the alias in your association
          attributes: ["id", "name"], // Include only relevant fields
        },
      ],
      
    })
 

    if (!user) {
      return res.status(404).send({ message: "User not found or inactive." })
    }

    // Verify password
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid password!",
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: 86400 }, // 24 hours
    )
    // Send response
    res.status(200).send({
      id: user.id,
      username: user.username || "",
      email: user.email,
      role:user.role.name,
      firstName: user.firstName,
      lastName: user.lastName,
      accessToken: token,
    })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

export { signup, signin }

