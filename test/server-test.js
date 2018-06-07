const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const should = chai.should();

const {app, runServer, closeServer} = require('../index');
const {TEST_DB_URL, PORT} = require('../config');
const Post = require('../models/post');

chai.use(chaiHttp);

// CREATE SEED DATA FOR DB, TEAR DOWN TEST DB WHEN DONE

// Seed Data for Test DB
function seedTestDb() {
    console.info(`seeding test db`);
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push({
            author: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            },
            title: faker.lorem.sentence(),
            content: faker.lorem.text()
        });
    }

    return Post.insertMany(seedData);
}

// Tear down db after use
function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn(`tearing down db`);
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

describe('blog post API resource', function() {

    before(function() {
        return runServer(TEST_DB_URL, PORT);
    });

    beforeEach(function() {
        return seedTestDb();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    describe('GET endpoint', function() {
        it('should return all existing posts', function() {
            let res;
            return chai.request(app)
                .get('/blog/api')
                .then(_res => {
                    res = _res;
                    res.should.have.status(200);

                    res.body.should.have.lengthOf.at.least(1);
                    return Post.count();
                })
                .then(count => {
                    res.body.should.have.lengthOf(count);
                });
        });


    });

});