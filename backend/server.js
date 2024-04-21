const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const requestsByIp = {}
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const app = express();
const user = require('./routes/user');
const role = require('./routes/role');
const log = require('./routes/log');
const blacklist = require('./routes/blacklist');
const auth = require('./routes/auth');

app.use('/images/user', express.static('public/images/user'));
app.use('/images/cover', express.static('public/images/cover'));
app.use('/images/recette', express.static('public/images/recette'));
app.use('/images/app', express.static('public/images/app'));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", true)
app.use(fileUpload());

const csp = "default-src 'none'; img-src 'self' data:;";
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', csp);
  next();
});

// routes personnalisées MVC
app.use('/', user);
app.use('/', auth);
app.use('/', role);
app.use('/', log);
app.use('/', blacklist);


app.listen(8081, () => {
  console.log("listening");
})