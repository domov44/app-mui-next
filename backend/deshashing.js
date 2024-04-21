// Pour déhasher au login
//app.post('/user', (req, res) => { // Requête connexion 
//     const sql = "SELECT * FROM user WHERE `email` = ? AND `password` = ?";
//     db.query(sql, [req.body.email, req.body.password], (err, data) => {
//       if (err) {
//         return res.json("Error");
//       }
//       if (data.length > 0) {
//         const id = data[0].id;
//         const token = jwt.sign({ id }, "jwtSecretKey", { expiresIn: 30000 });
//         return res.json({ Login: true, token, data });
//       } else {
//         return res.json("Faile");
//       }
//     })
//   })
