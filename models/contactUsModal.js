const ContactUs = (sequelize, DataTypes) => {
  const Contact = sequelize.define("Contact", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    message: {
      type: DataTypes.STRING(1000), // You can adjust length as needed
      allowNull: true
    }
  }, {
    tableName: "ContactUs",
    timestamps: true // Optional: createdAt and updatedAt fields
  });

  return Contact;
};

export default ContactUs;
