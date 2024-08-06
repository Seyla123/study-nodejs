// const mysql = require('mysql2');

// const db = mysql.createPool({
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   connectionLimit: 10,
// });

// db.getConnection((err) => {
//   if (err) {
//     console.log('connection error in database', err);
//   } else {
//     console.log('Connected to database successfully');
//   }
// });

// module.exports = db.promise();

// const user = new User(null, 'seav seyla', 'mail1@mail.com', 'seyla123', 'manager', 'pf.jpg', '123456789');
// //userId, UserName, Email, Password, Role, ProfilePicture, ContactNumber
// user
//   .addUser()
//   .then(() => {
//     console.log('user created');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const getUser = async (id) => {
//   const user = await User.findById(id);
//   console.log(user);
//   return user;
// };

// console.log(getUser(10));
// sequelize
//   .sync()
//   .then((result) => {
//     console.log('success');
//   })
//   .catch((err) => {
//     console.log('fail');
//   });
