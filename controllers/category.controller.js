import db from "../models/index.js"

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body

    // Check if user is an admin
    const user = await db.User.findByPk(req.userId, {
      include: [
        {
          model: db.Role,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    })

    const isAdmin = user.Roles.some((role) => role.name === "admin")
    if (!isAdmin) {
      return res.status(403).send({ message: "Only administrators can create categories." })
    }

    // Check if category already exists
    const existingCategory = await db.CourseCategory.findOne({
      where: { name },
    })

    if (existingCategory) {
      return res.status(400).send({ message: "Category already exists." })
    }

    // Create category
    const category = await db.CourseCategory.create({
      name,
      description,
      icon,
    })

    res.status(201).send({
      message: "Category created successfully!",
      category,
    })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await db.CourseCategory.findAll({
      include: [
        {
          model: db.Course,
          as: "courses",
          attributes: ["id"],
        },
      ],
    })

    // Add course count to each category
    const categoriesWithCount = categories.map((category) => {
      const plainCategory = category.get({ plain: true })
      plainCategory.courseCount = plainCategory.courses.length
      delete plainCategory.courses
      return plainCategory
    })

    res.status(200).send(categoriesWithCount)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await db.CourseCategory.findByPk(req.params.id, {
      include: [
        {
          model: db.Course,
          as: "courses",
          include: [
            {
              model: db.User,
              as: "mentor",
              attributes: ["id", "username", "firstName", "lastName", "profilePicture"],
            },
          ],
        },
      ],
    })

    if (!category) {
      return res.status(404).send({ message: "Category not found." })
    }

    res.status(200).send(category)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Update category
const updateCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body

    // Check if user is an admin
    const user = await db.User.findByPk(req.userId, {
      include: [
        {
          model: db.Role,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    })

    const isAdmin = user.Roles.some((role) => role.name === "admin")
    if (!isAdmin) {
      return res.status(403).send({ message: "Only administrators can update categories." })
    }

    // Check if category exists
    const category = await db.CourseCategory.findByPk(req.params.id)
    if (!category) {
      return res.status(404).send({ message: "Category not found." })
    }

    // Update category
    await category.update({
      name,
      description,
      icon,
    })

    res.status(200).send({
      message: "Category updated successfully.",
      category,
    })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Delete category
const deleteCategory = async (req, res) => {
  try {
    // Check if user is an admin
    const user = await db.User.findByPk(req.userId, {
      include: [
        {
          model: db.Role,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    })

    const isAdmin = user.Roles.some((role) => role.name === "admin")
    if (!isAdmin) {
      return res.status(403).send({ message: "Only administrators can delete categories." })
    }

    // Check if category exists
    const category = await db.CourseCategory.findByPk(req.params.id)
    if (!category) {
      return res.status(404).send({ message: "Category not found." })
    }

    // Check if category has courses
    const courseCount = await db.Course.count({
      where: { categoryId: req.params.id },
    })

    if (courseCount > 0) {
      return res.status(400).send({
        message: "Cannot delete category with associated courses. Please reassign or delete the courses first.",
      })
    }

    // Delete category
    await category.destroy()

    res.status(200).send({ message: "Category deleted successfully." })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

export { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory }

