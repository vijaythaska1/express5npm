const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("./confing/db")
const indexRouter = require('./routes/index');
const cors = require("cors");
require('dotenv').config()

const port = process.env.Port
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


app.listen(port, () => {
  console.log(`server run ${port}`);

})



module.exports = app;

  