'use strict'

exports.DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/mehn-blog';
exports.TEST_DB_URL = process.env.TEST_DB_URL || 'mongodb://localhost:27017/test-mehn-blog';
exports.PORT = process.env.PORT || '8080';