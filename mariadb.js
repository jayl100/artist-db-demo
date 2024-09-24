// Get the client
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Music',
});


module.exports = connection;
//

//
// // Using placeholders
// try {
//     const [results] = await connection.query(
//         'SELECT * FROM `songs`'
//     );
//
//     console.log(results[0]);
// } catch (err) {
//     console.log(err);
// }