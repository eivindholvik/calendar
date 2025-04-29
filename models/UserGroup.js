const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class UserGroup extends Model { }

  UserGroup.init({
    // Define composite primary key in associations, not needed here explicitly unless adding extra fields
    User_UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: 'UserId',
      },
      primaryKey: true // Part of composite PK
    },
    Group_GroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Group",
        key: 'GroupId',
      },
      primaryKey: true // Part of composite PK
    },
    createdAt: { // Match column name 'createdAt' from schema for this table
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      field: 'createdAt' // Explicit mapping needed if different from Sequelize default
    },
  }, {
    sequelize,
    modelName: 'UserGroup',
    tableName: 'User_has_Group',
    timestamps: true, // Enable Sequelize timestamps
    updatedAt: false, // Disable 'updatedAt' as it's not in the schema
    createdAt: 'createdAt', // Map to the correct column name
  });
  return UserGroup;
}
