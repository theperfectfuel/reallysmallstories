const express = require('express');
const app = express();

const mongoose = require('mongoose');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const methodOverride = require('method-override');

const config = require('./config')
const DB_URL = config.DB_URL;
const PORT = config.PORT;

const blogRouter = require('./routes/blog');

mongoose.Promise = global.Promise;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('common'));
app.use(express.static('views'));
app.use(methodOverride('_method'));

app.use('/blog', blogRouter);

app.engine('.hbs', hbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

app.get('/', (req, res, next) => {
    res.render('root');
});

app.get('/new-post', (req, res, next) => {
    res.render('new-post');
});

let server;

function runServer(DB_URL, PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(PORT, () => {
                console.log(`app listening on port: ${PORT}`);
                resolve();
            })
            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log(`closing server`);
                server.close(err => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        });
}

if (require.main === module) {
    console.log(DB_URL, PORT);
    runServer(DB_URL, PORT).catch(err => {
        console.error(err);
    });
}

module.exports = {app, runServer, closeServer};
