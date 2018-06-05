const express = require('express');
const app = express();

const mongoose = require('mongoose');
const morgan = require('morgan');
const hbs = require('express-handlebars');

const config = require('./config')
const DB_URL = config.DB_URL;
const PORT = config.PORT;

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

app.get('/', (req, res, next) => {
    res.render('root');
})

app.get('/branch', (req, res, next) => {
    res.render('branch');
})

app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
})
