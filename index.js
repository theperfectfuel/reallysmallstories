const express = require('express');
const app = express();

const mongoose = require('mongoose');
const morgan = require('morgan');
const hbs = require('express-handlebars');

const config = require('./config')
const DB_URL = config.DB_URL;
const PORT = config.PORT;

const blogRouter = require('./routes/blog');

mongoose.Promise = global.Promise;

app.use(express.json());
app.use(morgan('common'));

app.use('/blog', blogRouter);

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

app.get('/', (req, res, next) => {
    res.render('root');
});

app.get('/branch', (req, res, next) => {
    res.render('branch');
});

let server;

function runServer() {
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
    runServer(DB_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
