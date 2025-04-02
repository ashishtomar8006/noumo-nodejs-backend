import jwt from "jsonwebtoken"
import db from "../models/index.js"

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"]?.split(" ")[1]

  if (!token) {
    return res.status(403).send({ message: "No token provided!" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" })
    }
    req.userId = decoded.id
    next()
  })
}
const isAdmin = async (req, res, next) => {
  try {
    // Fetch user with role data
    const user = await db.User.findByPk(req.userId, {
      include: {
        model: db.Role,
        as: "role", // Must match the alias in the association
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Check if user has an "admin" role
    if (user.role && user.role.name === "admin") {
      return next(); // User is an admin, proceed to next middleware
    }

    return res.status(403).send({ message: "Require Admin Role!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};


const isMentor = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.userId, {
      include: db.Role,
    })

    if (!user) {
      return res.status(404).send({ message: "User not found." })
    }

    for (let i = 0; i < user.Roles.length; i++) {
      if (user.Roles[i].name === "mentor" || user.Roles[i].name === "admin") {
        return next()
      }
    }

    return res.status(403).send({ message: "Require Mentor Role!" })
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

const isStudent = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.userId, {
      include: db.Role,
    })

    if (!user) {
      return res.status(404).send({ message: "User not found." })
    }

    for (let i = 0; i < user.Roles.length; i++) {
      if (user.Roles[i].name === "student") {
        return next()
      }
    }

    return res.status(403).send({ message: "Require Student Role!" })
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

export { verifyToken, isAdmin, isMentor, isStudent }

