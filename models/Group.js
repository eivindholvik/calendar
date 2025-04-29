const { Sequelize, DataTypes, Model } = require('sequelize');
module.exports = (sequelize) => {
  class Group extends Model { }

  Group.init({
    GroupId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // CreatedAt & UpdatedAt managed by Sequelize
  }, {
    sequelize,
    modelName: 'Group',
    tableName: 'Group',
    timestamps: true,
  });
  return Group;
}