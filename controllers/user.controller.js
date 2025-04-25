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

export { getUsers, getUserById, updateUser, deleteUser}

