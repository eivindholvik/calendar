const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Event extends Model { }

  Event.init({
    EventId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    StartTime: {
      type: DataTypes.DATE, // Use DATE for TIMESTAMP
      allowNull: false,
    },
    EndTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    AllDay: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    Location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Calendar_CalendarId: { // Foreign Key for the primary calendar
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Calendar",
        key: 'CalendarId',
      },
    },
    // CreatedAt & UpdatedAt managed by Sequelize
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'Event',
    timestamps: true,
    validate: {
      endTimeAfterStartTime() {
        if (this.EndTime && this.StartTime && this.EndTime <= this.StartTime) {
          throw new Error('End time must be after start time.');
        }
      }
    }
  });
  return Event;
}