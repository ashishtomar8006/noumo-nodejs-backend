import db from "../models/index.js"

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, duration, level, price, categoryId, isPublished } = req.body

    // Check if user is a mentor
    const user = await db.User.findByPk(req.userId, {
      include: [
        {
          model: db.Role,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    })

    const isMentor = user.Roles.some((role) => role.name === "mentor")
    if (!isMentor) {
      return res.status(403).send({ message: "Only mentors can create courses." })
    }

    // Check if category exists
    if (categoryId) {
      const category = await db.CourseCategory.findByPk(categoryId)
      if (!category) {
        return res.status(404).send({ message: "Category not found." })
      }
    }

    // Create course
    const course = await db.Course.create({
      title,
      description,
      thumbnail,
      duration,
      level,
      price,
      categoryId,
      mentorId: req.userId,
      isPublished: isPublished || false,
    })

    res.status(201).send({
      message: "Course created successfully!",
      course,
    })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Get all courses with optional filtering
const getCourses = async (req, res) => {
  try {
    const { category, level, mentor, search, published } = req.query
    let whereCondition = {}
    const includeCondition = [
      {
        model: db.User,
        as: "mentor",
        attributes: ["id", "username", "firstName", "lastName", "profilePicture"],
      },
      {
        model: db.CourseCategory,
        as: "category",
        attributes: ["id", "name", "icon"],
      },
    ]

    // Filter by published status
    if (published !== undefined) {
      whereCondition.isPublished = published === "true"
    }

    // Filter by category
    if (category) {
      whereCondition.categoryId = category
    }

    // Filter by level
    if (level) {
      whereCondition.level = level
    }

    // Filter by mentor
    if (mentor) {
      whereCondition.mentorId = mentor
    }

    // Search by title or description
    if (search) {
      whereCondition = {
        ...whereCondition,
        [db.Sequelize.Op.or]: [
          { title: { [db.Sequelize.Op.like]: `%${search}%` } },
          { description: { [db.Sequelize.Op.like]: `%${search}%` } },
        ],
      }
    }

    const courses = await db.Course.findAll({
      where: whereCondition,
      include: includeCondition,
    })

    res.status(200).send(courses)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await db.Course.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          as: "mentor",
          attributes: ["id", "username", "firstName", "lastName", "profilePicture", "bio"],
        },
        {
          model: db.CourseCategory,
          as: "category",
          attributes: ["id", "name", "icon", "description"],
        },
        {
          model: db.User,
          as: "students",
          attributes: ["id", "username", "firstName", "lastName", "profilePicture"],
          through: { attributes: ["enrollmentDate", "status", "progress"] },
        },
      ],
    })

    if (!course) {
      return res.status(404).send({ message: "Course not found." })
    }

    res.status(200).send(course)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Update course
const updateCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, duration, level, price, categoryId, isPublished } = req.body

    // Check if course exists
    const course = await db.Course.findByPk(req.params.id)
    if (!course) {
      return res.status(404).send({ message: "Course not found." })
    }

    // Check if user is the mentor of this course or an admin
    if (course.mentorId !== req.userId) {
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
        return res.status(403).send({ message: "You can only update your own courses." })
      }
    }

    // Check if category exists
    if (categoryId) {
      const category = await db.CourseCategory.findByPk(categoryId)
      if (!category) {
        return res.status(404).send({ message: "Category not found." })
      }
    }

    // Update course
    await course.update({
      title,
      description,
      thumbnail,
      duration,
      level,
      price,
      categoryId,
      isPublished,
    })

    res.status(200).send({
      message: "Course updated successfully.",
      course,
    })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Delete course
const deleteCourse = async (req, res) => {
  try {
    // Check if course exists
    const course = await db.Course.findByPk(req.params.id)
    if (!course) {
      return res.status(404).send({ message: "Course not found." })
    }

    // Check if user is the mentor of this course or an admin
    if (course.mentorId !== req.userId) {
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
        return res.status(403).send({ message: "You can only delete your own courses." })
      }
    }

    // Delete course
    await course.destroy()

    res.status(200).send({ message: "Course deleted successfully." })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Enroll in a course
const enrollCourse = async (req, res) => {
  try {
    // Check if course exists and is published
    const course = await db.Course.findOne({
      where: {
        id: req.params.id,
        isPublished: true,
      },
    })

    if (!course) {
      return res.status(404).send({ message: "Course not found or not published." })
    }

    // Check if user is already enrolled
    const enrollment = await db.Enrollment.findOne({
      where: {
        userId: req.userId,
        courseId: req.params.id,
      },
    })

    if (enrollment) {
      return res.status(400).send({ message: "You are already enrolled in this course." })
    }

    // Create enrollment
    await db.Enrollment.create({
      userId: req.userId,
      courseId: req.params.id,
      status: "enrolled",
      progress: 0,
    })

    res.status(201).send({ message: "Successfully enrolled in the course." })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

export { createCourse, getCourses, getCourseById, updateCourse, deleteCourse, enrollCourse }

