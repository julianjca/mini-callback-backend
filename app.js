const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const { Sequelize } = require('sequelize');
const cors = require('cors')

const indexRouter = require('./src/routes/index');
const callbackRouter = require('./src/routes/callbacks')

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/callbacks', callbackRouter)

// const sequelize = new Sequelize('xenelectronic', 'postgres', 'postgres', {
//   host: 'localhost',
//   dialect: 'postgres'
// });

// sequelize.authenticate().then(() => console.log('Connection has been established successfully.'))

module.exports = app;
