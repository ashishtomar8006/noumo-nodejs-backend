import { Sequelize } from "sequelize"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// const sequelize = new Sequelize('noumo_db', "root", "", {
//   host: "127.0.0.1",
//   dialect: "mysql",
//   port: process.env.DB_PORT || 3306,
// });

const sequelize = new Sequelize("bcfhcbl92qlh0fqorpgs", "urd1j91nu1qnslnx", "smCLzUKYRWheAVmXaCMR", {
  host: "bcfhcbl92qlh0fqorpgs-mysql.services.clever-cloud.com",
  dialect: "mysql",
  port: 3306,
});

const connectDB = async () => {
  try {
    sequelize.sync({ force: false }) // Change to true if you want to drop existing tables
      .then(() => {
        console.log("✅ Database synced successfully!")
      })
      .catch((err) => {
        console.error("❌ Error syncing database:", err)
      })


  } catch (error) {
    console.error("❌ Database connection failed:", error)
    process.exit(1)
  }
}




export { sequelize, connectDB }

