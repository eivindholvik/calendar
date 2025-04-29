const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model {
    // Method to check password validity
    async isValidPassword(password) {
      return bcrypt.compare(password, this.PasswordHash);
    }
  }

  User.init({
    UserId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    FullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    PasswordHash: {
      type: DataTypes.STRING(255), // Store the hash, not the plain password
      allowNull: false,
    },
    // Salt: {
    //   type: DataTypes.STRING(45),
    //   allowNull: false, // Salt is typically included in the bcrypt hash itself now
    //   // This field might be redundant if using modern bcrypt libraries
    //   // Keeping it based on the schema, but consider removing if unused.
    // },
    // CreatedAt & UpdatedAt managed by Sequelize via options below
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'User', // Explicitly set table name
    timestamps: true, // Let Sequelize manage CreatedAt and UpdatedAt
    hooks: {
      // Hash password before creating a user
      beforeCreate: async (user) => {
        if (user.PasswordHash) {
          const saltRounds = 10; // Or your preferred cost factor
          // Generate salt (often included in hash) and hash password
          // Modern bcrypt libraries often combine salt generation and hashing
          const hash = await bcrypt.hash(user.PasswordHash, saltRounds);
          // If your bcrypt library stores salt separately, generate and store it:
          // const salt = await bcrypt.genSalt(saltRounds);
          // const hash = await bcrypt.hash(user.PasswordHash, salt);
          // user.Salt = salt; // Store the salt if needed
          user.PasswordHash = hash; // Store the final hash
        }
      },
      // Optionally hash password before updating if it's changed
      beforeUpdate: async (user) => {
        if (user.changed('PasswordHash')) { // Only hash if the password field was changed
          const saltRounds = 10;
          const hash = await bcrypt.hash(user.PasswordHash, saltRounds);
          user.PasswordHash = hash;
          // Update salt if necessary based on your bcrypt strategy
        }
      }
    }
  })
  return User;
};