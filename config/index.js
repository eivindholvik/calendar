const connection = {
  database: process.env.DB_NAME,
  username: process.env.DB_ADMIN_USERNAME,
  password: process.env.DB_ADMIN_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  dialectmodel: process.env.DB_DIALECTMODEL,
  logging: console.log, // Set to false in production or use a logger
  define: {
    // Match the SQL schema's timestamp column names
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
  }
};

// const connect = Object.assign(connection, {
//   logging: console.log, // Set to false in production or use a logger
//   define: {
//     // Match the SQL schema's timestamp column names
//     createdAt: 'CreatedAt',
//     updatedAt: 'UpdatedAt',
//   }
// });

// const connect1 = {
//   ...connection,
//   logging: console.log, // Set to false in production or use a logger
//   define: {
//     // Match the SQL schema's timestamp column names
//     createdAt: 'CreatedAt',
//     updatedAt: 'UpdatedAt',
//   }
// }

module.exports = connection;