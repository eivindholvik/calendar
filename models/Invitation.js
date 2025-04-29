const { Sequelize, DataTypes, Model } = require('sequelize');
module.exports = (sequelize) => {
  class Invitation extends Model { }

  Invitation.init({
    InvitationsId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Status: {
      type: DataTypes.ENUM('pending', 'accepted', 'declined', 'tentative'),
      allowNull: false,
      defaultValue: 'pending',
    },
    StatusTimestamp: {
      type: DataTypes.DATE, // Store timestamp when status last changed
      allowNull: true, // Set manually when status changes
      // Removed default/onUpdate to control it via logic
    },
    DEADLINE: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    Event_EventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Event",
        key: 'EventId',
      },
    },
    User_UserId: { // Invitee
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: 'UserId',
      },
    },
    Group_GroupId: { // Optional source group
      type: DataTypes.INTEGER,
      allowNull: true, // Invitation doesn't *have* to come from a group
      references: {
        model: "Group",
        key: 'GroupId',
      },
    },
    Calendar_CalendarId: { // Invitee's target calendar (optional initially)
      type: DataTypes.INTEGER,
      allowNull: true, // Set to NULL initially, user selects upon acceptance
      references: {
        model: "Calendar",
        key: 'CalendarId',
      },
    },
    Viewed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // CreatedAt & UpdatedAt managed by Sequelize
  }, {
    sequelize,
    modelName: 'Invitation',
    tableName: 'Invitations',
    timestamps: true,
    indexes: [ // Define unique index matching the SQL
      { unique: true, fields: ['Event_EventId', 'User_UserId', 'Calendar_CalendarId'], name: 'unique_invitation' }
    ]
  });
  return Invitation;
}