const { Sequelize, Op } = require('sequelize');
const connection = require("../config");

const sequelize = new Sequelize(connection);

const User = require("./User")(sequelize);
const Calendar = require("./Calendar")(sequelize);
const Event = require("./Event")(sequelize);
const Group = require("./Group")(sequelize);
const Invitation = require("./Invitation")(sequelize);
const UserGroup = require("./UserGroup")(sequelize);

// User <-> Group (Many-to-Many)
User.belongsToMany(Group, {
  through: UserGroup,
  foreignKey: 'User_UserId', // FK in UserGroup pointing to User
  otherKey: 'Group_GroupId', // FK in UserGroup pointing to Group
  as: 'groups'
});
Group.belongsToMany(User, {
  through: UserGroup,
  foreignKey: 'Group_GroupId', // FK in UserGroup pointing to Group
  otherKey: 'User_UserId', // FK in UserGroup pointing to User
  as: 'users'
});

// User -> Calendar (One-to-Many)
User.hasMany(Calendar, {
  foreignKey: { name: 'User_UserId', allowNull: false },
  as: 'calendars',
  onDelete: 'CASCADE' // Match SQL constraint
});
Calendar.belongsTo(User, {
  foreignKey: 'User_UserId',
  as: 'owner'
});

// Calendar -> Event (One-to-Many)
Calendar.hasMany(Event, {
  foreignKey: { name: 'Calendar_CalendarId', allowNull: false },
  as: 'events',
  onDelete: 'CASCADE' // Match SQL constraint
});
Event.belongsTo(Calendar, {
  foreignKey: 'Calendar_CalendarId',
  as: 'primaryCalendar'
});

// Event <-> User (Many-to-Many through Invitations)
// Use specific associations to Invitation instead for more clarity
// Event.belongsToMany(User, { through: Invitation, ... }); // Less direct control
// User.belongsToMany(Event, { through: Invitation, ... });

// --- Direct relationships involving Invitations ---

// Event -> Invitations (One-to-Many)
Event.hasMany(Invitation, {
  foreignKey: { name: 'Event_EventId', allowNull: false },
  as: 'invitations',
  onDelete: 'CASCADE' // Match SQL constraint
});
Invitation.belongsTo(Event, {
  foreignKey: 'Event_EventId',
  as: 'event'
});

// User -> Invitations (One-to-Many - as Invitee)
User.hasMany(Invitation, {
  foreignKey: { name: 'User_UserId', allowNull: false },
  as: 'receivedInvitations',
  onDelete: 'CASCADE' // Match SQL constraint
});
Invitation.belongsTo(User, {
  foreignKey: 'User_UserId',
  as: 'invitee'
});

// Group -> Invitations (One-to-Many - as Source)
Group.hasMany(Invitation, {
  foreignKey: { name: 'Group_GroupId', allowNull: true }, // Nullable FK
  as: 'sentInvitations', // Invitations sent via this group
  onDelete: 'SET NULL' // Match SQL constraint
});
Invitation.belongsTo(Group, {
  foreignKey: 'Group_GroupId',
  as: 'sourceGroup' // The group (if any) used for the invitation
});

// Calendar -> Invitations (One-to-Many - as Target Calendar)
Calendar.hasMany(Invitation, {
  foreignKey: { name: 'Calendar_CalendarId', allowNull: true }, // Nullable FK
  as: 'targetedInvitations', // Invitations targeting this specific calendar
  onDelete: 'SET NULL' // Match SQL constraint (was CASCADE, changed to SET NULL per schema)
});
Invitation.belongsTo(Calendar, {
  foreignKey: 'Calendar_CalendarId',
  as: 'targetCalendar' // The calendar the invite appears on if accepted
});

// Export models and sequelize instance
const db = {
  sequelize,
  Sequelize,
  User,
  Group,
  UserGroup,
  Calendar,
  Event,
  Invitation,
};

module.exports = db;
