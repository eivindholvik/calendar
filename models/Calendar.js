const { Sequelize, DataTypes, Model } = require('sequelize');
module.exports = (sequelize) => {
  class Calendar extends Model { }

  Calendar.init({
    CalendarId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Color: {
      type: DataTypes.STRING(45),
      allowNull: true, // e.g., '#FF5733'
    },
    User_UserId: { // Foreign Key for the owner
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: 'UserId',
      },
    },
    // CreatedAt & UpdatedAt managed by Sequelize
  }, {
    sequelize,
    modelName: 'Calendar',
    tableName: 'Calendar',
    timestamps: true,
  });
  return Calendar;
}